import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// RSuite Layout
import {
    Container,
    Header as RSHeader,
    Content,
    Footer as RSFooter,
} from 'rsuite';

// Custom Hooks
import useAuth from 'customHook/useAuth';
import useWindowSize from 'customHook/useWindowSize';

// Components
import Header from './Header';
import Footer from './Footer';
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
        <Container style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <RSHeader style={{
                position: "sticky", top: 0, zIndex: 1000
            }}>
                <Header />
            </RSHeader>
            <Container style={{ flex: 1, display: "flex", overflow: "hidden" }}>

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
                <Content
                    style={{
                        marginLeft: isDrawerOpen ? drawerWidth : 70,
                        transition: "margin-left 0.3s ease",
                        flexGrow: 1,
                        padding: "20px",
                        overflowY: "auto",
                    }}
                >

                    <Outlet />
                </Content>
            </Container>

            {/* Footer */}
            {/* <RSFooter
                style={{
                    background: "#fff",
                    textAlign: "center",
                    borderTop: "1px solid #ddd",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily,
                }}
            >
                <Footer />
            </RSFooter> */}
        </Container>
    );
}
