//React
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useAuth from 'customHook/useAuth';
import { Chip } from '@mui/material';
import { Modal } from 'rsuite';
import { Loader } from 'rsuite';

// csutome datatable
import DataTable from 'componets/DataTable';

// model
import DynamicForm from 'componets/DynamicForm';
import Chat from '../chat/index';

// api
import { getDepartment } from 'api/department/departmentApi';
import { getCategory } from 'api/category/categoryApi';
import { getUser } from 'api/user/useApi';
import { createTask, getTask, updateTask } from 'api/task/taskApi';

//icons
import EditIcon from '@rsuite/icons/Edit';
import WechatIcon from '@rsuite/icons/Wechat';
import ArchiveIcon from '@rsuite/icons/Archive';

// constant
import { fontFamily } from 'constant/constant';
import { ADMIN, CLIENT } from '../../../constant/constant';

const statusList = [
    { id: 'DELIGATE', name: 'DELIGATE' },
    { id: 'RE_OPEN', name: 'RE_OPEN' },
    { id: 'HOLD', name: 'HOLD' },
    { id: 'CLOSED', name: 'CLOSED' },
    { id: 'DELAYED', name: 'DELAYED' }
];

const statusColors = {
    DELIGATE: '#4caf50',
    RE_OPEN: '#2196f3',
    HOLD: '#ff9800',
    CLOSED: '#1f201fff',
    DELAYED: '#f44336'
};

const raiseToCreatedByList = [
    { id: 'RAISED', name: 'RAISED' },
    { id: 'CREATED_BY', name: 'CREATED_BY' }
];

const closeDateList = [
    { id: 'TODAY', name: 'Today' },
    { id: 'YESTERDAY', name: 'Yesterday' },
    { id: 'TOMORROW', name: 'Tomorrow' },
    { id: 'LAST_7_DAYS', name: 'Last 7 Days' },
    { id: 'LAST_30_DAYS', name: 'Last 30 Days' },
    { id: 'THIS_MONTH', name: 'This Month' },
    { id: 'LAST_MONTH', name: 'Last Month' },
    { id: 'CUSTOM', name: 'Custom Date' }
];

const Task = () => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [initialData, setInitialData] = useState({});
    const [selectedTask, setSelectedTask] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const [filterData, setFilterData] = useState({});
    const [ready, setReady] = useState(false);
    const controllerRef = React.useRef(null);

    // fetch task request list
    const fetchTaskList = async (page = pagination.page, limit = pagination.limit, searchTerm = '', filter = {}) => {
        try {
            const query = {};
            query.page = page;
            query.limit = limit;
            query.isArchived = false;
            setPagination({ page, limit });

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();

            if (searchTerm) {
                query.search = searchTerm.trim();
            }

            if (filter) {
                filterFields.forEach((field) => {
                    const key = field.name;

                    if (filter[key] && filter[key] !== '') {
                        if (key === 'raisedToCreatedBy') {
                            if (filter[key] === 'RAISED') {
                                query['raisedTo'] = user.id;
                            } else if (filter[key] === 'CREATED_BY') {
                                query['createdBy'] = user.id;
                            }
                        } else if (key === 'closedDate') {
                            if (filter.closedDate === 'CUSTOM') {
                                if (filter.startDate && filter.endDate) {
                                    query.closedDate = 'CUSTOM';
                                    query.startDate = filter.startDate;
                                    query.endDate = filter.endDate;
                                }
                            } else {
                                query.closedDate = filter.closedDate;
                            }
                        } else {
                            if (filter[key] !== '') {
                                query[key] = filter[key];
                            }
                        }
                    }
                });
            }

            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin;
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
            const query = {};
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin;
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
            const query = {};
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin;
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

    // set the headers and action
    const headers = [
        { id: 'taskTitle', label: 'TITLE', align: 'center', render: (row) => row?.taskTitle },
        { id: 'departmentId', label: 'DEPARTMENT', align: 'center', render: (row) => row?.Department?.name },
        { id: 'categoryId', label: 'CATEGORY', align: 'center', render: (row) => row?.Category?.name },
        { id: 'raiseTo', label: 'RAISED TO', align: 'center', render: (row) => row?.raisedTo_name },
        { id: 'closeDate', label: 'CLOSE DATE', align: 'center', render: (row) => row?.closeDate },
        {
            id: 'status', label: 'Status', align: 'center', render: (row) =>
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e.target.value)}
                    style={{
                        fontFamily,
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid #ccc',
                        backgroundColor: statusColors[row.status] || '#e0e0e0',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    {statusList.map((s) => (
                        <option
                            key={s.id}
                            value={s.id}
                            style={{ color: 'black' }}
                        >
                            {s.name}
                        </option>
                    ))}
                </select>
        }
    ];

    // feilds for form
    const fields = [
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentList },
        { name: 'raisedTo', label: 'Recipient', type: 'select', options: userList },
        { name: 'categoryId', label: 'Category', type: 'select', options: categoryList },
        { name: 'taskTitle', label: 'Task Title', type: 'text' },
        { name: 'closeDate', label: 'Expected End Date', type: 'date' },
        { name: 'attachments', label: 'Attachment', type: 'image', multiple: true },
        { name: 'taskBody', label: 'Task Body', type: 'textarea' }
    ];

    // filters
    const filterFields = [
        { name: 'closedDate', label: 'Close Date', options: closeDateList, acccess: true },
        { name: 'userId', label: 'User', options: userList, acccess: user?.role?.name === ADMIN || user?.role?.name === CLIENT },
        { name: 'raisedToCreatedBy', label: 'Recipient', options: raiseToCreatedByList, acccess: true },
        { name: 'status', label: 'Status', options: statusList, acccess: true }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        raisedTo: Yup.number().required('This field is required'),
        taskTitle: Yup.string().required('This field is required'),
        closeDate: Yup.date().required('This field is required'),
        taskBody: Yup.string().required("Task body is required")
    });

    const actions = [
        {
            title: 'Edit',
            icon: <EditIcon />,
            handler: (row) => {
                setInitialData(row);
                setIsModalOpen(true);
            }
        },
        {
            title: 'Chat',
            icon: <WechatIcon />,
            handler: (row) => {
                setSelectedTask(row);
                setIsChatModalOpen(true);
            }
        },
        {
            title: 'Archive',
            icon: <ArchiveIcon />,
            handler: (row) => handleArchiveTask(row)
        }
    ];
    // -=-=-=-=-=-=-=- end of setter of header and action buttons -=-=-=-=-=-=-=-=-=-=-=-

    // add button
    const addButton = () => {
        setInitialData({});
        setIsModalOpen(true);
    };

    // close the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // handle create or update department
    const handleCreateUpdateTask = async (values) => {
        values.clientId = user.clientId || clientIdForAdmin;
        values.createdBy = user.id;
        if (values.departmentId === '') {
            delete values.departmentId
        }
        if (values.categoryId === '') {
            delete values.categoryId
        }

        try {
            let response = null;

            if (initialData.id) {
                response = await updateTask(initialData.id, values);
            } else {
                response = await createTask(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchDepartmentList();
                fetchTaskList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleStatusChange = async (row, newStatus) => {
        try {
            const payload = { status: newStatus, clientId: user.clientId || clientIdForAdmin };
            const response = await updateTask(row.id, payload);

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar('Status updated', 'success');
                setData(prev =>
                    prev.map(item =>
                        item.id === row.id ? { ...item, status: newStatus } : item
                    )
                );
            }
        } catch (err) {
            console.log(err);
            openTostar('Failed to update status', 'error');
        }
    };

    const handleArchiveTask = async (row) => {
        try {
            const payload = {
                isArchived: true,
                clientId: user.clientId || clientIdForAdmin
            };

            const response = await updateTask(row.id, payload);

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar('Task archived successfully', 'success');
                fetchTaskList();
            }
        } catch (error) {
            console.log(error);
            openTostar('Failed to archive task', 'error');
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchTaskList(page + 1, rowsPerPage, searchData, filterData);
    };

    const handleSearchAndFilter = (searchTerm, filters) => {
        setSearchData(searchTerm);
        setFilterData(filters);
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
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Task List"
                    actions={actions}
                    data={data}
                    fontFamily={fontFamily}
                    addButton={addButton}
                    totalRows={totalRows}
                    filterFields={filterFields}
                    handlePageChange={handlePageChange}
                    searchTerm={searchData}
                    handleSearchAndFilter={handleSearchAndFilter}
                    statusColors={statusColors}
                />
            </div>
            <Modal open={isModalOpen}
                onClose={handleModalClose}
                size="sm"
                onEntered={() => setReady(true)}
                onExited={() => setReady(false)}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                    minHeight: '200px'
                }}>
                <Modal.Body style={{ padding: 0 }}>
                    {ready ? (
                        <DynamicForm
                            initialData={initialData}
                            onSubmit={handleCreateUpdateTask}
                            title="Task Form"
                            onClose={handleModalClose}
                            fields={fields}
                            fontFamily={fontFamily}
                            validationSchema={customValidationSchema}
                        />) :
                        (<Loader />)}
                </Modal.Body>
            </Modal>
            <Modal
                open={isChatModalOpen}
                onClose={handleModalClose}
                size="sm"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                    minHeight: '200px'
                }}
            >
                <Modal.Body style={{ padding: 0 }}>
                    <Chat selectedTask={selectedTask} onClose={() => setIsChatModalOpen(false)} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Task;
