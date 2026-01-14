import React, { useState } from 'react';
import { Panel, FlexboxGrid, Divider, Modal, Button, Stack } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';

const DynamicViewDetail = ({ title, data = {}, fields = [], fontFamily = 'sans-serif' }) => {
    const [previewImage, setPreviewImage] = useState(null);

    return (
        <Panel bordered style={{ padding: 20 }}>
            <h4 style={{ fontFamily, fontWeight: "600", color: "#1675E0", marginBottom: 10 }}>
                {title}
            </h4>

            <Divider />

            <FlexboxGrid justify="start" style={{ rowGap: "20px" }}>
                {fields.map(({ name, label }, index) => (
                    <FlexboxGrid.Item key={index} colspan={12}>
                        <div style={{ color: "gray", fontSize: 14, fontFamily }}>{label}</div>
                        <div style={{ fontSize: 16, fontFamily }}>{data?.[name]}</div>
                    </FlexboxGrid.Item>
                ))}

                {Array.isArray(data.images) && data.images.length > 0 && (
                    <FlexboxGrid.Item colspan={24}>
                        <div style={{ color: "gray", fontSize: 14, marginBottom: 10, fontFamily }}>
                            Uploaded Images:
                        </div>

                        <Stack wrap spacing={10}>
                            {data.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.imageUrl}
                                    alt={`preview-${idx}`}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 6,
                                        border: "1px solid #ddd",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setPreviewImage(img.imageUrl)}
                                />
                            ))}
                        </Stack>
                    </FlexboxGrid.Item>
                )}
            </FlexboxGrid>

            {/* IMAGE PREVIEW MODAL */}
            <Modal open={!!previewImage} onClose={() => setPreviewImage(null)} size="lg">
                <Modal.Header>
                    <CloseIcon
                        onClick={() => setPreviewImage(null)}
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: 16,
                            top: 16
                        }}
                    />
                </Modal.Header>

                <Modal.Body style={{ textAlign: "center" }}>
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "70vh",
                            borderRadius: 10
                        }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => setPreviewImage(null)} appearance="primary">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Panel>
    );
};

export default DynamicViewDetail;
