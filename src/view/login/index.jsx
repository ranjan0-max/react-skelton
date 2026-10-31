import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, TextField } from '@mui/material';
import AuthContext from '../../contextApi/userAuth';
import theme from '../../componets/Theme';

// Validation Rules
const validationSchema = Yup.object({
    email: Yup.string().required('Please enter an email'),
    password: Yup.string().required('Please enter password')
});

//? white underline input on dark login card
const whiteInputSx = {
    '& .MuiInputBase-input': { color: 'white', fontSize: '15px', padding: '12px 14px' },
    '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.8)', opacity: 1 },
    '& .MuiInput-underline:before': { borderBottom: '2px solid rgb(255, 255, 255)' },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '2px solid rgb(255, 255, 255)' },
    '& .MuiInput-underline:after': { borderBottomColor: theme.palette.primary.main },
    '& .MuiFormHelperText-root': { color: '#ff8a80' }
};

export default function LogIn() {
    const { login } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const [isMobile, setIsMobile] = React.useState();

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: async (formValue) => {
            try {
                await login({
                    email: formValue.email,
                    password: formValue.password
                });
            } catch (error) {
                console.log(error)
            }
        }
    });

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 868);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            width: '60%',
                            height: '85vh',
                            display: 'flex',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            background: `url('/assets/login-bg.jpeg') center/cover no-repeat`,
                            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        <div
                            className="clip-container"
                            style={{
                                width: '100%',
                                backgroundImage:
                                    'linear-gradient(135deg, rgba(207, 178, 240, 0.9) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,0.88) 100%)',
                                clipPath: isMobile
                                    ? 'polygon(43% 0, 100% 61%, 100% 100%, 0 100%, 0 0)'
                                    : 'polygon(15% 0, 100% 80%, 100% 100%, 0 100%, 0 0)',
                                padding: '6vw',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                color: 'white',
                            }}
                        >
                            <div style={{ marginTop: 'auto', width: '100%' }}>
                                <h1 style={{ fontSize: 40, marginBottom: 40 }}>Sign in</h1>

                                <form style={{ width: '100%' }} onSubmit={formik.handleSubmit} noValidate>
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        name="email"
                                        placeholder="Email"
                                        type="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        sx={{ ...whiteInputSx, mb: 3 }}
                                    />
                                    <TextField
                                        variant="standard"
                                        fullWidth
                                        name="password"
                                        placeholder="Password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        sx={whiteInputSx}
                                    />
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        sx={{
                                            width: 300,
                                            mt: '30px',
                                            background: theme.palette.primary.main,
                                            color: theme.typography.primaryTextColor.color,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        SIGN ME IN
                                    </Button>

                                    <Divider sx={{ my: '30px', color: 'rgba(255,255,255,0.5)', '&::before, &::after': { borderColor: 'rgba(255,255,255,0.3)' } }}>
                                        OR
                                    </Divider>

                                    <div style={{ textAlign: 'center' }}>
                                        <Button variant="text" onClick={() => navigate('/phone-login')} sx={{ color: 'white' }}>
                                            Login with Phone
                                        </Button>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        <span style={{ opacity: 0.9 }}>Check our&nbsp;</span>
                                        <Button
                                            variant="text"
                                            onClick={() => navigate('/privacy-policy')}
                                            sx={{
                                                p: 0,
                                                m: 0,
                                                minWidth: 0,
                                                lineHeight: '1',
                                                verticalAlign: 'baseline',
                                                color: theme.palette.primary.main || 'white'
                                            }}
                                        >
                                            Privacy Policy
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
