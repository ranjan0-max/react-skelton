import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { closeSnackbar } from 'store/snackbarSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarComponent = () => {
    const dispatch = useDispatch();
    const snackbarState = useSelector((state) => state.tostar);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(closeSnackbar());
    };

    return (
        <Snackbar
            key={String(snackbarState.action)} // new message -> new snackbar, timer restarts
            open={snackbarState.open}
            autoHideDuration={snackbarState.close ? 3000 : null}
            onClose={handleClose}
            anchorOrigin={snackbarState.anchorOrigin}
        >
            <Alert onClose={handleClose} severity={snackbarState.alert.color}>
                <AlertTitle>{snackbarState.alert.color?.toUpperCase()}</AlertTitle>
                {snackbarState.message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
