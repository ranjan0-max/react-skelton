//React
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import useAuth from 'customHook/useAuth';


// csutome datatable
import DataTable from 'componets/DataTable';

// api
import { getDepartment } from 'api/department/departmentApi';
import { getCategory } from 'api/category/categoryApi';
import { getUser } from 'api/user/useApi';
import { createTask, getTask, updateTask } from 'api/task/taskApi';

//icons
import ArchiveIcon from '@rsuite/icons/Archive';

// constant
import { fontFamily } from 'constant/constant';
import { ADMIN, CLIENT } from '../../../constant/constant';



const Task = () => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [data, setData] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const [filterData, setFilterData] = useState({});
    const controllerRef = React.useRef(null);

    // fetch task request list
    const fetchTaskList = async (
        page = pagination.page,
        limit = pagination.limit,
        searchTerm = '',
        filter = {},
    ) => {
        try {
            const query = {};
            query.page = page;
            query.limit = limit;
            query.isArchived = true;
            setPagination({ page, limit });

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();

            if (searchTerm) {
                query.search = searchTerm.trim();
            }

            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user?.role?.name === CLIENT) {
                query.clientId = user.clientId;
            } else {
                query.clientId = user.clientId;
            }

            const response = await getTask(query, { signal: controllerRef.current.signal });
            if (response) {
                if (typeof response?.data === 'string') {
                    openTostar(response?.data, 'error');
                } else {
                    setData(response?.data);
                    setTotalRows(response?.count);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // fetch department request list
    const fetchDepartmentList = async () => {
        try {
            const query = {}
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }
            const response = await getDepartment(query);
            if (typeof response.data === 'string') {
                openTostar(response.data, 'error');
            } else {
                setDepartmentList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // fetch category request list
    const fetchCategoryList = async () => {
        try {
            const query = {}
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }
            const response = await getCategory(query);
            if (typeof response.data === 'string') {
                openTostar(response.data, 'error');
            } else {
                setCategoryList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // fetch User list
    const fetchUsers = async () => {
        try {
            let query = {};
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }
            const response = await getUser(query);
            if (typeof response.data === 'string') {
                openTostar(response.data, 'error');
            } else {
                setUserList(response.data);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // set the headers and actions
    const headers = [
        { id: 'taskTitle', label: 'TITLE', align: 'center', render: (row) => row?.taskTitle },
        { id: 'departmentId', label: 'DEPARTMENT', align: 'center', render: (row) => row?.Department?.name },
        { id: 'categoryId', label: 'CATEGORY', align: 'center', render: (row) => row?.Category?.name },
        { id: 'raiseTo', label: 'RAISED TO', align: 'center', render: (row) => row?.raisedTo_name },
        { id: 'closeDate', label: 'CLOSE DATE', align: 'center', render: (row) => row?.closeDate },
        { id: 'status', label: 'Status', align: 'center', render: (row) => row?.status }
    ];

    const actions = [
        {
            title: 'Unarchived',
            icon: <ArchiveIcon />,
            handler: (row) => handleArchiveTask(row)
        }
    ];

    const handleArchiveTask = async (row) => {
        try {
            const payload = {
                isArchived: false,
                clientId: user.clientId || clientIdForAdmin
            };

            const response = await updateTask(row.id, payload);

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar('Task unarchived successfully', 'success');
                fetchTaskList();
            }
        } catch (error) {
            console.log(error);
            openTostar('Failed to unarchive task', 'error');
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchTaskList(page + 1, rowsPerPage, searchData, filterData);
    }

    const handleSearchAndFilter = (searchTerm, filters) => {
        setSearchData(searchTerm);
        setFilterData(filters)
        fetchTaskList(pagination.page, pagination.limit, searchTerm, filters);
    };

    React.useEffect(() => {
        if (user?.role?.name === ADMIN && !clientIdForAdmin) return;
        fetchDepartmentList();
        fetchCategoryList();
        fetchUsers();
        fetchTaskList();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div >
                <DataTable
                    headers={headers}
                    tableTitle="Archived Task List"
                    actions={actions}
                    data={data}
                    fontFamily={fontFamily}
                    totalRows={totalRows}
                    handlePageChange={handlePageChange}
                    searchTerm={searchData}
                    handleSearchAndFilter={handleSearchAndFilter}
                />
            </div>
        </>
    );
};

export default Task;
