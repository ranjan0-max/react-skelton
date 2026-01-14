import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contextApi/userAuth';
import theme from '../../componets/Theme';
import { IconSettings } from '@tabler/icons-react';
import CheckRoundIcon from '@rsuite/icons/CheckRound';

import {
    CustomProvider,
    Panel,
    Form,
    Button,
    Divider,
    FlexboxGrid,
    Schema,
    Checkbox,
    Dropdown,
    IconButton,
    SelectPicker
} from 'rsuite';


// Validation Rules
const model = Schema.Model({
    email: Schema.Types.StringType().isRequired('Please enter an email'),
    password: Schema.Types.StringType().isRequired('Please enter password')
});

// const themeColors = [
//     { label: "Soft Violet", value: "softViolet", color: "#CFB2F0" },
//     { label: "Denim Blue", value: "denimBlue", color: "#1565C0" },
//     { label: "Royal Blue", value: "royalBlue", color: "#4169E1" },
//     { label: "Pine Green", value: "pineGreen", color: "#0E6655" }
// ];

export default function LogIn() {
    const { login } = React.useContext(AuthContext);
    const navigate = useNavigate();

    // const [selectedTheme, setSelectedTheme] = React.useState("softViolet");
    const [isMobile, setIsMobile] = React.useState();

    const handleSubmit = async (formValue) => {
        try {
            await login({
                email: formValue.email,
                password: formValue.password
            });
        } catch (error) {
            console.log(error)
        }
    };

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
                {/* <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 9999
                    }}
                >
                    <Dropdown
                        placement="bottomEnd"
                        menuStyle={{ padding: 12, zIndex: 20000 }}
                        renderToggle={(props, ref) => (
                            <IconButton
                                {...props}
                                ref={ref}
                                icon={<IconSettings size={25} />}
                                circle
                                appearance="subtle"
                                style={{ color: theme.palette.primary.main }}
                            />
                        )}
                    >
                        {themeColors.map((t) => (
                            <Dropdown.Item
                                key={t.value}
                                onClick={() => setSelectedTheme(t.value)}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            background: t.color
                                        }}
                                    ></div>
                                    <span>{t.label}</span>
                                    {selectedTheme === t.value && (
                                        <span style={{ marginLeft: "auto" }}><CheckRoundIcon /></span>
                                    )}
                                </div>
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div> */}

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

                                <Form style={{ width: '100%' }} onSubmit={handleSubmit} model={model}>
                                    <Form.Group>
                                        <style>{`
                                    .white-placeholder::placeholder {
                                        color: rgba(255, 255, 255, 0.8) !important;
                                    }
                                    `}</style>
                                        <Form.Control
                                            name="email"
                                            placeholder="Email"
                                            type="email"
                                            className="white-placeholder"
                                            style={{
                                                padding: '12px 14px',
                                                border: 'none',
                                                borderBottom: '2px solid rgb(255, 255, 255)',
                                                background: 'transparent',
                                                color: 'white',
                                                fontSize: '15px',
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            name="password"
                                            placeholder="Password"
                                            type="password"
                                            className="white-placeholder"
                                            style={{
                                                padding: '12px 14px',
                                                border: 'none',
                                                borderBottom: '2px solid rgb(255, 255, 255)',
                                                background: 'transparent',
                                                color: 'white',
                                                fontSize: '15px',
                                            }}
                                        />
                                    </Form.Group>
                                    <Button
                                        appearance="primary"
                                        type="submit"
                                        style={{
                                            width: 300,
                                            marginTop: 30,
                                            background: theme.palette.primary.main,
                                            color: theme.typography.primaryTextColor.color,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        SIGN ME IN
                                    </Button>

                                    <Divider style={{ margin: '30px 0', color: 'rgba(255,255,255,0.5)' }}>OR</Divider>

                                    <div style={{ textAlign: 'center' }}>
                                        <Button
                                            appearance="link"
                                            onClick={() => navigate('/phone-login')}
                                            style={{ color: 'white' }}
                                        >
                                            Login with Phone
                                        </Button>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                        <span style={{ opacity: 0.9 }}>Check our&nbsp;</span>
                                        <Button
                                            appearance="link"
                                            onClick={() => navigate('/privacy-policy')}
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                                lineHeight: '1',
                                                verticalAlign: 'baseline',
                                                color: theme.palette.primary.main || 'white'
                                            }}
                                        >
                                            Privacy Policy
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}