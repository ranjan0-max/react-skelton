//React
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Modal } from 'rsuite';
import { Loader } from 'rsuite';

// csutome datatable
import DataTable from 'componets/DataTable';

// model
import DynamicForm from 'componets/DynamicForm';

//icons
import EditIcon from '@rsuite/icons/Edit';

// constant
import { fontFamily } from 'constant/constant';

// api
import { getMenu, createMenu, updateMenu } from 'api/menu/menuApi';

const groupOptions = [
    { id: 'process', name: 'Process' },
    { id: 'master', name: 'Master' },
];

const iconOptions = [
    { id: 'Memory', name: 'Memory' },
    { id: 'BlurOn', name: 'BlurOn' },
    { id: 'SendToDashboard', name: 'SendToDashboard' }
];

const EditUserMenu = () => {
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [initialData, setInitialData] = useState({});
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [searchData, setSearchData] = useState('');
    const [ready, setReady] = useState(false);

    // fetch task request list
    const fetchMenuList = async (
        page = pagination.page,
        limit = pagination.limit,
        searchTerm = ''
    ) => {
        try {
            const query = { page, limit };
            setPagination({ page, limit });

            if (searchTerm) {
                query.search = searchTerm.trim();
            }

            const response = await getMenu(query);

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setData(response.data);
                setTotalRows(response?.count);
            }
        } catch (error) {
            openTostar(error?.message || error, 'error');
        }
    };

    // set the headers and actions
    const headers = [
        { id: 'label', label: 'Menu Label', type: 'text' },
        { id: 'icon', label: 'Icon', type: 'select', options: iconOptions },
        { id: 'url', label: 'URL', type: 'text' },
        { id: 'group', label: 'Group', type: 'select', options: groupOptions }
    ];

    // feilds for form
    const fields = [
        { name: 'label', label: 'Menu Label', type: 'text' },
        { name: 'icon', label: 'Icon', type: 'input-select', options: iconOptions },
        { name: 'url', label: 'URL', type: 'text' },
        { name: 'group', label: 'Group', type: 'select', options: groupOptions }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        label: Yup.string().required('Menu label is required'),
        icon: Yup.string().required('Icon is required'),
        url: Yup.string().required('URL is required'),
        group: Yup.string().required('Group is required'),
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

    // handle create menu
    const handleCreateUpdateMenu = async (values) => {
        try {
            let response = null;

            if (initialData.id) {
                response = await updateMenu(initialData.id, values);
            } else {
                response = await createMenu(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchMenuList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchMenuList(page + 1, rowsPerPage, searchData);
    };

    const handleSearchAndFilter = (searchTerm) => {
        setSearchData(searchTerm);
        fetchMenuList(1, pagination.limit, searchTerm);
    };

    React.useEffect(() => {
        fetchMenuList(1, pagination.limit, '');
    }, []);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Menu List"
                    actions={actions}
                    data={data}
                    fontFamily={fontFamily}
                    addButton={addButton}
                    totalRows={totalRows}
                    handlePageChange={handlePageChange}
                    searchTerm={searchData}
                    handleSearchAndFilter={handleSearchAndFilter}
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
                            onSubmit={handleCreateUpdateMenu}
                            title="Menu Form"
                            onClose={handleModalClose}
                            fields={fields}
                            fontFamily={fontFamily}
                            validationSchema={customValidationSchema}
                        />) :
                        (<Loader />)}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default EditUserMenu;
