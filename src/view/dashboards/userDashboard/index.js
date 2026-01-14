import TaskIcon from '@rsuite/icons/Task';
import PeoplesIcon from '@rsuite/icons/Peoples';
import { Panel, Grid, Row, Col, Text } from 'rsuite';
import { fontFamily } from 'constant/constant';
import { useEffect, useState } from 'react';
import { getUserDashboardData } from 'api/dashboard/dashboardApi';
import { useSearchParams } from "react-router-dom";
import useAuth from 'customHook/useAuth';
import useSnackbarAlert from 'customHook/alert';
import Task from '../../process/task/index';

export default function UserDashboard() {
    const { user, accessableUrls } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();
    const hasAccessToTasks = accessableUrls.includes('/process/task');

    const [searchParams, setSearchParams] = useSearchParams();

    const [dashboardData, setDashboardData] = useState({
        totalReceived: 0,
        totalRaised: 0
    });

    const fetchUserDashboardData = async () => {
        try {
            const response = await getUserDashboardData({ clientId: user.clientId });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setDashboardData(response);
            }
        } catch (err) {
            console.log("Failed to fetch dashboard data:", err);
        }
    };

    useEffect(() => {
        fetchUserDashboardData();
    }, []);

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
                <Row>
                    {/* Raised To */}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ raiseToCreatedByList: "RAISED" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <PeoplesIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>Raised To</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.totalReceived}</Text>
                        </Panel>
                    </Col>

                    {/* Created By */}
                    <Col xs={24} sm={12} md={6}>
                        <Panel shaded style={cardStyle} onClick={() => setSearchParams({ raiseToCreatedByList: "CREATED_BY" })}>
                            <div style={{ display: 'flex', justifySelf: 'center', gap: 10 }}>
                                <TaskIcon style={{ fontSize: 25, alignSelf: 'center' }} />
                                <Text style={{ fontSize: '22px', fontFamily, alignSelf: 'center' }}>Created By</Text>
                            </div>
                            <Text style={{ fontSize: '32px', fontFamily }}>{dashboardData.totalRaised}</Text>
                        </Panel>
                    </Col>
                </Row>
            </Grid>

            {hasAccessToTasks && <Task />}
        </div>
    );
}
