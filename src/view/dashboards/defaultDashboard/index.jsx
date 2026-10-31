import { Typography } from '@mui/material';
import { fontFamily } from 'constant/constant';

export default function DefaultDashboard() {
    return (
        <Typography variant="h4" component="h2" sx={{ fontFamily: fontFamily, textAlign: 'center' }}>
            Welcome to Admin Dashboard
        </Typography>
    );
}
