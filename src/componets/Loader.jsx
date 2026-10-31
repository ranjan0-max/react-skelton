import React from 'react';
import { CircularProgress, Typography } from '@mui/material';
import theme from '../componets/Theme';

const Loader = () => {

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1301,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <CircularProgress size={48} sx={{ color: theme.palette.primary.main }} />
            <Typography sx={{ color: theme.palette.primary.main }}>Loading...</Typography>
        </div>
    );
}

export default Loader;
