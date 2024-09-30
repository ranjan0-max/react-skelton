import { useTostar } from 'customHook/tostar';
import { useEffect } from 'react';
import EnhancedDataTable from 'componets/dataTable';

// icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const DashBoard = () => {
    const tostar = useTostar();
    const headers = [
        { id: 'jobNumber', label: 'Job Number', align: 'left' },
        { id: 'customerName', label: 'Customer Name', align: 'left' },
        { id: 'status', label: 'Status', align: 'left' },
        { id: 'date', label: 'Date', align: 'left' }
    ];

    const data = [
        {
            jobNumber: 123,
            customerName: 'Ranjan',
            status: 'DONE',
            date: new Date().toLocaleDateString()
        },
        {
            jobNumber: 111,
            customerName: 'Pankaj',
            status: 'WORK',
            date: new Date().toLocaleDateString()
        },
        {
            jobNumber: 1,
            customerName: 'Vikas',
            status: 'WORK',
            date: new Date().toLocaleDateString()
        },
        {
            jobNumber: 3,
            customerName: 'Sanjay',
            status: 'WORK',
            date: new Date().toLocaleDateString()
        },
        {
            jobNumber: 2,
            customerName: 'Pradeep',
            status: 'WORK',
            date: new Date().toLocaleDateString()
        },
        {
            jobNumber: 4,
            customerName: 'Akash',
            status: 'WORK',
            date: new Date().toLocaleDateString()
        }
    ];

    const handleAddButton = () => {
        console.log('add button');
    };

    const handleEditButton = () => {
        console.log('edit button');
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
