//React
import useSnackbarAlert from 'customHook/alert';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useAuth from 'customHook/useAuth';
import { Modal } from 'rsuite';

// custom datatable
import DataTable from 'componets/DataTable';

// model
import DynamicForm from 'componets/DynamicForm';
import Chat from '../chat/index';

// api
import { getDepartment } from 'api/department/departmentApi';
import { getCategory } from 'api/category/categoryApi';
import { getUser } from 'api/user/useApi';
import { createRecurrenceTask, getRecurrenceTask, updateRecurrenceTask } from '../../../api/recurrenceTask/recurrenceTaskApi';

//icons
import EditIcon from '@rsuite/icons/Edit';
import WechatIcon from '@rsuite/icons/Wechat';

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

const frequencyOptions = [
    { id: 'DAILY', name: 'Daily' },
    { id: 'WEEKLY', name: 'Weekly' },
    { id: 'MONTHLY', name: 'Monthly' }
];

const RecurrenceTask = () => {
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
    const controllerRef = React.useRef(null);

    // fetch recurrence task list
    const fetchRecurrenceTaskList = async (
        page = 1,
        limit = 10,
        searchTerm = '',
        filter = {},
    ) => {
        try {
            const query = {};
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

            if (filter) {
                filterFields.forEach(field => {
                    const key = field.name;

                    if (filter[key] && filter[key] !== "") {
                        if (key === "raisedToCreatedBy") {
                            if (filter[key] === 'RAISED') {
                                query["raisedTo"] = user.id;
                            } else if (filter[key] === 'CREATED_BY') {
                                query["createdBy"] = user.id;
                            }
                        } else if (key === "closedDate") {
                            if (filter.closedDate === "CUSTOM") {
                                if (filter.startDate && filter.endDate) {
                                    query.closedDate = "CUSTOM";
                                    query.startDate = filter.startDate;
                                    query.endDate = filter.endDate;
                                }
                            } else {
                                query.closedDate = filter.closedDate;
                            }
                        } else {
                            if (filter[key] !== '') {
                                query[key] = filter[key]
                            }
                        }
                    }
                })
            };

            if (user?.role?.name === ADMIN) {
                query.clientId = clientIdForAdmin
            } else if (user?.role?.name === CLIENT) {
                query.clientId = user.clientId;
            } else {
                query.clientId = user.clientId;
            }

            const response = await getRecurrenceTask(query, { signal: controllerRef.current.signal });
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
        { id: 'frequency', label: 'FREQUENCY', align: 'center', render: (row) => row?.frequency },
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

    // fields for form
    const fields = [
        { name: 'departmentId', label: 'Department', type: 'select', options: departmentList },
        { name: 'raisedTo', label: 'Recipient', type: 'select', options: userList },
        { name: 'categoryId', label: 'Category', type: 'select', options: categoryList },
        { name: 'taskTitle', label: 'Task Title', type: 'text' },
        // { name: 'closeDate', label: 'Expected End Date', type: 'date' },
        { name: 'attachments', label: 'Attachment', type: 'image', multiple: true },
        { name: 'taskBody', label: 'Task Body', type: 'textarea' },
        { name: 'frequency', label: 'Frequency', type: 'select', options: frequencyOptions, required: true },
    ];

    // filters
    const filterFields = [
        { name: 'closedDate', label: 'Close Date', options: closeDateList, acccess: true },
        { name: 'userId', label: 'User', options: userList, acccess: (user?.role?.name === ADMIN || user?.role?.name === CLIENT) },
        { name: 'raisedToCreatedBy', label: 'Recipient', options: raiseToCreatedByList, acccess: true },
        { name: 'status', label: 'Status', options: statusList, acccess: true },
        { name: 'frequency', label: 'Frequency', options: frequencyOptions, acccess: true }
    ];

    // validation schema
    const customValidationSchema = Yup.object().shape({
        raisedTo: Yup.number().required('This field is required'),
        taskTitle: Yup.string().required('This field is required'),
        // closeDate: Yup.date().required('This field is required'),
        taskBody: Yup.string().required("Task body is required"),
        frequency: Yup.string().required("Frequency is required")
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
            title: 'Active Status',
            isSwitch: true,
            property: 'isScheduleActive',
            handler: (row) => handleToggleActiveStatus(row)
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

    // handle create or update recurrence task
    const handleCreateUpdateRecurrenceTask = async (values) => {
        values.clientId = user.clientId || clientIdForAdmin;
        values.createdBy = user.id;

        if (!values.departmentId) {
            delete values.departmentId;
        }

        if (!values.categoryId) {
            delete values.categoryId
        }

        try {
            let response = null;

            if (initialData.id) {
                response = await updateRecurrenceTask(initialData.id, values);
            } else {
                response = await createRecurrenceTask(values);
            }

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar(response.data.message, 'success');
                handleModalClose();
                fetchDepartmentList();
                fetchRecurrenceTaskList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleStatusChange = async (row, newStatus) => {
        try {
            const payload = { status: newStatus, clientId: user.clientId || clientIdForAdmin };
            const response = await updateRecurrenceTask(row.id, payload);

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

    const handleToggleActiveStatus = async (row) => {
        try {
            const updatedStatus = !row.isScheduleActive;

            const response = await updateRecurrenceTask(row.id, {
                isScheduleActive: updatedStatus,
                clientId: user.clientId || clientIdForAdmin
            });

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                openTostar('Schedule status updated', 'success');
                fetchRecurrenceTaskList();
            }
        } catch (error) {
            openTostar('Failed to update status', 'error');
        }
    };

    const handlePageChange = (page, rowsPerPage) => {
        fetchRecurrenceTaskList(page + 1, rowsPerPage, searchData, filterData);
    }

    const handleSearchAndFilter = (searchTerm, filters) => {
        setSearchData(searchTerm);
        setFilterData(filters)
        fetchRecurrenceTaskList(pagination.page || 1, pagination.limit || 10, searchTerm, filters);
    };

    React.useEffect(() => {
        if (user?.role?.name === ADMIN && !clientIdForAdmin) return;
        fetchDepartmentList();
        fetchCategoryList();
        fetchUsers();
        fetchRecurrenceTaskList();
    }, [clientIdForAdmin]);

    return (
        <>
            <SnackbarComponent />
            <div {...(isModalOpen ? { inert: 'true' } : {})}>
                <DataTable
                    headers={headers}
                    tableTitle="Recurrence Task List"
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
                        onSubmit={handleCreateUpdateRecurrenceTask}
                        title="Recurrence Task Form"
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

export default RecurrenceTask;