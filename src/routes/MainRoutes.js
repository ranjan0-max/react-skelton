import { lazy } from 'react';

// project imports
import Loadable from '../componets/Loadable';
import AuthGuard from '../guard/authGuard';
import MenuLayout from '../menu';

const RecipeDefault = Loadable(lazy(() => import('../view/receipt')));
const Invoice = Loadable(lazy(() => import('../view/invoice')));

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
            element: <RecipeDefault />
        },
        {
            path: '/receipt',
            element: <RecipeDefault />
        },
        {
            path: '/invoice',
            element: <Invoice />
        }
    ]
};

export default MainRoutes;
