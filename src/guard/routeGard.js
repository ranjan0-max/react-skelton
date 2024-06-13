import { useState, useEffect, lazy, useContext } from 'react';
import Loadable from 'ui-component/Loadable';
import { AccessableUrlsContext } from 'contexts/accessableRouteContext';

const MaintenanceError = Loadable(lazy(() => import('views/pages/maintenance/Error')));

function RouteGard(props) {
    const { accessableUrls } = useContext(AccessableUrlsContext);
    const [show, setShow] = useState(true);
    const { Component, url } = props;

    const checkAccess = () => {
        if (accessableUrls.includes(url)) {
            setShow(true);
        } else {
            setShow(false);
        }
    };

    useEffect(() => {
        checkAccess();
    }, [url, accessableUrls]);
    return show ? <Component /> : <MaintenanceError />;
}

export default RouteGard;
