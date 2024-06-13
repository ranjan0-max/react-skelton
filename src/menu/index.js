import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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

// icon
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconSettings } from '@tabler/icons-react';

// user context
import useAuth from 'customHook/useAuth';

const drawerWidth = 240;
const ITEM_HEIGHT = 48;

export default function PermanentDrawerLeft() {
    const { logOut } = useAuth();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleSetting = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleLogOut = async () => {
        await logOut();
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Permanent drawer
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} /> {/* This will create the space */}
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
                <Toolbar />
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
