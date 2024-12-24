import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';

// icons
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import { IconSettings } from '@tabler/icons-react';
import WebhookIcon from '@mui/icons-material/Webhook';

// custom hook
import useAuth from 'customHook/useAuth';

const drawerWidth = 200;
const ITEM_HEIGHT = 30;

export default function PermanentDrawerLeft() {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const menuList = [
        {
            label: 'Receipt',
            icon: <ReceiptLongIcon />,
            to: '/receipt'
        },
        {
            label: 'Bill',
            icon: <DescriptionIcon />,
            to: '/invoice'
        }
    ];

    const handleSetting = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleLogOut = async () => {
        await logOut();
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: '#2878b6' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" style={{ fontWeight: 'bolder' }}>
                        Fauji Ration Store
                    </Typography>
                    <Box sx={{ flexGrow: 2 }} /> {/* This will create the space */}
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={menuAnchorEl ? 'long-menu' : undefined}
                        aria-expanded={menuAnchorEl ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleSetting}
                        style={{ cursor: 'pointer' }}
                    >
                        <IconSettings />
                    </IconButton>
                    <Menu
                        id="settings-menu"
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch'
                            }
                        }}
                    >
                        <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    }
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar style={{ paddingRight: '5px' }}>
                    <WebhookIcon />
                    <Typography style={{ fontWeight: 'bolder', marginLeft: '2px' }}>Billing & Invoice</Typography>
                </Toolbar>
                <Divider />
                <List>
                    {menuList.map((menu) => (
                        <ListItem key={menu.label} disablePadding>
                            <ListItemButton onClick={() => handleMenuItemClick(menu.to)}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.label} primaryTypographyProps={{ fontWeight: 'bold' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    overflowY: 'auto' // Ensure main content area scrolls if needed
                }}
            >
                <Toolbar />
                <Outlet /> {/* Render your routed components */}
            </Box>
        </Box>
    );
}
