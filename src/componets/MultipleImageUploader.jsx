import theme from '../componets/Theme';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useSnackbarAlert from 'customHook/alert';
import React, { useRef, useState } from 'react';

// icons
import ImageIcon from '@mui/icons-material/Image';
import TrashIcon from '@mui/icons-material/Delete';

// apis
import { deleteFile, getFileLink, uploadFile } from 'api/fileUploadAndDelete/fileUploadAndDeleteApi';

const fileTableHeader = [{ link: '' }];

const MultipleImageUploader = ({ attachments, handleFileTable, preview, documentType, fontFamily }) => {
    const { openTostar, SnackbarComponent } = useSnackbarAlert();
    const fileInputRef = useRef(null);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [inputRowDetail, setInputRowDetail] = useState(fileTableHeader);
    const [fileTableDetail, setFileTableDetail] = useState([]);
    const [fileDataInString, setFileDataInString] = useState('');

    const headerCellSx = {
        fontWeight: 700,
        background: theme.palette.primary.main,
        color: 'white',
        textAlign: 'center',
        fontFamily: fontFamily
    };

    const handlePreviewAttachment = async (fileName) => {
        try {
            const response = await getFileLink(fileName);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ======================== File Upload Table =====================================

    const convertBase64 = (file) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });

    const clearFileInput = () => {
        const inputElement = fileInputRef.current;
        if (inputElement) {
            inputElement.value = '';
        }
    };

    const handleInputChangeOfFileInput = async (e, index) => {
        const { name, value } = e.target;
        if (name === 'link') {
            const file = e.target.files[0];
            const pdfString = await convertBase64(file);
            setFileDataInString(pdfString);
            const updatedInputRowDetail = [...inputRowDetail];
            updatedInputRowDetail[index] = { ...updatedInputRowDetail[index], [name]: value };
            const currentInputRowDetail = updatedInputRowDetail[index];
            updatedInputRowDetail[index] = {
                ...currentInputRowDetail
            };
            setInputRowDetail(updatedInputRowDetail);
        }
    };

    const handleAddRowInFileTable = async () => {
        if (inputRowDetail[0].link) {
            if (selectedRowIndex !== null) {
                // update
                const updatedTableDetail = [...fileTableDetail];
                updatedTableDetail[selectedRowIndex] = { ...inputRowDetail[0] };
                setFileTableDetail(updatedTableDetail);
                setSelectedRowIndex(null);
            } else {
                // add
                const data = {
                    file: fileDataInString,
                    documentName: documentType
                };
                const response = await uploadFile(data);
                if (typeof response === 'string') {
                    openTostar(response, 'error');
                } else {
                    inputRowDetail[0].link = response.data.data;
                    openTostar(response.data.message, 'success');
                    setFileTableDetail((prevDetail) => [...prevDetail, inputRowDetail[0]]);
                }
                clearFileInput();
            }
            setInputRowDetail(fileTableHeader);
        } else {
            openTostar('Field Should Not Be Empty Of Attachment Table', 'error');
        }
    };

    const handleDeleteRowFileTable = async (index, rowData) => {
        if (!preview) {
            if (rowData.isSubmitted) {
                const data = { filePath: rowData.link };
                const response = await deleteFile(data);
                if (typeof response === 'string') {
                    openTostar(response, 'error');
                } else {
                    openTostar(response.data.message, 'success');
                    setFileTableDetail((prev) => prev.filter((_, i) => i !== index));
                }
            } else {
                setFileTableDetail((prev) => prev.filter((_, i) => i !== index));
                openTostar('File removed', 'info');
            }
        } else {
            openTostar('This is preview mode, You can not delete the file', 'error');
        }
    };

    // =============================== End =================================================

    React.useEffect(() => {
        if (attachments?.length) {
            const imagesArray = attachments.map((attachment) => ({
                link: attachment,
                isSubmitted: true
            }));
            setFileTableDetail(imagesArray);
        }
    }, []);

    React.useEffect(() => {
        handleFileTable(fileTableDetail);
    }, [fileTableDetail]);

    return (
        <>
            <SnackbarComponent />
            <TableContainer
                sx={{
                    width: '100%',
                    maxHeight: 175,
                    background: '#fff',
                    borderRadius: '6px',
                    boxShadow: fileTableDetail.length ? '0 0 6px rgba(0,0,0,0.08)' : 'none'
                }}
            >
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={headerCellSx}>FILE</TableCell>
                            <TableCell sx={headerCellSx}>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fileTableDetail.map((rowData, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" sx={{ border: 0 }}>
                                    <IconButton
                                        onClick={() => handlePreviewAttachment(rowData.link)}
                                        sx={{ fontSize: '20px', color: theme.palette.primary.main }}
                                    >
                                        <ImageIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center" sx={{ border: 0 }}>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteRowFileTable(index, rowData)}
                                        sx={{ fontSize: '20px' }}
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!preview && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                    <input
                        type="file"
                        name="link"
                        ref={fileInputRef}
                        accept="application/*, image/*"
                        onChange={(e) => handleInputChangeOfFileInput(e, 0)}
                        style={{ width: '100%', fontFamily: fontFamily }}
                    />

                    <Button
                        size="small"
                        variant="contained"
                        onClick={handleAddRowInFileTable}
                        sx={{
                            width: '100px',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white'
                        }}
                    >
                        Add
                    </Button>
                </div>
            )}
        </>
    );
};

export default MultipleImageUploader;
