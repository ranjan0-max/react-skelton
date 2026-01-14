import TaskIcon from '@rsuite/icons/Task';
import TimeIcon from '@rsuite/icons/Time';
import PauseOutlineIcon from '@rsuite/icons/PauseOutline';
import DateTaskIcon from '@rsuite/icons/DateTask';
import { Panel, Grid, Row, Col, Text } from 'rsuite';
import { fontFamily } from 'constant/constant';
import { useEffect, useState } from 'react';
import { getClientWebDashboardData } from 'api/dashboard/dashboardApi';
import useAuth from 'customHook/useAuth';
import { useSearchParams } from "react-router-dom";
import useSnackbarAlert from 'customHook/alert';
import Task from '../../process/task/index';

export default function ClientDashboard() {
    const { user } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();
    const [searchParams, setSearchParams] = useSearchParams();

    const [dashboardData, setDashboardData] = useState({
        TOTAL: 0,
        DELIGATE: 0,
        DELAYED: 0,
        HOLD: 0
    });

    const fetchClientDashboardData = async () => {
        try {
            const response = await getClientWebDashboardData({ clientId: user.clientId });

            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                const formatted = { TOTAL: 0, DELIGATE: 0, DELAYED: 0, HOLD: 0 };
                response.forEach(item => {
                    formatted[item.status.toUpperCase()] = item.total_number;
                    formatted.TOTAL += item.total_number;
                });
                setDashboardData(formatted);
            }
        } catch (err) {
            console.log("Dashboard error:", err);
        }
    };

    useEffect(() => {
        fetchClientDashboardData();
    }, [user]);

    const cardStyle = {
        cursor: 'pointer',
        borderRadius: '10px',
        transition: '0.3s ease',
        textAlign: 'center',
        border: '1px solid #e5e5e5'
    };

    return (
        <div style={{ border: '1px solid #e5e5e5', padding: '10px', marginTop: '1%', borderRadius: '5px' }}>
            <SnackbarComponent />
            <Grid fluid>
                <Row >
                    {/* Total Tasks */}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ status: "all" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <DateTaskIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>Total Tasks</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.TOTAL}</Text>
                        </Panel>
                    </Col>

                    {/* Delayed Tasks */}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ status: "DELAYED" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <TimeIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>Delayed Tasks</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.DELAYED}</Text>
                        </Panel>
                    </Col>

                    {/* Hold Tasks*/}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ status: "HOLD" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <PauseOutlineIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>On Hold Tasks</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.HOLD}</Text>
                        </Panel>
                    </Col>

                    {/* Open Tasks*/}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ status: "DELIGATE" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <TaskIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>DELIGATE Tasks</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.DELIGATE}</Text>
                        </Panel>
                    </Col>
                </Row>
            </Grid>

            <Task />
        </div>
    );
}
