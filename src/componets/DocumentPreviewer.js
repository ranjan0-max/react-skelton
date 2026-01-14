import React from 'react';
import { Text } from 'rsuite';
import PageIcon from '@rsuite/icons/Page';

const DocumentPreviewer = ({ msg }) => {
    const fileExtension = msg.document?.split('.').pop()?.toLowerCase();

    if (msg.type === 'document') {
        if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(fileExtension)) {
            return (
                <img
                    src={msg.document}
                    alt="attachment"
                    style={{
                        maxWidth: '100%',
                        borderRadius: 8,
                        cursor: 'pointer'
                    }}
                    onClick={() => window.open(msg.document, '_blank')}
                />
            );
        }

        return (
            <a
                href={msg.document}
                target="_blank"
                download
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    color: 'inherit',
                    fontSize: 14
                }}
            >
                <PageIcon style={{ fontSize: 22 }} />
                {msg.document?.split('/').pop()}
            </a>
        );
    }

    return <Text style={{
        color: 'inherit',
        fontFamily: 'inherit'
    }}> {msg.message}</Text >;
};

export default DocumentPreviewer;
