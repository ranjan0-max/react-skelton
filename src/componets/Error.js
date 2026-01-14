import React from 'react';
import { Panel, FlexboxGrid } from 'rsuite';

const Error = () => {
    return (
        <FlexboxGrid
            justify="center"
            align="middle"
            style={{ height: '100%', textAlign: 'center' }}
        >
            <FlexboxGrid.Item colspan={20}>
                <Panel bordered style={{ padding: 30, maxWidth: 400, margin: '0 auto' }}>

                    <h2 style={{ marginBottom: 15, fontWeight: 600 }}>
                        Oops! Page not found.
                    </h2>

                    <p style={{ fontSize: '1rem', color: '#666', marginBottom: 20 }}>
                        The page you are looking for might have been removed or is temporarily unavailable.
                    </p>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};

export default Error;
