//React
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useAuth from 'customHook/useAuth';

// csutome datatable
import DataTable from 'componets/DataTable';

// model
import DynamicForm from 'componets/DynamicForm';

// api
import { getDepartment } from 'api/department/departmentApi';
import { createCategory, getCategory, updateCategory } from 'api/category/categoryApi';

//icons
import EditIcon from '@rsuite/icons/Edit';

// constant
import { Modal } from 'rsuite';
import { fontFamily, ADMIN } from 'constant/constant';

const Department = () => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [initialData, setInitialData] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const controllerRef = React.useRef(null);

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

    // fetch category request lists
    const fetchCategoryList = async (page = pagination.page, limit = pagination.limit, searchTerm = '') => {
        try {
            const query = {}
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();

            if (searchTerm) {
                query.search = searchTerm.trim();
            }
            query.page = page;
            query.limit = limit;
            setPagination({ page, limit })

            const response = await getCategory(query, { signal: controllerRef.current.signal });
            if (response) {
                if (typeof response.data === 'string') {
                    openTostar(response.data, 'error');
                } else {
                    setData(response.data);
                    setTotalRows(response?.count);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // set the headers and actions
    const headers = [
        { id: 'name', label: 'NAME', align: 'center', render: (row) => row?.name },
        { id: 'departmentId', label: 'DEPARTMENT', align: 'center', render: (row) => row?.Department?.name }
    ];

    // feilds for form
    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        {
            name: 'departmentId',
            label: 'Department',
            type: 'select',
            options: departmentList
        }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        name: Yup.string().required('This field is required'),
        departmentId: Yup.string().required('This field is required')
    });

    const actions = [
        {
            title: 'Edit',
            icon: <EditIcon />,
            handler: (row) => {
                setInitialData(row);
                setIsModalOpen(true);
            }
        }
    ];
    // -=-=-=-=-=-=-=- end of setter of header and action buttons -=-=-=-=-=-=-=-=-=-

    // add button
    const addButton = () => {
        setIsModalOpen(true);
        setInitialData({});
    };

    // close the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // handle create or update department
    const handleCreateUpdateCategory = async (values) => {
        values.clientId = user.clientId || clientIdForAdmin;
        try {
            let response = null;

            if (initialData.id) {
                response = await updateCategory(initialData.id, values);
            } else {
                response = await createCategory(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchCategoryList();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handlePageChange = (page, rowsPerPage) => {
        fetchCategoryList(page + 1, rowsPerPage);
    }

    const handleSearch = (searchTerm) => {
        setSearchData(searchTerm);
        fetchCategoryList(pagination.page, pagination.limit, searchTerm);
    };

    React.useEffect(() => {
        if (user?.role?.name === ADMIN && !clientIdForAdmin) return;
        fetchDepartmentList();
        fetchCategoryList();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Category List"
                    actions={actions}
                    data={data}
                    totalRows={totalRows}
                    fontFamily={fontFamily}
                    addButton={addButton}
                    handlePageChange={handlePageChange}
                    searchTerm={searchData}
                    handleSearchAndFilter={handleSearch}
                />
            </div>
            <Modal open={isModalOpen}
                onClose={handleModalClose}
                size="sm"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                    minHeight: '200px'
                }}
                overflow={false} >
                <Modal.Body style={{ padding: 0 }}>
                    <DynamicForm
                        initialData={initialData}
                        onSubmit={handleCreateUpdateCategory}
                        title="Category Form"
                        onClose={handleModalClose}
                        fields={fields}
                        fontFamily={fontFamily}
                        validationSchema={customValidationSchema}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Department;
