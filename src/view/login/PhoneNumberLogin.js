import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contextApi/userAuth';
import theme from '../../componets/Theme';

import {
    CustomProvider,
    Panel,
    Form,
    Button,
    Divider,
    FlexboxGrid,
    Input,
    Schema,
    Loader
} from 'rsuite';

import MuiPhoneNumber from 'mui-phone-number';

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

    return (
        <CustomProvider theme="light">
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
                                        <MuiPhoneNumber
                                            defaultCountry="in"
                                            fullWidth
                                            label="Phone Number"
                                            variant="standard"
                                            value={phoneNumber}
                                            onChange={setPhoneNumber}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                borderBottom: '2px solid white',
                                                color: 'white',
                                                borderRadius: '6px'
                                            }}
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    color: "white"
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "rgba(255,255,255,0.7)"
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: "white"
                                                }
                                            }
                                            }
                                        />
                                        {error && (
                                            <div style={{ color: 'red', marginTop: 5, fontSize: 13 }}>
                                                {error}
                                            </div>
                                        )
                                        }
                                    </div>

                                    <Button
                                        appearance="primary"
                                        block
                                        onClick={handleSendOtp}
                                        style={{
                                            width: '35%',
                                            marginTop: 10,
                                            background: theme.palette.primary.main,
                                            color: theme.typography.primaryTextColor?.color,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {loading ? <Loader /> : 'Send OTP'}
                                    </Button>
                                </>
                            )}

                            {/* OTP FIELD */}
                            {showOtpField && (
                                <div style={{ width: 300, marginBottom: 20 }}>
                                    <style>{`
                                    .white-placeholder::placeholder {
                                        color: rgba(255, 255, 255, 0.8) !important;
                                    }
                                    `}</style>
                                    <Input
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={setOtp}
                                        className="white-placeholder"
                                        style={{
                                            width: 300,
                                            marginBottom: 20,
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '2px solid white',
                                            color: 'white'
                                        }}
                                    />

                                    {error && (
                                        <div style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        appearance="primary"
                                        block
                                        onClick={handleVerifyOtp}
                                        style={{
                                            width: '100%',
                                            marginTop: 20,
                                            background: theme.palette.primary.main,
                                            color: theme.typography.primaryTextColor?.color,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {loading ? <Loader /> : 'Verify OTP'}
                                    </Button>

                                </div>
                            )}

                            <Divider style={{ margin: '30px 0', color: 'rgba(255,255,255,0.5)' }}>
                                OR
                            </Divider>

                            <div style={{ textAlign: 'center' }}>
                                <Button appearance="link" style={{ color: 'white' }} onClick={() => navigate('/')}>
                                    Login with Email
                                </Button>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                <span style={{ opacity: 0.9 }}>Check our&nbsp;</span>
                                <Button
                                    appearance="link"
                                    style={{ color: theme.palette.primary.main, padding: 0 }}
                                    onClick={() => navigate('/privacy-policy')}
                                >
                                    Privacy Policy
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomProvider>
    );
}