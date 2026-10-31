// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './contextApi/userAuth';
import SnackbarComponent from './componets/snackbar';
import theme from './componets/Theme';
import store from './store/store';
import './index.css';
import Routes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <AuthProvider>
                        <Routes />
                    </AuthProvider>
                </Router>
                {/* one global snackbar for whole app -> useSnackbarAlert().openTostar() */}
                <SnackbarComponent />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
