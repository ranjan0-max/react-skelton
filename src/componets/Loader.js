import React from 'react';
import { Loader as RsLoader } from 'rsuite';
import theme from '../componets/Theme';

const Loader = () => {

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1301,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <RsLoader
                size="lg"
                content="Loading..."
                style={{ color: theme.palette.primary.main }}
            />
        </div>
    );
}

export default Loader;
