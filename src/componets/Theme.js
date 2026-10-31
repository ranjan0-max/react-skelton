import { createTheme } from '@mui/material/styles';

//? real MUI theme -> used by ThemeProvider (index.jsx) and directly as theme.palette.primary.main etc.
//? custom keys (customBackground, primaryTextColor...) are kept by createTheme
const theme = createTheme({
    palette: {
        primary: {
            main: '#8F89EA'
        },
        secondary: {
            main: '#8983d6'
        },
        background: {
            default: 'white'
        },
        customBackground: {
            default: '#eeecfeff'
        },
        hoverBackground: {
            main: '#7362F1'
        }
    },
    typography: {
        fontFamily: 'sans-serif',
        button: {
            textTransform: 'none'
        },
        primaryTextColor: {
            color: 'white'
        },
        secondaryTextColor: {
            color: 'black'
        },
        themeColor: {
            color: '#8F89EA'
        }
    }
});

export default theme;
