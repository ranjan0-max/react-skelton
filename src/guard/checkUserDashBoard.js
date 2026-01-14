import { lazy, useEffect, useState } from 'react';
import Loadable from '../componets/Loadable';
import useAuth from '../customHook/useAuth';
import { ADMIN, CLIENT } from '../constant/constant';

// Lazy-load the dashboard component
const ClientDashBoard = Loadable(lazy(() => import('../view/dashboards/clientDashboard')));
const UserDashBoard = Loadable(lazy(() => import('../view/dashboards/userDashboard')));
const DefaultDashBoard = Loadable(lazy(() => import('../view/dashboards/defaultDashboard')));

// Function to return the correct dashboard component based on role
const checkUserRole = (user) => {
    switch (user?.role?.name) {
        case ADMIN:
            return <DefaultDashBoard />;
        case CLIENT:
            return <ClientDashBoard />;
        default:
            return <UserDashBoard />;
    }
};

const CheckUserDashBoard = () => {
    const { isAuthenticated, user } = useAuth();
    const [dashboardComponent, setDashboardComponent] = useState(null);

    useEffect(() => {
        if (isAuthenticated && user) {
            setDashboardComponent(checkUserRole(user));
        }
    }, [isAuthenticated, user]);

    if (!isAuthenticated) return <div>Loading...</div>;

    return dashboardComponent;
};

export default CheckUserDashBoard;
