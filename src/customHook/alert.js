import { useDispatch } from 'react-redux';
import { closeSnackbar, openSnackbar } from 'store/snackbarSlice';

const SEVERITIES = ['success', 'error', 'warning', 'info'];

//? shows message in the global snackbar (componets/snackbar, mounted once in index.jsx)
const useSnackbarAlert = () => {
    const dispatch = useDispatch();

    const openTostar = (msg, severityType = 'success') => {
        dispatch(
            openSnackbar({
                open: true,
                message: typeof msg === 'string' ? msg : msg?.message || 'Something went wrong',
                alert: { color: SEVERITIES.includes(severityType) ? severityType : 'info' }
            })
        );
    };

    const closeTostar = () => {
        dispatch(closeSnackbar());
    };

    //? kept so old screens rendering <SnackbarComponent /> keep working
    const SnackbarComponent = () => null;

    return {
        openTostar,
        closeTostar,
        SnackbarComponent
    };
};

export default useSnackbarAlert;
