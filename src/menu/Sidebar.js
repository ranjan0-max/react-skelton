import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../componets/Theme';
import useAuth from '../customHook/useAuth';
import { ADMIN } from '../constant/constant';

import { Sidenav, Nav, IconButton, Popover, Whisper, Divider } from 'rsuite';
import MenuIcon from '@rsuite/icons/Menu';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import SendToDashboardIcon from '@rsuite/icons/SendToDashboard';
import ListIcon from '@rsuite/icons/List';
import RelatedMapIcon from '@rsuite/icons/RelatedMap';
import * as RSIcons from '@rsuite/icons';

import 'rsuite/dist/rsuite.min.css';

const Sidebar = ({
    drawerWidth = 240,
    accessableMenuList,
    handleMenuItemClick,
    isDrawerOpen,
    handleDrawer,
    fontFamily
}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openGroups, setOpenGroups] = useState({});

    const renderIcon = (iconName) => {
        const IconComponent = RSIcons[iconName];
        const size = isDrawerOpen ? 24 : 18;
        return IconComponent ? <IconComponent size={size} /> : <RelatedMapIcon size={size} />;
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
        setSelectedGroup(null);
        setSelectedItem(null);
        setOpenGroups({});
    };

    const handleEditMenuClick = () => {
        navigate('/editUserMenu');
        setSelectedGroup(null);
        setSelectedItem(null);
        setOpenGroups({});
    };

    const toggleGroup = (group) => {
        setSelectedGroup(group);
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleItemSelection = (menu, group) => {
        navigate(menu.url);
        setSelectedGroup(group);
        setSelectedItem(menu.label);

        setOpenGroups(prev => ({
            ...prev,
            [group]: true
        }));
        handleMenuItemClick(menu.url, menu.label);
    };


    useEffect(() => {
        let activeGroup = null;
        let activeItemLabel = null;

        for (const menu of accessableMenuList) {
            const foundItem = menu.items.find(item => item.url === location.pathname);
            if (foundItem) {
                activeGroup = menu.group;
                activeItemLabel = foundItem.label;
                setOpenGroups({ [activeGroup]: true });
                setSelectedGroup(activeGroup);
                setSelectedItem(activeItemLabel);
                break;
            }
        }
        if (location.pathname === "/dashboard") {
            handleDashboardClick();
        }
        if (location.pathname === "/editUserMenu") {
            handleEditMenuClick();
        }
    }, [accessableMenuList, location.pathname]);

    return (
        <div
            style={{
                width: isDrawerOpen ? drawerWidth : 70,
                height: '100vh',
                background: theme.palette.primary.main,
                transition: 'width 0.3s ease',
                borderRight: '1px solid #e5e5e5',
                position: 'fixed',
                overflowY: 'auto',
                borderRadius: '0px 62px 0px 0px'
            }}
        >
            <div style={{
                padding: '12px',
            }}>
                <IconButton
                    icon={<MenuIcon />}
                    appearance="subtle"
                    onClick={handleDrawer}
                    style={{ color: theme.typography.primaryTextColor.color }}
                />
            </div>

            <Sidenav expanded={isDrawerOpen} style={{ background: 'transparent', height: '100%' }}>
                <Sidenav.Body style={{ overflowY: 'auto', height: '100%' }}>
                    <Nav>
                        {/* Dashboard */}
                        {isDrawerOpen ? (
                            <Nav.Item
                                icon={<SendToDashboardIcon />}
                                active={location.pathname === "/dashboard"}
                                onClick={handleDashboardClick}
                                style={{
                                    fontFamily,
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    marginTop: '6px',
                                    cursor: 'pointer',
                                    background: location.pathname === "/dashboard"
                                        ? theme.palette.background.default
                                        : "transparent",
                                    color: location.pathname === "/dashboard" ? theme.typography.secondaryTextColor.color : theme.typography.primaryTextColor.color,
                                    transition: "all .2s",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                }}
                            >
                                Dashboard
                            </Nav.Item>
                        ) : (
                            <div style={{ padding: '12px' }}>
                                <IconButton
                                    icon={<SendToDashboardIcon />}
                                    onClick={handleDashboardClick}
                                    style={{
                                        background: location.pathname === "/dashboard"
                                            ? theme.palette.primary.main
                                            : 'transparent',
                                        color: location.pathname === "/dashboard" ? 'white' : 'black',
                                        borderRadius: 6,
                                    }}
                                />
                            </div>
                        )}

                        {/* Menu */}
                        {user?.role?.name === ADMIN &&
                            (isDrawerOpen ? (
                                <Nav.Item
                                    icon={<ListIcon />}
                                    active={location.pathname === "/editUserMenu"}
                                    onClick={handleEditMenuClick}
                                    style={{
                                        fontFamily,
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        marginTop: '6px',
                                        cursor: 'pointer',
                                        background: location.pathname === "/editUserMenu"
                                            ? theme.palette.background.default
                                            : "transparent",
                                        color: location.pathname === "/editUserMenu" ? theme.typography.secondaryTextColor.color : theme.typography.primaryTextColor.color,
                                        transition: "all .2s",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                    }}
                                >
                                    Menu
                                </Nav.Item>
                            ) : (
                                <div style={{ padding: '12px' }}>
                                    <IconButton
                                        icon={<ListIcon />}
                                        onClick={handleEditMenuClick}
                                        style={{
                                            background: location.pathname === "/editUserMenu"
                                                ? theme.palette.primary.main
                                                : 'transparent',
                                            color: location.pathname === "/editUserMenu" ? 'white' : 'black',
                                            borderRadius: 6,
                                        }}
                                    />
                                </div>
                            ))}

                        {/* Sidebar Menu */}
                        {accessableMenuList.map(menu => (
                            <div key={menu.group}>

                                {!isDrawerOpen ? (
                                    <Whisper
                                        trigger="click"
                                        placement="rightStart"
                                        speaker={
                                            <Popover style={{ padding: 10 }}>
                                                {menu.items.map((sub, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleItemSelection(sub, menu.group)}
                                                        style={{
                                                            fontFamily,
                                                            padding: "6px 10px",
                                                            cursor: "pointer",
                                                            background: selectedItem === sub.label
                                                                ? theme.palette.primary.main
                                                                : "transparent",
                                                            borderRadius: 6,
                                                            fontSize: '16px',
                                                            color: selectedItem === sub.label
                                                                ? 'white' : 'black'
                                                        }}
                                                    >
                                                        {sub.label}
                                                    </div>
                                                ))}
                                            </Popover>
                                        }
                                    >
                                        <div style={{ padding: '12px' }}>
                                            <IconButton
                                                icon={renderIcon(menu.icon)}
                                                style={{
                                                    background: selectedGroup === menu.group ? theme.palette.primary.main : 'transparent',
                                                    color: selectedGroup === menu.group ? 'black' : 'white',
                                                    borderRadius: 6,
                                                }}
                                            />
                                        </div>
                                    </Whisper>
                                ) : (
                                    <Nav.Item
                                        icon={renderIcon(menu.icon)}
                                        active={selectedGroup === menu.group}
                                        onClick={() => toggleGroup(menu.group)}
                                        style={{
                                            fontFamily,
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            marginTop: '6px',
                                            cursor: 'pointer',
                                            background: selectedGroup === menu.group
                                                ? theme.palette.background.default
                                                : "transparent",
                                            color: selectedGroup === menu.group ? theme.typography.secondaryTextColor.color : theme.typography.primaryTextColor.color,
                                            transition: "all .2s",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '20px',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%'
                                        }}>
                                            <span>{menu.group}</span>
                                            <ArrowRightLineIcon
                                                style={{
                                                    transition: 'transform 0.35s ease',
                                                    transform: openGroups[menu.group]
                                                        ? 'rotate(90deg)'
                                                        : 'rotate(0deg)'
                                                }}
                                            />
                                        </div>
                                    </Nav.Item>
                                )}

                                {isDrawerOpen && (
                                    <div
                                        style={{
                                            maxHeight: openGroups[menu.group] ? "1000px" : "0px",
                                            overflow: "scroll",
                                            transition: "max-height .50s ease-in-out",
                                            borderLeft: `2px solid ${theme.palette.background.default}`,
                                            marginLeft: 25,
                                        }}
                                    >
                                        {menu.items.map((sub, index) => (
                                            <Nav.Item
                                                key={index}
                                                active={selectedItem === sub.label}
                                                onClick={() => handleItemSelection(sub, menu.group)}
                                                style={{
                                                    fontFamily,
                                                    fontSize: '16px',
                                                    marginTop: '6px',
                                                    cursor: "pointer",
                                                    marginLeft: '2px',
                                                    fontWeight: selectedItem === sub.label ? '700' : '400',
                                                    background: selectedItem === sub.label
                                                        ? theme.palette.background.default
                                                        : "transparent",
                                                    color: selectedItem === sub.label ? theme.typography.secondaryTextColor.color : theme.typography.primaryTextColor.color,
                                                }}
                                            >
                                                {sub.label}
                                            </Nav.Item>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div >
    );
};

export default Sidebar;
