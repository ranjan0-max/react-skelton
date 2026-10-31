import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowLeftLineIcon from '@mui/icons-material/ChevronLeft';
import ArrowRightLineIcon from '@mui/icons-material/ChevronRight';
import { Dialog, DialogContent, IconButton } from '@mui/material';

const navButtonSx = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
    background: 'rgba(0,0,0,0.3)',
    zIndex: 2
};

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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            slotProps={{ paper: { sx: { background: '#000' } } }}
        >
            <DialogContent sx={{ p: 0, position: 'relative', textAlign: 'center' }}>

                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#fff', zIndex: 2 }}>
                    <CloseIcon />
                </IconButton>

                <IconButton disabled={images.length <= 1} onClick={handlePrev} sx={{ ...navButtonSx, left: 10 }}>
                    <ArrowLeftLineIcon />
                </IconButton>

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

                <IconButton disabled={images.length <= 1} onClick={handleNext} sx={{ ...navButtonSx, right: 10 }}>
                    <ArrowRightLineIcon />
                </IconButton>

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
            </DialogContent>
        </Dialog>
    );
};

export default ImageViewer;
