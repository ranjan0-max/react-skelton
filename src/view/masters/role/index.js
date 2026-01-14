//React
import { Chip } from '@mui/material';
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useAuth from 'customHook/useAuth';

// csutome datatable
import DataTable from 'componets/DataTable';

// model
import DynamicForm from 'componets/DynamicForm';

// api
import { createRole, getRole, updateRole } from 'api/role/roleApi';

//icons
import EditIcon from '@rsuite/icons/Edit';

// constant
import { Modal } from 'rsuite';
import { fontFamily } from 'constant/constant';

const Driver = () => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedRole, setSelectedRole] = useState({});
    const [modelEvent, setModelEvent] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const controllerRef = React.useRef(null);


    // fetch prescription list
    const fetchRoleList = async (page = pagination.page, limit = pagination.limit, searchTerm = '') => {
        try {
            let query = {};
            if (user.role.name !== 'ADMIN') {
                query = { name: { notIn: ['ADMIN', 'CLIENT'] } };
            } else {
                query.clientId = clientIdForAdmin
            }

            query.page = page;
            query.limit = limit;
            setPagination({ page, limit });

            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            controllerRef.current = new AbortController();

            if (searchTerm) {
                query.search = searchTerm.trim();
            }

            const response = await getRole(query, { signal: controllerRef.current.signal });
            if (response) {
                if (typeof response.data === 'string') {
                    openTostar(response.data, 'error');
                } else {
                    setRows(response.data || []);
                    setTotalRows(response?.count);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRoleListForMapping = async () => {
        try {
            let query = {};
            if (user.role.name !== 'ADMIN') {
                query = { name: { notIn: ['ADMIN', 'CLIENT'] } };
            }

            const response = await getRole(query);
            if (typeof response.data === 'string') {
                openTostar(response.data, 'error');
            } else {
                setRoleList(response.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // set the headers and action

    const headers = [
        { id: 'name', label: 'NAME', align: 'center', render: (row) => row?.name },
        { id: 'roleId', label: 'MANAGING ROLE', align: 'center', render: (row) => row?.managingRoleName }
    ];

    // feilds for form
    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'roleId', label: 'Managing Role', type: 'select', options: roleList }
    ];

    // validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('This field is required')
    });

    const actions = [
        {
            title: 'Update Role',
            icon: <EditIcon />,
            handler: (row) => {
                setModelEvent(true);
                setSelectedRole(row);
                setIsModalOpen(true);
            }
        }
    ];

    // handle add button click
    const addButton = () => {
        setModelEvent(false);
        setIsModalOpen(true);
    };
    // -=-=-=-=-=-=-=- end of setter of header and action buttons -=-=-=-=-=-=-=-=-=-

    // close the modal
    const handleModalClose = () => {
        setModelEvent(false);
        setIsModalOpen(false);
        setSelectedRole({});
    };

    // create the dirver
    const handleRoleCreate = async (data) => {
        try {
            data.clientId = user.clientId || clientIdForAdmin;
            const response = await createRole(data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                setIsModalOpen(false);
                fetchRoleList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // update the dirver
    const handleRoleUpdate = async (id, data) => {
        try {
            const response = await updateRole(id, data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                setIsModalOpen(false);
                fetchRoleList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchRoleList(page + 1, rowsPerPage);
    }

    const handleSearch = (searchTerm) => {
        setSearchData(searchTerm);
        fetchRoleList(pagination.page, pagination.limit, searchTerm);
    };

    React.useEffect(() => {
        fetchRoleList();
        fetchRoleListForMapping();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Role List"
                    actions={actions}
                    data={rows}
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
                }}>
                <Modal.Body style={{ padding: 0 }}>
                    <DynamicForm
                        initialData={selectedRole}
                        onSubmit={(data) => {
                            if (modelEvent) {
                                handleRoleUpdate(selectedRole.id, data);
                            } else {
                                handleRoleCreate(data);
                            }
                        }}
                        title="Role Form"
                        onClose={handleModalClose}
                        fields={fields}
                        fontFamily={fontFamily}
                        validationSchema={validationSchema}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Driver;

// {
//     id: 'status',
//     label: 'STATUS',
//     align: 'center',
//     render: (row) => (
//         <Chip
//             label={row.activeStatus === true ? 'Active' : 'In Active'}
//             color={handleStatusColor(row.activeStatus)}
//             sx={{ fontFamily }}
//         />
//     )
// }
