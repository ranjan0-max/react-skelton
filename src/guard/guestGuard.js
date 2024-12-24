import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../customHook/useAuth';

const GuestGuard = ({ children }) => {
    // const { menu } = useSelector((state) => state.menu);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home'); // here you can send different routes or role wise dashboard
        } else {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    return children;
};

export default GuestGuard;
