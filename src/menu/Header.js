import React, { useState, useEffect } from 'react';
import {
    Navbar,
    SelectPicker,
    IconButton,
    Dropdown,
    FlexboxGrid
} from 'rsuite';
import { useNavigate } from 'react-router-dom';
import theme from '../componets/Theme';

// custom hook
import useAuth from 'customHook/useAuth';
import useSnackbarAlert from 'customHook/alert';

// icon
import { IconSettings } from '@tabler/icons-react';

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
    const [selectedClient, setSelectedClient] = useState(null);

    const handleLogOut = async () => {
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
            <Navbar
                style={{
                    height: 65,
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.palette.customBackground.default,
                }}
            >
                <FlexboxGrid align="middle" justify="space-between" style={{ width: '100%' }}>
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
                    <FlexboxGrid.Item
                        colspan={18}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 20,
                            paddingRight: drawerWidth
                        }}
                    >
                        {user?.role?.name === ADMIN && (
                            <SelectPicker
                                data={clientList}
                                value={selectedClient}
                                onChange={(value) => {
                                    setClientIdForAdmin(value);
                                    setSelectedClient(value);
                                }}
                                style={{ width: 220, background: "white", borderRadius: 6 }}
                                placeholder="Select Client"
                                size="sm"
                                menuStyle={{ zIndex: 20000 }}
                                cleanable={false}
                            />
                        )}

                        <Dropdown
                            placement="bottomEnd"
                            menuStyle={{ zIndex: 20000 }}
                            renderToggle={(props, ref) => (
                                <IconButton
                                    {...props}
                                    ref={ref}
                                    icon={<IconSettings size={25} />}
                                    circle
                                    appearance="subtle"
                                    style={{ color: theme.palette.primary.main }}
                                />
                            )}
                        >
                            <Dropdown.Item>
                                <strong>{user?.name}</strong> ({user?.role?.name})
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleLogOut}>Log Out</Dropdown.Item>
                        </Dropdown>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Navbar>
        </div>
    );
};

export default Header;
