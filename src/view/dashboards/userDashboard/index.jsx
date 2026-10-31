import TaskIcon from '@mui/icons-material/Task';
import PeoplesIcon from '@mui/icons-material/People';
import { Grid, Paper, Typography } from '@mui/material';
import { fontFamily } from 'constant/constant';
import { useEffect, useState } from 'react';
import { getUserDashboardData } from 'api/dashboard/dashboardApi';
import useAuth from 'customHook/useAuth';
import useSnackbarAlert from 'customHook/alert';

const cardSx = {
    p: 2,
    borderRadius: '10px',
    transition: '0.3s ease',
    textAlign: 'center',
    border: '1px solid #e5e5e5'
};

const DashboardCard = ({ icon: Icon, label, value }) => (
    <Paper elevation={3} sx={cardSx}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Icon style={{ fontSize: 25, alignSelf: 'center' }} />
            <Typography sx={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>{label}</Typography>
        </div>
        <Typography sx={{ fontSize: '32px', fontFamily }}>{value}</Typography>
    </Paper>
);

export default function UserDashboard() {
    const { user } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [dashboardData, setDashboardData] = useState({
        totalReceived: 0,
        totalRaised: 0
    });

    const fetchUserDashboardData = async () => {
        try {
            const response = await getUserDashboardData({ clientId: user.clientId });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setDashboardData(response);
            }
        } catch (err) {
            console.log("Failed to fetch dashboard data:", err);
        }
    };

    useEffect(() => {
        fetchUserDashboardData();
    }, []);

    return (
        <div style={{ border: '1px solid #e5e5e5', padding: '10px', marginTop: '1%', borderRadius: '5px' }}>
            <SnackbarComponent />

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={PeoplesIcon} label="Raised To" value={dashboardData.totalReceived} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={TaskIcon} label="Created By" value={dashboardData.totalRaised} />
                </Grid>
            </Grid>
        </div>
    );
}
