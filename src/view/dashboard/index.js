import { useTostar } from 'customHook/tostar';
import { useEffect } from 'react';

const DashBoard = () => {
    const tostar = useTostar();

    useEffect(() => {
        const loginSuccessful = true;

        if (loginSuccessful) {
            tostar('Login successful', 'success');
        }
    }, [tostar]);

    return <h2>Login successful</h2>;
};

export default DashBoard;
