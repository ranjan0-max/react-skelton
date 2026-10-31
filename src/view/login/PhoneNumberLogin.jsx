import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Divider, TextField } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import AuthContext from '../../contextApi/userAuth';
import theme from '../../componets/Theme';

const whiteInputSx = {
    "& .MuiInputBase-input": {
        color: "white"
    },
    "& .MuiInputBase-input::placeholder": {
        color: "rgba(255, 255, 255, 0.8)",
        opacity: 1
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)"
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "white"
    },
    "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "2px solid white"
    }
};

export default function PhoneNumberLogin() {
    const { sendOtp, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    const validatePhone = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter valid phone number');
            return false;
        }
        setError('');
        return true;
    };

    const handleSendOtp = async () => {
        if (!validatePhone()) return;

        try {
            setLoading(true);
            await sendOtp({ mobile: phoneNumber });
            setShowOtpField(true);
        } catch (err) {
            setError('Failed sending OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            await verifyOtp({ mobile: phoneNumber, otp });
        } catch (err) {
            setError('Invalid OTP, try again.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1000);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const buttonSx = {
        mt: '20px',
        background: theme.palette.primary.main,
        color: theme.typography.primaryTextColor?.color,
        fontWeight: 'bold'
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                    style={{
                        width: '100%',
                        backgroundImage: 'linear-gradient(135deg, rgba(207, 178, 240, 0.9) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,0.88) 100%)',
                        padding: '70px',
                        clipPath: isMobile
                            ? 'polygon(43% 0, 100% 61%, 100% 100%, 0 100%, 0 0)'
                            : 'polygon(15% 0, 100% 80%, 100% 100%, 0 100%, 0 0)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                    <div style={{ marginTop: 'auto', width: '100%' }}>
                        <h1 style={{ fontSize: 40, marginBottom: 40 }}>
                            Login with Phone
                        </h1>

                        {!showOtpField && (
                            <>
                                <div style={{ width: 300, marginBottom: 20 }}>
                                    <MuiTelInput
                                        defaultCountry="IN"
                                        fullWidth
                                        label="Phone Number"
                                        variant="standard"
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        sx={whiteInputSx}
                                    />
                                    {error && (
                                        <div style={{ color: 'red', marginTop: 5, fontSize: 13 }}>
                                            {error}
                                        </div>
                                    )
                                    }
                                </div>

                                <Button variant="contained" onClick={handleSendOtp} disabled={loading} sx={{ ...buttonSx, width: '35%', mt: '10px' }}>
                                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Send OTP'}
                                </Button>
                            </>
                        )}

                        {/* OTP FIELD */}
                        {showOtpField && (
                            <div style={{ width: 300, marginBottom: 20 }}>
                                <TextField
                                    variant="standard"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(event) => setOtp(event.target.value)}
                                    sx={{ ...whiteInputSx, width: 300, mb: '20px' }}
                                />

                                {error && (
                                    <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>
                                        {error}
                                    </div>
                                )}

                                <Button variant="contained" fullWidth onClick={handleVerifyOtp} disabled={loading} sx={buttonSx}>
                                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify OTP'}
                                </Button>

                            </div>
                        )}

                        <Divider sx={{ my: '30px', color: 'rgba(255,255,255,0.5)', '&::before, &::after': { borderColor: 'rgba(255,255,255,0.3)' } }}>
                            OR
                        </Divider>

                        <div style={{ textAlign: 'center' }}>
                            <Button variant="text" sx={{ color: 'white' }} onClick={() => navigate('/')}>
                                Login with Email
                            </Button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                            <span style={{ opacity: 0.9 }}>Check our&nbsp;</span>
                            <Button
                                variant="text"
                                sx={{ color: theme.palette.primary.main, p: 0, minWidth: 0 }}
                                onClick={() => navigate('/privacy-policy')}
                            >
                                Privacy Policy
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
