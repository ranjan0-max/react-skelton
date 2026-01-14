import React from 'react';
import CloseIcon from '@rsuite/icons/Close';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { Modal, IconButton } from 'rsuite';

const ImageViewer = ({ open, onClose, images = [], startIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = React.useState(startIndex);

    React.useEffect(() => {
        setCurrentIndex(startIndex);
    }, [startIndex, open]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
            overflow={false}
            style={{
                background: '#000',
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Modal.Body style={{ padding: 0, position: 'relative', textAlign: 'center' }}>

                <IconButton
                    icon={<CloseIcon />}
                    appearance="subtle"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: '#fff',
                        zIndex: 2
                    }}
                />

                <IconButton
                    icon={<ArrowLeftLineIcon />}
                    appearance="subtle"
                    disabled={images.length <= 1}
                    onClick={handlePrev}
                    style={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 2
                    }}
                />

                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    style={{
                        width: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        borderRadius: 6
                    }}
                />

                <IconButton
                    icon={<ArrowRightLineIcon />}
                    appearance="subtle"
                    disabled={images.length <= 1}
                    onClick={handleNext}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 2
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 14
                    }}
                >
                    {currentIndex + 1} / {images.length}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImageViewer;
