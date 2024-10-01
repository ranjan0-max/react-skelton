import { useTostar } from 'customHook/tostar';
import { useEffect } from 'react';
import EnhancedDataTable from 'componets/dataTable';

// icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const DashBoard = () => {
    const tostar = useTostar();
    const headers = [
        { id: 'jobNumber', label: 'Job Number', align: 'center' },
        { id: 'customerName', label: 'Customer Name', align: 'center' },
        { id: 'status', label: 'Status', align: 'center' },
        { id: 'date', label: 'Date', align: 'center' }
    ];

    const data = [
        {
            jobNumber: 123,
            customerName: 'Ranjan',
            status: 'DONE',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43wedw'
        },
        {
            jobNumber: 111,
            customerName: 'Pankaj',
            status: 'WORK',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43weda'
        },
        {
            jobNumber: 1,
            customerName: 'Vikas',
            status: 'WORK',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43wedg'
        },
        {
            jobNumber: 3,
            customerName: 'Sanjay',
            status: 'WORK',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43wedc'
        },
        {
            jobNumber: 2,
            customerName: 'Pradeep',
            status: 'WORK',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43wedd'
        },
        {
            jobNumber: 4,
            customerName: 'Akash',
            status: 'WORK',
            date: new Date().toLocaleDateString(),
            _id: '234rdsdftr43wede'
        }
    ];

    const handleAddButton = (row) => {
        console.log('add button', row);
    };

    const handleEditButton = (row) => {
        console.log('edit button', row);
    };

    useEffect(() => {
        const loginSuccessful = true;

        if (loginSuccessful) {
            tostar('Login successful', 'success');
        }
    }, [tostar]);

    const actions = [
        { icon: <AddIcon />, handler: handleAddButton, title: 'Add' },
        { icon: <EditIcon />, handler: handleEditButton, title: 'Edit' }
    ];

    return <EnhancedDataTable headers={headers} data={data} tableTitle="TEST LIST" addButton={handleAddButton} actions={actions} />;
};

export default DashBoard;
