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
import { createDepartment, getDepartment, updateDepartment } from 'api/department/departmentApi';

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
    const [initialData, setInitialData] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const controllerRef = React.useRef(null);

    // fetch prescription request list
    const fetchDepartmentList = async (page = pagination.page, limit = pagination.limit, searchTerm = '') => {
        try {
            const query = {}
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }
            query.page = page;
            query.limit = limit;
            setPagination({ page, limit })

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();

            if (searchTerm) {
                query.search = searchTerm.trim();
            }

            const response = await getDepartment(query, { signal: controllerRef.current.signal });
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
    const headers = [{ id: 'name', label: 'NAME', align: 'center' }];

    // feilds for form
    const fields = [{ name: 'name', label: 'Name', type: 'text' }];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required')
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
        setInitialData({});
        setIsModalOpen(true);
    };

    // close the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // handle create or update department
    const handleCreateUpdateDepartment = async (values) => {
        values.clientId = user.clientId || clientIdForAdmin;
        try {
            let response = null;

            if (initialData.id) {
                response = await updateDepartment(initialData.id, values);
            } else {
                response = await createDepartment(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchDepartmentList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchDepartmentList(page + 1, rowsPerPage, searchData);
    }

    const handleSearch = (searchTerm) => {
        setSearchData(searchTerm);
        fetchDepartmentList(pagination.page, pagination.limit, searchTerm);
    };


    React.useEffect(() => {
        if (user?.role?.name === ADMIN && !clientIdForAdmin) return;
        fetchDepartmentList();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Department List"
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
                    minHeight: '200px',
                }}>
                <Modal.Body style={{ padding: 0 }}>
                    <DynamicForm
                        initialData={initialData}
                        onSubmit={handleCreateUpdateDepartment}
                        title="Department Form"
                        onClose={handleModalClose}
                        fields={fields}
                        fontFamily={fontFamily}
                        validationSchema={customValidationSchema}
                    />
                </Modal.Body>
            </Modal >
        </>
    );
};

export default Department;
