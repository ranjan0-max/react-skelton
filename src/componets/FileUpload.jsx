import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, IconButton, Paper } from '@mui/material';
import { useState } from 'react';

const FileUpload = ({ handleSubmit, fontFamily, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
            setMessage('');
        } else {
            setMessage('Please upload a valid CSV or Excel file.');
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setUploading(true);
            handleSubmit(formData);
        } catch (error) {
            setMessage('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: '30px', textAlign: 'center', position: 'relative' }}>

            {onClose && (
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        fontSize: 18
                    }}
                >
                    <CloseIcon />
                </IconButton>
            )}

            <h4 style={{ fontFamily, color: '#1675E0', fontWeight: 'bold' }}>
                Upload CSV or Excel File
            </h4>

            <div style={{ marginBottom: 16 }}>
                <Button component="label" variant="outlined" sx={{ fontFamily }}>
                    Choose File
                    <input
                        type="file"
                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        hidden
                        id="file-upload"
                        onChange={handleFileChange}
                    />
                </Button>
            </div>

            {selectedFile && (
                <div style={{ marginBottom: 16, wordBreak: 'break-word', fontFamily }}>
                    {selectedFile.name}
                </div>
            )}

            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                sx={{ minWidth: 120, fontFamily, mb: '10px' }}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>

            {message && (
                <Alert severity="error" sx={{ mt: '10px' }}>
                    {message}
                </Alert>
            )}
        </Paper>
    );
};

export default FileUpload;
