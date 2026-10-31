import { lazy } from 'react';

// project imports
import CheckUserDashBoard from 'guard/checkUserDashBoard';
import Loadable from '../componets/Loadable';
import AuthGuard from '../guard/authGuard';
import MenuLayout from '../menu';
import Error from '../componets/Error'

// pages
const EditUserMenu = Loadable(lazy(() => import('../view/editUserMenu')));
const PrivacyPolicies = Loadable(lazy(() => import('../view/privacyPolicies')));
const LogViewer = Loadable(lazy(() => import('../componets/logViewer')))

//? new module page -> add here inside MenuLayout children with RouteGard e.g.
//? { path: '/master/user', element: <RouteGard Component={User} url={'/master/user'} /> }
const MainRoutes = {
    path: '/',
    children: [
        {
            path: '/privacy-policy',
            element: <PrivacyPolicies />
        },
        {
            path: '/view-logs',
            element: <LogViewer />
        },
        {
            element: (
                <AuthGuard>
                    <MenuLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: '/dashboard',
                    element: <CheckUserDashBoard />
                },
                {
                    path: '/editUserMenu',
                    element: <EditUserMenu />
                },
                {
                    path: '*',
                    element: <Error />
                }
            ]
        }
    ]
};

export default MainRoutes;
