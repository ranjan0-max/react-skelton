import { lazy } from 'react';

// project imports
import Loadable from '../componets/Loadable';
import AuthGuard from '../guard/authGuard';
import MenuLayout from '../menu';

const DashboardDefault = Loadable(lazy(() => import('../view/dashboard')));

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MenuLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/home',
            element: <DashboardDefault /> // SUPER ADMIN
        }
    ]
};

export default MainRoutes;
