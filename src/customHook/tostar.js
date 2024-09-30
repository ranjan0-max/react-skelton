import { useDispatch } from 'react-redux';
import { openSnackbar, closeSnackbar } from 'store/snackbarSlice';

export const useTostar = () => {
    const dispatch = useDispatch();

    const snackbar = (customMessage, type, timeout = 5000) => {
        dispatch(
            openSnackbar({
                open: true,
                message: customMessage,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'alert',
                alert: {
                    color: type
                }
            })
        );

        setTimeout(() => {
            dispatch(closeSnackbar());
        }, timeout);
    };

    return snackbar;
};
