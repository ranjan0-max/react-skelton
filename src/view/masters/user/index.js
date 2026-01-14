//React
import { Modal } from 'rsuite';
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useAuth from 'customHook/useAuth';

// phone validation
import { isValidPhoneNumber } from 'libphonenumber-js/max';

// csutome datatable
import DataTable from 'componets/DataTable';

// User model
import UserConfig from './UserConfig';
import DynamicForm from 'componets/DynamicForm';

// api
import { getClientMenuList } from 'api/menu/menuApi';
import { createUser, getUser, updateUser, updateUserMenuConfig } from 'api/user/useApi';
import { getRole } from 'api/role/roleApi';
import { getDepartment } from 'api/department/departmentApi';

//icons
import EditIcon from '@rsuite/icons/Edit';
import GearIcon from '@rsuite/icons/Gear';

// constant
import { fontFamily, ADMIN, CLIENT } from 'constant/constant';

const User = () => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [roleList, setRoleList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [data, setData] = useState([]);
    const [showUserConfig, setShowUserConfig] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [initialData, setInitialData] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const controllerRef = React.useRef(null);

    // fetch User list
    const fetchUsers = async (page = pagination.page, limit = pagination.limit, searchTerm = '') => {
        try {
            let query = {};
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user.clientId) {
                query.clientId = user.clientId;
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

            const response = await getUser(query, { signal: controllerRef.current.signal });
            if (response) {
                if (typeof response.data === 'string') {
                    openTostar(response.data, 'error');
                } else {
                    const transformedData = response.data.map((item) => ({
                        ...item,
                        role: item.role?.name || '-',
                        phoneNumber: item.phoneNumber || '-'
                    }));
                    setData(transformedData);
                    setTotalRows(response?.count);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // fetch menu list
    const fetchMenuList = async () => {
        try {
            const query = {};
            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin;
            } else if (user.clientId) {
                query.clientId = user.clientId;
            }
            const response = await getClientMenuList(query);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setMenuList(response || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // update User
    const handleUpdate = async (id, data) => {
        try {
            const response = await updateUser(id, data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                fetchUsers();
                handleModalClose();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // update menu config
    const handleUpdateClientMenuConfig = async (data) => {
        try {
            const response = await updateUserMenuConfig(data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                fetchUsers();
                handleModalClose();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // fetch role
    const fetchRoleList = async () => {
        try {
            let query = {};
            if (user?.role?.name !== ADMIN) {
                query = { name: { notIn: [ADMIN, CLIENT] } };
            }
            const response = await getRole(query);
            if (typeof response.data === 'string') {
                openTostar(response.data, 'error');
            } else {
                setRoleList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // fetch department
    const fetchDepartmentList = async () => {
        try {
            let query = {};
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

    // set the headers and actions
    const headers = [
        { id: 'name', label: 'NAME', align: 'center' },
        { id: 'email', label: 'EMAIL', align: 'center' },
        { id: 'phoneNumber', label: 'PHONE NUMBER', align: 'center' },
        { id: 'role', label: 'ROLE', align: 'center' }
    ];

    // feilds for form
    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'phone' },
        { name: 'whatsAppNo', label: 'Whatsapp Number', type: 'phone' },
        { name: 'roleId', label: 'Role', type: 'select', options: roleList },
        { name: 'departmentId', label: 'Detpartment', type: 'select', options: departmentList }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        name: Yup.string().required('This field is required'),
        email: Yup.string().required('This field is required'),
        password: Yup.string().required('This field is required'),
        phoneNumber: Yup.string()
            .required('This field is required')
            .test('is-valid-phone', 'Invalid phone number', (value) => isValidPhoneNumber(value || '')),
        whatsAppNo: Yup.string()
            .required('This field is required')
            .test('is-valid-phone', 'Invalid phone number', (value) => isValidPhoneNumber(value || '')),
        roleId: Yup.number().required('This field is required'),
        departmentId: Yup.number().required('This field is required')
    });

    // handle create user
    const handleCreateUser = async (values) => {
        try {
            values.clientId = user.clientId || clientIdForAdmin
            const response = await createUser(values);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchUsers();
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            title: 'Settings',
            icon: <GearIcon />,
            handler: (row) => {
                setUserDetail(row);
                setShowUserConfig(true);
            }
        }
    ];
    // -=-=-=-=-=-=-=- end of setter of header and action buttons -=-=-=-=-=-=-=-=-

    // close the modal
    const handleModalClose = () => {
        setShowUserConfig(false);
        setIsModalOpen(false);
        setInitialData({});
    };

    // handle add button click
    const addButton = () => {
        setIsModalOpen(true);
    };

    // 
    const handlePageChange = (page, rowsPerPage) => {
        fetchUsers(page + 1, rowsPerPage);
    }

    const handleSearch = (searchTerm) => {
        setSearchData(searchTerm);
        fetchUsers(pagination.page, pagination.limit, searchTerm);
    };

    React.useEffect(() => {
        if (user?.role?.name === ADMIN && !clientIdForAdmin) return;
        fetchRoleList();
        fetchUsers();
        fetchMenuList();
        fetchDepartmentList();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="User List"
                    addButton={addButton}
                    actions={actions}
                    data={data}
                    fontFamily={fontFamily}
                    totalRows={totalRows}
                    handlePageChange={handlePageChange}
                    searchTerm={searchData}
                    handleSearchAndFilter={handleSearch}
                />
            </div>
            <Modal
                open={isModalOpen}
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
                        initialData={initialData}
                        onSubmit={(values) => {
                            if (initialData.id) {
                                handleUpdate(initialData.id, values);
                            } else {
                                values.clientId = user.clientId;
                                handleCreateUser(values);
                            }
                        }}
                        title="User Form"
                        onClose={handleModalClose}
                        fields={fields}
                        fontFamily={fontFamily}
                        validationSchema={customValidationSchema}
                    />
                </Modal.Body>
            </Modal>
            <Modal
                open={showUserConfig}
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
                    <UserConfig
                        handleCancel={handleModalClose}
                        userDetail={userDetail}
                        menuList={menuList}
                        updateUserConfig={handleUpdateClientMenuConfig}
                        fontFamily={fontFamily}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default User;
