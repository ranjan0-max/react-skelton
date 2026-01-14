import {
    Container,
    Typography,
    Box,
    Link,
    CssBaseline,
    Paper,
    Button
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Theme from '../../componets/Theme'

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/');
    };

    return (
        <ThemeProvider theme={Theme}>
            <Container component="main" maxWidth="md" sx={{ py: 4, backgroundColor: 'secondary.main' }}>
                <CssBaseline />
                <Paper elevation={3} sx={{ p: 4, backgroundColor: Theme.palette.background.default }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBackToLogin}
                            sx={{
                                minWidth: '35px',
                                padding: '6px',
                                borderRadius: '50%'
                            }}
                        >
                            <ArrowBack />
                        </Button>
                    </Box>
                    {/* Logo Section */}
                    {/* Logo Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 3,
                            gap: '10px',
                            flexDirection: { xs: 'column', sm: 'row' },
                            textAlign: 'center'
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                            color="primary.main"
                            sx={{
                                fontSize: { xs: '1.5rem', sm: '2rem' }
                            }}
                        >
                            Privacy Policy for
                        </Typography>
                        <img
                            src="/assets/logo_workcheck.png" alt="Logo"
                            style={{
                                width: 162,
                                height: 50,
                                borderRadius: '5px',
                                paddingBottom: '10px',
                                align: "center",
                                cursor: 'pointer'
                            }}
                        />
                    </Box>



                    <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
                        Effective Date: September 3, 2025
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                        Work Check respects your privacy and is committed to protecting it.
                        This Privacy Policy explains how we handle your information when you use our mobile application Work Check.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        1. Information We Collect
                    </Typography>
                    <Typography variant="body1" paragraph>
                        When you use Work Check, we collect only the minimum information necessary to provide our services:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        <li><Typography variant="body1">User Information: Username and Email (required to create and manage your account).</Typography></li>
                        <li><Typography variant="body1">Task Data: Tasks you create, assign, or update, including chat messages related to tasks.</Typography></li>
                        <li><Typography variant="body1">Media Files: Images you choose to share through the app via camera or gallery.</Typography></li>
                        <li><Typography variant="body1">Notifications: Device tokens (used only for sending push notifications via Firebase Cloud Messaging).</Typography></li>
                    </Box>
                    <Typography variant="body1" paragraph>
                        We do not collect sensitive personal information such as phone numbers, addresses, financial data, or government IDs.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        2. How We Use the Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We use the collected information solely to:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        <li><Typography variant="body1">Create and manage your user account.</Typography></li>
                        <li><Typography variant="body1">Allow you to create, assign, and update tasks.</Typography></li>
                        <li><Typography variant="body1">Enable real-time chat and media sharing between users on tasks.</Typography></li>
                        <li><Typography variant="body1">Send push notifications about task updates and chats.</Typography></li>
                        <li><Typography variant="body1">Improve the functionality and reliability of the app.</Typography></li>
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        3. Data Sharing & Third Parties
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We do not sell, rent, or trade your personal information with any third parties.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We do not share your information with advertisers or external analytics services.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Your data is only used within the app ecosystem for providing core functionality.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        4. User Accounts
                    </Typography>
                    <Typography variant="body1" paragraph>
                        User accounts are created through our internal portal by authorized administrators.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Once created, you can log in to the app using your provided username and email.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        You are responsible for maintaining the confidentiality of your login credentials.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        5. Data Storage & Security
                    </Typography>
                    <Typography variant="body1" paragraph>
                        All user and task data is stored securely on our servers.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We use industry-standard security measures to protect against unauthorized access, alteration, or disclosure of data.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Media files shared in chats are securely transmitted and stored.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        6. Notifications
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We use Firebase Cloud Messaging (FCM) to send real-time notifications about task updates and chats.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Notification tokens are device-specific and are used only for delivering app notifications.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        7. Children's Privacy
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Work Check is intended for use by authorized business users only. It is not designed for children under 13 years of age. We do not knowingly collect data from children.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        8. User Rights
                    </Typography>
                    <Typography variant="body1" paragraph>
                        You have the right to:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        <li><Typography variant="body1">Access your data stored within the app.</Typography></li>
                        <li><Typography variant="body1">Request correction of inaccurate information.</Typography></li>
                        <li><Typography variant="body1">Request deletion of your account and associated data (subject to organizational policies).</Typography></li>
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        9. Changes to This Privacy Policy
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We may update this Privacy Policy from time to time to reflect changes in the app or legal requirements. We will notify users of significant changes by updating the "Effective Date" at the top of this page.
                    </Typography>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3, color: 'primary.main' }}>
                        10. Contact Us
                    </Typography>
                    <Typography variant="body1" paragraph>
                        If you have any questions, concerns, or requests about this Privacy Policy, you may contact us at:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3 }}>
                        <li><Typography variant="body1">📧 appdev@coderootz.com</Typography></li>
                        <li><Typography variant="body1">🌐 <a href='https://coderootz.com/' target="_blank"> https://coderootz.com/ </a></Typography></li>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Link
                            component="button"
                            onClick={handleBackToLogin}
                            underline="hover"
                            variant="body1"
                            sx={{
                                color: 'primary.main',
                                '&:hover': {
                                    color: 'secondary.main'
                                }
                            }}
                        >
                            Back to Login
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}