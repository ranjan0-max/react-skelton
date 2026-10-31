import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// MUI Layout
import { Box } from '@mui/material';

// Custom Hooks
import useAuth from 'customHook/useAuth';
import useWindowSize from 'customHook/useWindowSize';

// Components
import Header from './Header';
import Sidebar from './Sidebar';

import { fontFamily } from 'constant/constant';

const drawerWidth = 220;

export default function PermanentDrawerLeft() {

    const { menu } = useAuth();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const [menuGroups, setMenuGroups] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const handleMenuItemClick = (path) => navigate(path);

    const handleDrawer = () => {
        if (isMobile) {
            setIsDrawerOpen(false);
        } else {
            setIsDrawerOpen(!isDrawerOpen);
        }
    };

    const groupMenuItems = (menuItems) => {
        const grouped = {};

        menuItems.forEach((m) => {
            if (!grouped[m.group]) {
                grouped[m.group] = { group: m.group, icon: m.icon, items: [] };
            }
            grouped[m.group].items.push({
                id: m.id,
                label: m.label,
                url: m.url,
                icon: m.icon
            });
        });

        return Object.values(grouped);
    };

    useEffect(() => {
        setMenuGroups(groupMenuItems(menu));
    }, [menu]);

    useEffect(() => {
        if (width < 800) {
            setIsMobile(true);
            setIsDrawerOpen(false);
        } else {
            setIsMobile(false);
        }
    }, [width]);

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
                <Header />
            </Box>
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* Sidebar*/}
                <Sidebar
                    drawerWidth={drawerWidth}
                    accessableMenuList={menuGroups}
                    handleMenuItemClick={handleMenuItemClick}
                    isDrawerOpen={isDrawerOpen}
                    handleDrawer={handleDrawer}
                    fontFamily={fontFamily}
                />


                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        ml: `${isDrawerOpen ? drawerWidth : 70}px`,
                        transition: "margin-left 0.3s ease",
                        flexGrow: 1,
                        p: "20px",
                        overflowY: "auto",
                    }}
                >

                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
