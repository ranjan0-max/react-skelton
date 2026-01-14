/* eslint-disable no-sparse-arrays */
import { lazy } from 'react';

// project imports
import CheckUserDashBoard from 'guard/checkUserDashBoard';
import RouteGard from 'guard/routeGard';
import Loadable from '../componets/Loadable';
import AuthGuard from '../guard/authGuard';
import MenuLayout from '../menu';
import Error from '../componets/Error'

// masters
const User = Loadable(lazy(() => import('../view/masters/user')));
const Role = Loadable(lazy(() => import('../view/masters/role')));
const Client = Loadable(lazy(() => import('../view/masters/client')));
const Department = Loadable(lazy(() => import('../view/masters/department')));
const Category = Loadable(lazy(() => import('../view/masters/category')));
const Task = Loadable(lazy(() => import('../view/process/task')));
const RecurrenceTask = Loadable(lazy(() => import('../view/process/recurrenceTask')));
const ArchivedTask = Loadable(lazy(() => import('../view/process/archivedTask')));
const EditUserMenu = Loadable(lazy(() => import('../view/editUserMenu')));
const Chat = Loadable(lazy(() => import('../view/process/chat')));
const PrivacyPolicies = Loadable(lazy(() => import('../view/privacyPolicies')));
const LogViewer = Loadable(lazy(() => import('../componets/logViewer')))

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
                    path: '/master/department',
                    element: <RouteGard Component={Department} url={'/master/department'} />
                },
                {
                    path: '/master/user',
                    element: <RouteGard Component={User} url={'/master/user'} />
                },
                {
                    path: '/master/client',
                    element: <RouteGard Component={Client} url={'/master/client'} />
                },
                {
                    path: '/master/role',
                    element: <RouteGard Component={Role} url={'/master/role'} />
                },
                {
                    path: '/master/category',
                    element: <RouteGard Component={Category} url={'/master/category'} />
                },
                {
                    path: '/process/chat',
                    element: <RouteGard Component={Chat} url={'/process/chat'} />
                },
                {
                    path: '/process/task',
                    element: <RouteGard Component={Task} url={'/process/task'} />
                },
                {
                    path: '/process/recurrence-task',
                    element: <RouteGard Component={RecurrenceTask} url={'/process/recurrence-task'} />
                },
                {
                    path: '/process/archived-task',
                    element: <RouteGard Component={ArchivedTask} url={'/process/archived-task'} />
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
