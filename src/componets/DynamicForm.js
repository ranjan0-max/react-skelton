import {
    Button,
    FlexboxGrid,
    Col,
    Divider,
    Modal,
    Input,
    InputNumber,
    SelectPicker,
    DatePicker,
    Text,
    InputPicker
} from 'rsuite';
import MuiPhoneNumber from 'mui-phone-number';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// single image uploader
import SingleImageUploader from './SingleImageUploader';

// multiple image uploader
import MultipleImageUploader from './MultipleImageUploader';
import theme from '../componets/Theme';

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

    return (
        <form onSubmit={formik.handleSubmit}>
            <FlexboxGrid style={{ padding: 20 }} gutter={20}>
                <Col xs={24}>
                    <Text style={{ fontFamily, fontSize: 22, fontWeight: 600 }}>
                        {title}
                    </Text>
                    <Divider />
                </Col>

                {Array.isArray(initialData.images) && initialData.images.length > 0 && (
                    <Col xs={24}>
                        <Text style={{ fontFamily, marginBottom: 8, display: 'block' }}>Uploaded Images:</Text>
                        <FlexboxGrid gutter={10}>
                            {initialData.images.map((img, index) => (
                                <Col key={index}>
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
                                </Col>
                            ))}
                        </FlexboxGrid>
                        <Divider style={{ marginTop: 15 }} />
                    </Col>
                )}

                {fields.map(({ name, label, type, options, multiple }) => (
                    <Col
                        xs={24}
                        sm={type === 'image' || type === 'textarea' ? 24 : 12}
                        key={name}
                        style={{ marginBottom: 18 }}
                    >
                        {type !== 'checkbox' && (
                            <Text style={{ fontFamily, marginBottom: 4, display: 'block' }}>
                                {label}
                            </Text>
                        )}
                        {type === 'image' ? (
                            <>
                                {multiple ? (
                                    <MultipleImageUploader
                                        attachments={formik.values[name]}
                                        handleFileTable={(rows) => formik.setFieldValue(name, rows)}
                                        documentType={name}
                                        preview={false}
                                        fontFamily={fontFamily}
                                    />
                                ) : (
                                    <SingleImageUploader
                                        name={name}
                                        value={formik.values[name]}
                                        onChange={(name, base64) => setSingleImage(base64)}
                                        fontFamily={fontFamily}
                                    />
                                )}
                            </>
                        ) : type === 'phone' ? (
                            <MuiPhoneNumber
                                fullWidth
                                defaultCountry="in"
                                variant="outlined"
                                size="small"
                                name={name}
                                value={formik.values[name]}
                                onChange={(value) => formik.setFieldValue(name, value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '4px',
                                        fontFamily: fontFamily,
                                    },
                                    '& .MuiInputBase-input': {
                                        fontFamily: fontFamily,
                                        fontSize: '0.875rem',
                                        height: '40px',
                                        boxSizing: 'border-box',
                                    },
                                }}
                            />
                        ) : type === 'select' ? (
                            <SelectPicker
                                data={options.map(item => ({ label: item.name, value: item.id }))}
                                block
                                value={formik.values[name]}
                                onChange={(value) => formik.setFieldValue(name, value)}
                                menuStyle={{
                                    maxHeight: 165,
                                    overflowY: 'auto',
                                    zIndex: 9999
                                }}
                            />
                        ) : type === 'input-select' ? (
                            <InputPicker
                                block
                                searchable
                                creatable
                                value={formik.values[name] ?? null}
                                onChange={(value) => {
                                    formik.setFieldValue(name, value);
                                }}
                                data={[
                                    ...options.map(item => ({
                                        label: item.name,
                                        value: item.id
                                    })),
                                    ...(formik.values[name] &&
                                        !options.some(opt => opt.id === formik.values[name])
                                        ? [{
                                            label: formik.values[name],
                                            value: formik.values[name]
                                        }]
                                        : [])
                                ]}
                                menuStyle={{
                                    maxHeight: 165,
                                    overflowY: 'auto',
                                    zIndex: 9999
                                }}
                            />) : type === 'textarea' ? (
                                <Input
                                    as="textarea"
                                    rows={4}
                                    block
                                    value={formik.values[name]}
                                    onChange={(value) => formik.setFieldValue(name, value)}
                                />
                            ) : type === 'date' ? (
                                <DatePicker
                                    format="yyyy-MM-dd"
                                    value={formik.values[name] ? new Date(formik.values[name]) : null}
                                    oneTap
                                    block
                                    onChange={(value) =>
                                        formik.setFieldValue(name, value?.toISOString().split('T')[0])
                                    }
                                    menuStyle={{ zIndex: 9999 }}
                                    disabledDate={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today;
                                    }}
                                    cleanable={false}
                                />
                            ) : type === 'number' ? (
                                <InputNumber
                                    block
                                    value={formik.values[name]}
                                    onChange={(value) => formik.setFieldValue(name, value)}
                                />
                            ) : type === 'password' ? (
                                <Input
                                    type="password"
                                    block
                                    defaultValue=""
                                    onChange={(value) => formik.setFieldValue(name, value)}
                                />
                            ) : type === 'checkbox' ? (
                                <div
                                    onClick={() => formik.setFieldValue(name, !formik.values[name])}
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
                                            backgroundColor: formik.values[name] ? theme.palette.primary.main : "transparent",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        {formik.values[name] && (
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
                                        {label}
                                    </span>
                                </div>
                            ) : (
                            <Input
                                block
                                value={formik.values[name]}
                                onChange={(value) => formik.setFieldValue(name, value)}
                            />
                        )}
                        {formik.touched[name] && formik.errors[name] && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{formik.errors[name]}</Text>
                        )}
                    </Col>
                ))}
                <Col xs={24} style={{ textAlign: 'center', marginTop: 10 }}>
                    <Button
                        type="submit"
                        style={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            border: '1px solid black'
                        }}
                    >
                        Submit
                    </Button>
                    <Button appearance="ghost" color="red" style={{ marginLeft: 10 }} onClick={handleClose}>
                        Cancel
                    </Button>
                </Col>
            </FlexboxGrid>
            <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} size="lg">
                <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '70vh', objectFit: 'contain' }}
                />
            </Modal>
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
