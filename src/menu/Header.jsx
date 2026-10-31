import React, { useState, useEffect } from 'react';
import { Box, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../componets/Theme';

// custom hook
import useAuth from 'customHook/useAuth';
import useSnackbarAlert from 'customHook/alert';

// icon
import SettingsIcon from '@mui/icons-material/Settings';

// api
import { getClient } from 'api/client/clientApi';

// constant
import { ADMIN } from 'constant/constant';

const drawerWidth = 20;

const Header = () => {
    const { logOut, user, setClientIdForAdmin } = useAuth();
    const navigate = useNavigate();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [clientList, setClientList] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleLogOut = async () => {
        setMenuAnchor(null);
        await logOut();
    };

    const fetchClients = async () => {
        try {
            const response = await getClient();
            if (typeof response.data === 'string') {
                openTostar(response, 'error');
            } else {
                if (response.data.length) {
                    setSelectedClient(response?.data[0]?.id);
                    setClientIdForAdmin(response?.data[0]?.id);
                }

                setClientList(
                    response.data.map((item) => ({
                        label: item?.name,
                        value: item?.id
                    }))
                );
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <div style={{ width: '100%', zIndex: 1000, position: 'relative', paddingBottom: '4px' }}>
            <SnackbarComponent />
            <Box
                component="nav"
                sx={{
                    height: 65,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: theme.palette.customBackground.default,
                }}
            >
                <div
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '5px', cursor: 'pointer' }}
                >
                    <img
                        src="/assets/logo_workcheck.png"
                        alt="Logo"
                        style={{
                            width: 152,
                            height: 47,
                            objectFit: 'contain',
                            padding: '4px'
                        }}
                    />
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: '20px',
                        pr: `${drawerWidth}px`
                    }}
                >
                    {user?.role?.name === ADMIN && (
                        <TextField
                            select
                            size="small"
                            value={selectedClient}
                            onChange={(event) => {
                                setClientIdForAdmin(event.target.value);
                                setSelectedClient(event.target.value);
                            }}
                            sx={{ width: 220, background: "white", borderRadius: '6px' }}
                            slotProps={{ select: { displayEmpty: true } }}
                        >
                            <MenuItem value="" disabled>
                                Select Client
                            </MenuItem>
                            {clientList.map((client) => (
                                <MenuItem key={client.value} value={client.value}>
                                    {client.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <IconButton onClick={(event) => setMenuAnchor(event.currentTarget)} sx={{ color: theme.palette.primary.main }}>
                        <SettingsIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
                            <strong>{user?.name}</strong>&nbsp;({user?.role?.name})
                        </MenuItem>
                        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                    </Menu>
                </Box>
            </Box>
        </div>
    );
};

export default Header;
