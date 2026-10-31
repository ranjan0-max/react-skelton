import React from 'react';
import { Container, Divider } from '@mui/material';
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
            <Container maxWidth={false}>
                <Divider sx={{ background: "rgba(255,255,255,0.3)", my: "15px" }} />

                {/* Footer Bottom */}
                <p style={{ fontSize: '12px', margin: 0, textAlign: 'center' }}>
                    © {new Date().getFullYear()} Ranjan Chauhan. All rights reserved.
                </p>
            </Container>
        </div>
    );
};

export default Footer;
