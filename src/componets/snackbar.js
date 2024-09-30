import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { closeSnackbar } from 'store/snackbarSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarComponent = () => {
    const dispatch = useDispatch();
    const snackbarState = useSelector((state) => state.tostar);

    const handleClose = () => {
        dispatch(closeSnackbar());
    };

    return (
        <Snackbar
            open={snackbarState.open}
            autoHideDuration={snackbarState.close ? 5000 : null}
            onClose={handleClose}
            anchorOrigin={snackbarState.anchorOrigin}
        >
            <Alert onClose={handleClose} severity={snackbarState.alert.color}>
                {snackbarState.message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
