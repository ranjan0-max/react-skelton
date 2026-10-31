import { Autocomplete, Button, Dialog, Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// single image uploader
import SingleImageUploader from './SingleImageUploader';

// multiple image uploader
import MultipleImageUploader from './MultipleImageUploader';
import theme from '../componets/Theme';

// today as YYYY-MM-DD (local) -> past dates disabled in date field
const getToday = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today - offset).toISOString().split('T')[0];
};

const DynamicForm = ({ initialData = {}, fields = [], onSubmit, onClose, title, fontFamily, validationSchema }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [singleImage, setSingleImage] = useState(null);

    const formik = useFormik({
        initialValues: fields.reduce((acc, field) => {
            let value = initialData[field?.name];

            if (field?.type === 'date' && value) {
                const date = new Date(value);
                value = date.toISOString().split('T')[0];
            }

            acc[field?.name] = value || (field.type === 'number' ? '' : '');
            return acc;
        }, {}),
        validationSchema: validationSchema || null,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            if (singleImage) {
                values[fields.find((field) => field.type === 'image').name] = singleImage;
            }

            await onSubmit(values);
            resetForm();
            setSingleImage(null);
            setPreviewImage(null);
        }
    });

    const handleClose = () => {
        formik.resetForm();
        setSingleImage(null);
        setPreviewImage(null);
        onClose?.();
    };

    const inputSx = { '& .MuiInputBase-input': { fontFamily } };

    const renderField = ({ name, type, options = [], multiple }) => {
        const value = formik.values[name];
        const setValue = (newValue) => formik.setFieldValue(name, newValue);

        switch (type) {
            case 'image':
                return multiple ? (
                    <MultipleImageUploader
                        attachments={value}
                        handleFileTable={(rows) => setValue(rows)}
                        documentType={name}
                        preview={false}
                        fontFamily={fontFamily}
                    />
                ) : (
                    <SingleImageUploader
                        name={name}
                        value={value}
                        onChange={(name, base64) => setSingleImage(base64)}
                        fontFamily={fontFamily}
                    />
                );

            case 'phone':
                return (
                    <MuiTelInput
                        fullWidth
                        defaultCountry="IN"
                        size="small"
                        name={name}
                        value={value || ''}
                        onChange={(newValue) => setValue(newValue)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '4px',
                                fontFamily: fontFamily
                            },
                            '& .MuiInputBase-input': {
                                fontFamily: fontFamily,
                                fontSize: '0.875rem'
                            }
                        }}
                    />
                );

            case 'select':
                return (
                    <TextField select fullWidth size="small" value={value ?? ''} onChange={(e) => setValue(e.target.value)} sx={inputSx}>
                        <MenuItem value="">
                            <em>Select</em>
                        </MenuItem>
                        {options.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case 'input-select':
                //? pick from list or type a new value (old rsuite InputPicker "creatable")
                return (
                    <Autocomplete
                        freeSolo
                        size="small"
                        options={options}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option?.name ?? '')}
                        isOptionEqualToValue={(option, selected) => option.id === (selected?.id ?? selected)}
                        value={options.find((opt) => opt.id === value) || value || null}
                        onChange={(event, selected) => setValue(typeof selected === 'string' ? selected : selected?.id ?? '')}
                        onInputChange={(event, inputValue, reason) => {
                            if (reason === 'input') setValue(inputValue);
                        }}
                        renderInput={(params) => <TextField {...params} sx={inputSx} />}
                    />
                );

            case 'textarea':
                return (
                    <TextField fullWidth multiline rows={4} value={value ?? ''} onChange={(e) => setValue(e.target.value)} sx={inputSx} />
                );

            case 'date':
                return (
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        value={value || ''}
                        onChange={(e) => setValue(e.target.value)}
                        slotProps={{ htmlInput: { min: getToday() } }}
                        sx={inputSx}
                    />
                );

            case 'number':
                return (
                    <TextField
                        type="number"
                        fullWidth
                        size="small"
                        value={value ?? ''}
                        onChange={(e) => setValue(e.target.value)}
                        sx={inputSx}
                    />
                );

            case 'password':
                return (
                    <TextField type="password" fullWidth size="small" defaultValue="" onChange={(e) => setValue(e.target.value)} sx={inputSx} />
                );

            case 'checkbox':
                return (
                    <div
                        onClick={() => setValue(!value)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer",
                            padding: "8px 0",
                            fontFamily,
                        }}
                    >
                        <div
                            style={{
                                width: 18,
                                height: 18,
                                border: "1px solid #b4afafff",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: value ? theme.palette.primary.main : "transparent",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {value && (
                                <span
                                    style={{
                                        color: "#fff",
                                        fontSize: 12,
                                        fontWeight: "bold",
                                        lineHeight: 1
                                    }}
                                >
                                    ✓
                                </span>
                            )}
                        </div>

                        <span style={{ fontSize: 14 }}>
                            {fields.find((field) => field.name === name)?.label}
                        </span>
                    </div>
                );

            default:
                return <TextField fullWidth size="small" value={value ?? ''} onChange={(e) => setValue(e.target.value)} sx={inputSx} />;
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container columnSpacing={2.5} sx={{ p: 2.5 }}>
                <Grid size={12}>
                    <Typography sx={{ fontFamily, fontSize: 22, fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {Array.isArray(initialData.images) && initialData.images.length > 0 && (
                    <Grid size={12}>
                        <Typography sx={{ fontFamily, mb: 1, display: 'block' }}>Uploaded Images:</Typography>
                        <Grid container spacing={1.25}>
                            {initialData.images.map((img, index) => (
                                <Grid key={index}>
                                    <img
                                        src={img.imageUrl}
                                        alt={`Img ${index}`}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 6,
                                            objectFit: 'cover',
                                            border: '1px solid #ccc',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setPreviewImage(img.imageUrl)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Divider sx={{ mt: '15px', mb: 2 }} />
                    </Grid>
                )}

                {fields.map((field) => (
                    <Grid
                        size={{ xs: 12, sm: field.type === 'image' || field.type === 'textarea' ? 12 : 6 }}
                        key={field.name}
                        sx={{ mb: '18px' }}
                    >
                        {field.type !== 'checkbox' && (
                            <Typography sx={{ fontFamily, mb: 0.5, display: 'block', fontSize: 14 }}>
                                {field.label}
                            </Typography>
                        )}
                        {renderField(field)}
                        {formik.touched[field.name] && formik.errors[field.name] && (
                            <Typography sx={{ color: 'red', fontSize: 12 }}>{formik.errors[field.name]}</Typography>
                        )}
                    </Grid>
                ))}
                <Grid size={12} sx={{ textAlign: 'center', mt: '10px' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            border: '1px solid black'
                        }}
                    >
                        Submit
                    </Button>
                    <Button variant="outlined" color="error" sx={{ ml: '10px' }} onClick={handleClose}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="lg" fullWidth>
                <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '70vh', objectFit: 'contain' }}
                />
            </Dialog>
        </form>
    );
};

DynamicForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    fields: PropTypes.array.isRequired,
    title: PropTypes.string,
    fontFamily: PropTypes.string,
    validationSchema: PropTypes.object
};

export default DynamicForm;
