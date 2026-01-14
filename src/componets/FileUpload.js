import CloseIcon from '@rsuite/icons/Close';
import { Button, IconButton, Panel, Message } from 'rsuite';
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
        <Panel bordered style={{ padding: 30, textAlign: 'center', position: 'relative' }}>

            {onClose && (
                <IconButton
                    appearance="subtle"
                    icon={<CloseIcon />}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        fontSize: 18
                    }}
                />
            )}

            <h4 style={{ fontFamily, color: '#1675E0', fontWeight: 'bold' }}>
                Upload CSV or Excel File
            </h4>

            <div style={{ marginBottom: 16 }}>
                <input
                    type="file"
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    style={{ display: 'none' }}
                    id="file-upload"
                    onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                    <Button appearance="ghost" style={{ fontFamily }}>
                        Choose File
                    </Button>
                </label>
            </div>

            {selectedFile && (
                <div style={{ marginBottom: 16, wordBreak: 'break-word', fontFamily }}>
                    {selectedFile.name}
                </div>
            )}

            <Button
                appearance="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                style={{ minWidth: 120, fontFamily, marginBottom: 10 }}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </Button>

            {message && (
                <Message type="error" showIcon style={{ marginTop: 10 }}>
                    {message}
                </Message>
            )}
        </Panel>
    );
};

export default FileUpload;
