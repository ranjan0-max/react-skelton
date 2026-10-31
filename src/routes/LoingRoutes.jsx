import { lazy } from 'react';

// project imports
import Loadable from '../componets/Loadable';
import GuestGuard from '../guard/guestGuard';

// pages
const LogIn = Loadable(lazy(() => import('../view/login')));
const PhoneNumberLogin = Loadable(lazy(() => import('../view/login/PhoneNumberLogin')));

const LogInRoutes = {
    path: '/',
    children: [
        {
            path: '/',
            element: (
                <GuestGuard>
                    <LogIn />
                </GuestGuard>
            )
        },
        {
            path: '/phone-login',
            element: (
                <GuestGuard>
                    <PhoneNumberLogin />
                </GuestGuard>
            )
        }
    ]
};

export default LogInRoutes;
