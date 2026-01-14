//React
import { Modal } from 'rsuite';
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';

// phone validation
import { isValidPhoneNumber } from 'libphonenumber-js/max';

// csutome datatable
import DataTable from 'componets/DataTable';

// User model
import ClientConfig from './ClientConfig';
import DynamicForm from 'componets/DynamicForm';

// api
import { getMenu } from 'api/menu/menuApi';
import { getRoleForCreateCliet } from 'api/role/roleApi';
import { getClient, createClient, updateClient } from 'api/client/clientApi';
import { updateUserMenuConfig } from 'api/user/useApi';

//icons
import EditIcon from '@rsuite/icons/Edit';
import GearIcon from '@rsuite/icons/Gear';

// constant
import { fontFamily } from 'constant/constant';

const Client = () => {
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetail, setUserDetail] = useState({});
    const [roleList, setRoleList] = useState([]);
    const [data, setData] = useState([]);
    const [showClientConfig, setShowClientConfig] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [initialData, setInitialData] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const controllerRef = React.useRef(null);

    // fetch User list
    const fetchClients = async (page = pagination.page, limit = pagination.limit, searchTerm = '') => {
        try {
            let query = {};
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
            const response = await getClient(query, { signal: controllerRef.current.signal });
            if (response) {
                if (typeof response.data === 'string') {
                    openTostar(response, 'error');
                } else {
                    setData(response.data);
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
            const response = await getMenu();
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setMenuList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // update User
    const handleUpdateClientMenuConfig = async (data) => {
        try {
            const response = await updateUserMenuConfig(data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                fetchClients();
                handleModalClose();
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // fetch role
    const fetchRoleList = async () => {
        try {
            const response = await getRoleForCreateCliet();
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setRoleList(response);
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
        { id: 'gst', label: 'GST', align: 'center' }
    ];

    // feilds for form
    const fields = [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'phoneNumber', label: 'Phone Number', type: 'phone' },
        { name: 'address', label: 'Address', type: 'text' },
        { name: 'gst', label: 'GST', type: 'text' },
        { name: 'pan', label: 'PAN', type: 'text' },
        { name: 'roleId', label: 'Role', type: 'select', options: roleList }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        name: Yup.string().required('This field is required'),
        email: Yup.string().required('This field is required'),
        phoneNumber: Yup.string()
            .required('This field is required')
            .test('is-valid-phone', 'Invalid phone number', (value) => isValidPhoneNumber(value || '')),
        address: Yup.string().required('This field is required'),
        gst: Yup.string().required('This field is required'),
        pan: Yup.string().required('This field is required'),
        roleId: Yup.number().required('This field is required')
    });

    // handle create client
    const handleCreateClient = async (values) => {
        try {
            let response = null;

            if (initialData?.id) {
                values.old_email = initialData.email;
                response = await updateClient(initialData.id, values);
            } else {
                response = await createClient(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchClients();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleActiveStatus = async (row) => {
        try {
            const updatedStatus = !row.active;
            const response = await updateClient(row.id, { active: updatedStatus });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar('Status updated successfully', 'success');
                fetchClients();
            }
        } catch (error) {
            openTostar('Failed to update status', 'error');
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
                setShowClientConfig(true);
            }
        },
        {
            title: 'Active Status',
            isSwitch: true,
            property: 'active',
            handler: (row) => handleToggleActiveStatus(row)
        }
    ];
    // -=-=-=-=-=-=-=- end of setter of header and action buttons -=-=-=-=-=-=-=-=-=-

    // close the modal
    const handleModalClose = () => {
        setShowClientConfig(false);
        setIsModalOpen(false);
        setInitialData({});
    };

    // handle add button click
    const addButton = () => {
        setIsModalOpen(true);
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchClients(page + 1, rowsPerPage);
    }

    const handleSearch = (searchTerm) => {
        setSearchData(searchTerm);
        fetchClients(pagination.page, pagination.limit, searchTerm);
    };

    React.useEffect(() => {
        fetchRoleList();
        fetchClients();
        fetchMenuList();
    }, []);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Client List"
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
                        initialData={initialData}
                        onSubmit={handleCreateClient}
                        title="Client Form"
                        onClose={handleModalClose}
                        fields={fields}
                        fontFamily={fontFamily}
                        validationSchema={customValidationSchema}
                    />
                </Modal.Body>
            </Modal>
            <Modal open={showClientConfig}
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
                    <ClientConfig
                        handleCancel={handleModalClose}
                        userDetail={userDetail}
                        menuList={menuList}
                        updateClientConfig={handleUpdateClientMenuConfig}
                        fontFamily={fontFamily}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Client;
