import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import theme from '../componets/Theme';
import useAuth from '../customHook/useAuth';
import { ADMIN } from '../constant/constant';

import { IconButton, List, ListItemButton, ListItemIcon, ListItemText, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowRightLineIcon from '@mui/icons-material/ChevronRight';
import SendToDashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import DynamicMenuIcon from '../componets/MenuIcon';

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
    const [popover, setPopover] = useState({ anchor: null, group: null });

    const primaryText = theme.typography.primaryTextColor.color;
    const secondaryText = theme.typography.secondaryTextColor.color;

    const renderIcon = (iconName) => <DynamicMenuIcon name={iconName} sx={{ fontSize: isDrawerOpen ? 24 : 18 }} />;

    //? one style for every open-drawer row (dashboard, menu, group)
    const navItemSx = (active) => ({
        fontFamily,
        mt: '6px',
        gap: '20px',
        transition: 'all .2s',
        background: active ? theme.palette.background.default : 'transparent',
        color: active ? secondaryText : primaryText,
        '&:hover': { background: active ? theme.palette.background.default : 'rgba(255,255,255,0.15)' },
        '&.Mui-selected, &.Mui-selected:hover': { background: theme.palette.background.default },
        '& .MuiListItemIcon-root': { minWidth: 0, color: 'inherit' },
        '& .MuiListItemText-primary': { fontFamily, fontSize: '18px', fontWeight: 600 }
    });

    const collapsedButtonSx = (active) => ({
        background: active ? theme.palette.background.default : 'transparent',
        color: active ? secondaryText : primaryText,
        borderRadius: '6px'
    });

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
        setPopover({ anchor: null, group: null });

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

    const popoverMenu = accessableMenuList.find((menu) => menu.group === popover.group);

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
            <div style={{ padding: '12px' }}>
                <IconButton onClick={handleDrawer} sx={{ color: primaryText }}>
                    <MenuIcon />
                </IconButton>
            </div>

            <List disablePadding>
                {/* Dashboard */}
                {isDrawerOpen ? (
                    <ListItemButton selected={location.pathname === "/dashboard"} onClick={handleDashboardClick} sx={navItemSx(location.pathname === "/dashboard")}>
                        <ListItemIcon><SendToDashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                ) : (
                    <div style={{ padding: '12px' }}>
                        <IconButton onClick={handleDashboardClick} sx={collapsedButtonSx(location.pathname === "/dashboard")}>
                            <SendToDashboardIcon />
                        </IconButton>
                    </div>
                )}

                {/* Menu */}
                {user?.role?.name === ADMIN &&
                    (isDrawerOpen ? (
                        <ListItemButton selected={location.pathname === "/editUserMenu"} onClick={handleEditMenuClick} sx={navItemSx(location.pathname === "/editUserMenu")}>
                            <ListItemIcon><ListIcon /></ListItemIcon>
                            <ListItemText primary="Menu" />
                        </ListItemButton>
                    ) : (
                        <div style={{ padding: '12px' }}>
                            <IconButton onClick={handleEditMenuClick} sx={collapsedButtonSx(location.pathname === "/editUserMenu")}>
                                <ListIcon />
                            </IconButton>
                        </div>
                    ))}

                {/* Sidebar Menu */}
                {accessableMenuList.map(menu => (
                    <div key={menu.group}>

                        {!isDrawerOpen ? (
                            <div style={{ padding: '12px' }}>
                                <IconButton
                                    onClick={(event) => setPopover({ anchor: event.currentTarget, group: menu.group })}
                                    sx={collapsedButtonSx(selectedGroup === menu.group)}
                                >
                                    {renderIcon(menu.icon)}
                                </IconButton>
                            </div>
                        ) : (
                            <ListItemButton selected={selectedGroup === menu.group} onClick={() => toggleGroup(menu.group)} sx={navItemSx(selectedGroup === menu.group)}>
                                <ListItemIcon>{renderIcon(menu.icon)}</ListItemIcon>
                                <ListItemText primary={menu.group} />
                                <ArrowRightLineIcon
                                    sx={{
                                        transition: 'transform 0.35s ease',
                                        transform: openGroups[menu.group] ? 'rotate(90deg)' : 'rotate(0deg)'
                                    }}
                                />
                            </ListItemButton>
                        )}

                        {isDrawerOpen && (
                            <div
                                style={{
                                    maxHeight: openGroups[menu.group] ? "1000px" : "0px",
                                    overflow: "hidden",
                                    transition: "max-height .50s ease-in-out",
                                    borderLeft: `2px solid ${theme.palette.background.default}`,
                                    marginLeft: 25,
                                }}
                            >
                                {menu.items.map((sub, index) => (
                                    <ListItemButton
                                        key={index}
                                        selected={selectedItem === sub.label}
                                        onClick={() => handleItemSelection(sub, menu.group)}
                                        sx={{
                                            mt: '6px',
                                            ml: '2px',
                                            background: selectedItem === sub.label ? theme.palette.background.default : "transparent",
                                            color: selectedItem === sub.label ? secondaryText : primaryText,
                                            '&.Mui-selected, &.Mui-selected:hover': { background: theme.palette.background.default },
                                            '& .MuiListItemText-primary': {
                                                fontFamily,
                                                fontSize: '16px',
                                                fontWeight: selectedItem === sub.label ? 700 : 400
                                            }
                                        }}
                                    >
                                        <ListItemText primary={sub.label} />
                                    </ListItemButton>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </List>

            {/* collapsed drawer -> group items in a popover */}
            <Popover
                open={Boolean(popover.anchor)}
                anchorEl={popover.anchor}
                onClose={() => setPopover({ anchor: null, group: null })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { p: '10px' } } }}
            >
                {popoverMenu?.items.map((sub, index) => (
                    <div
                        key={index}
                        onClick={() => handleItemSelection(sub, popoverMenu.group)}
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
        </div >
    );
};

export default Sidebar;
