import TaskIcon from '@mui/icons-material/Task';
import TimeIcon from '@mui/icons-material/AccessTime';
import PauseOutlineIcon from '@mui/icons-material/PauseCircle';
import DateTaskIcon from '@mui/icons-material/EventNote';
import { Grid, Paper, Typography } from '@mui/material';
import { fontFamily } from 'constant/constant';
import { useEffect, useState } from 'react';
import { getClientWebDashboardData } from 'api/dashboard/dashboardApi';
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

export default function ClientDashboard() {
    const { user } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [dashboardData, setDashboardData] = useState({
        TOTAL: 0,
        DELIGATE: 0,
        DELAYED: 0,
        HOLD: 0
    });

    const fetchClientDashboardData = async () => {
        try {
            const response = await getClientWebDashboardData({ clientId: user.clientId });

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                const formatted = { TOTAL: 0, DELIGATE: 0, DELAYED: 0, HOLD: 0 };
                response.forEach(item => {
                    formatted[item.status.toUpperCase()] = item.total_number;
                    formatted.TOTAL += item.total_number;
                });
                setDashboardData(formatted);
            }
        } catch (err) {
            console.log("Dashboard error:", err);
        }
    };

    useEffect(() => {
        fetchClientDashboardData();
    }, [user]);

    return (
        <div style={{ border: '1px solid #e5e5e5', padding: '10px', marginTop: '1%', borderRadius: '5px' }}>
            <SnackbarComponent />
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={DateTaskIcon} label="Total Tasks" value={dashboardData.TOTAL} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={TimeIcon} label="Delayed Tasks" value={dashboardData.DELAYED} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={PauseOutlineIcon} label="On Hold Tasks" value={dashboardData.HOLD} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DashboardCard icon={TaskIcon} label="DELIGATE Tasks" value={dashboardData.DELIGATE} />
                </Grid>
            </Grid>
        </div>
    );
}
