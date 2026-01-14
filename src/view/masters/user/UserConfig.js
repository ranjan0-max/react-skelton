import React, { useEffect, useState } from 'react';
import {
    Button,
    Checkbox,
    Divider,
    Panel,
    FlexboxGrid,
    Table,
    Typography,
    Message,
    Heading
} from 'rsuite';

import useSnackbarAlert from 'customHook/alert';
import { getUserMenuConfig } from 'api/user/useApi';
import theme from '../../../componets/Theme';

const { Column, HeaderCell, Cell } = Table;


const UserConfig = ({ userDetail, menuList, handleCancel, updateUserConfig, fontFamily }) => {
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [checkedMenus, setCheckedMenus] = useState({});
    const [alreadyUserConfig, setAlreadyUserConfig] = useState([]);
    const [userConfig, setUserConfig] = useState(false);

    const fetchUserMenuConfig = async () => {
        try {
            const response = await getUserMenuConfig({ email: userDetail?.email });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setAlreadyUserConfig(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const groupMenusByGroup = (menus) => {
        const grouped = {};
        menus.forEach((menu) => {
            if (!grouped[menu.group]) grouped[menu.group] = [];
            grouped[menu.group].push(menu);
        });
        return grouped;
    };

    const handleMenuCheckboxChange = (menuId, isChecked) => {
        setCheckedMenus((prev) => ({
            ...prev,
            [menuId]: isChecked
        }));
    };

    const handleSubmitOrUpdate = () => {
        const config = Object.entries(checkedMenus)
            .filter(([_, checked]) => checked)
            .map(([menuId]) => menuId);

        updateUserConfig({ menuIds: config, email: userDetail.email });
    };

    useEffect(() => {
        if (alreadyUserConfig && Array.isArray(alreadyUserConfig)) {
            const menuIdMap = {};
            alreadyUserConfig.forEach((item) => {
                if (item.menuId) {
                    menuIdMap[item.menuId] = true;
                }
            });
            setCheckedMenus(menuIdMap);
            setUserConfig(Object.keys(menuIdMap).length > 0);
        }
    }, [alreadyUserConfig]);

    React.useEffect(() => {
        fetchUserMenuConfig();
    }, []);

    const groupedMenus = groupMenusByGroup(menuList || []);

    return (
        <>
            <SnackbarComponent />

            <Panel style={{
                fontFamily, width: '40vw'
            }}>
                <Heading level={3} style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
                    User Configuration
                </Heading>

                {Object.entries(groupedMenus).map(([group, menus]) => (
                    <Panel key={group} bordered style={{ marginBottom: 15 }}>
                        <Heading
                            level={5}
                            style={{
                                textAlign: 'center',
                                padding: 8,
                                background: '#f5f5f5',
                                borderRadius: 4,
                                marginBottom: 10
                            }}
                        >
                            {group.toUpperCase()}
                        </Heading>

                        <Table data={menus} autoHeight bordered={false} headerHeight={40} rowHeight={50} >
                            <Column flexGrow={1}>
                                <HeaderCell>Menu</HeaderCell>
                                <Cell>{(rowData) => rowData.label}</Cell>
                            </Column>

                            <Column width={120} align="center">
                                <HeaderCell>Select</HeaderCell>
                                <Cell>
                                    {(rowData) => (
                                        <Checkbox
                                            checked={checkedMenus[rowData.id] || false}
                                            onChange={(value, checked) =>
                                                handleMenuCheckboxChange(rowData.id, checked)
                                            }
                                        />
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    </Panel>
                ))}

                <FlexboxGrid justify="center" style={{ marginTop: 20, gap: 10 }}>
                    <Button
                        style={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            border: '1px solid black'
                        }}
                        onClick={handleSubmitOrUpdate}
                    >
                        {userConfig ? 'Update' : 'Submit'}
                    </Button>

                    <Button appearance="ghost" color="red" onClick={handleCancel}>
                        Cancel
                    </Button>
                </FlexboxGrid>
            </Panel>
        </>
    );
};

export default UserConfig;
