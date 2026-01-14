import { Notification, toaster } from 'rsuite';

const useSnackbarAlert = () => {

    const getRsuiteType = (severityType) => {
        const typeMap = {
            success: 'success',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return typeMap[severityType] || 'info';
    };

    const openTostar = (msg, severityType = 'success') => {
        toaster.push(
            <Notification
                type={getRsuiteType(severityType)}
                closable
                header={severityType.toUpperCase()}
            >
                {msg}
            </Notification>,
            {
                placement: 'bottomEnd',
                duration: 3000,
            }
        );
    };

    const closeTostar = () => {
        toaster.clear();
    };

    const SnackbarComponent = () => null;

    return {
        openTostar,
        closeTostar,
        SnackbarComponent
    };
};

export default useSnackbarAlert;
