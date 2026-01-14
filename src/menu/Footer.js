import React from 'react';
import { Container, Grid, Panel, Divider } from 'rsuite';
import theme from '../componets/Theme';

const Footer = () => {

    return (
        <div
            style={{
                background: theme.palette.primary.main,
                color: 'white',
                padding: '20px 0',
                marginTop: '10px',
                width: '82vw',
                float: 'right',
                borderRadius: '5px'
            }}
        >
            <Container>
                <Grid fluid>

                    {/* <Grid.Row gutter={20}>
                        <Grid.Col xs={24} sm={12} md={6}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>About Us</h4>
                            <p>We are committed to providing the best services and building meaningful experiences.</p>
                        </Grid.Col>

                        <Grid.Col xs={24} sm={12} md={6}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>Quick Links</h4>
                            <p>About Us</p>
                            <p>Services</p>
                            <p>Contact</p>
                        </Grid.Col>

                        <Grid.Col xs={24} sm={12} md={6}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>Contact Us</h4>
                            <p>Shimla, H.P</p>
                            <p>Phone: (91) 86278-14292</p>
                            <p>Email: 1310ranjan1997.com</p>
                        </Grid.Col>

                        <Grid.Col xs={24} sm={12} md={6}>
                            <h4 style={{ fontWeight: 'bold', marginBottom: 10 }}>Follow Us</h4>
                            <p>Facebook</p>
                            <p>Twitter</p>
                            <p>Instagram</p>
                        </Grid.Col>
                    </Grid.Row> */}

                    <Divider style={{ background: "rgba(255,255,255,0.3)", margin: "15px 0" }} />

                    {/* Footer Bottom */}
                    <Grid.Row>
                        <Grid.Col xs={24} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', margin: 0 }}>
                                © {new Date().getFullYear()} Ranjan Chauhan. All rights reserved.
                            </p>
                        </Grid.Col>
                    </Grid.Row>
                </Grid>
            </Container>
        </div>
    );
};

export default Footer;
