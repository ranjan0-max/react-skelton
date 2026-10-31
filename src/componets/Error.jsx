import React from 'react';
import { Box, Paper } from '@mui/material';

const Error = () => {
    return (
        <Box
            sx={{
                height: '100%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box sx={{ width: '83%' }}>
                <Paper variant="outlined" sx={{ p: '30px', maxWidth: 400, mx: 'auto' }}>

                    <h2 style={{ marginBottom: 15, fontWeight: 600 }}>
                        Oops! Page not found.
                    </h2>

                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: 20 }}>
                        The page you are looking for might have been removed or is temporarily unavailable.
                    </p>
                </Paper>
            </Box>
        </Box>
    );
};

export default Error;
