import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Paper, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DynamicViewDetail = ({ title, data = {}, fields = [], fontFamily = 'sans-serif' }) => {
    const [previewImage, setPreviewImage] = useState(null);

    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <h4 style={{ fontFamily, fontWeight: "600", color: "#1675E0", marginBottom: 10 }}>
                {title}
            </h4>

            <Divider sx={{ mb: 2 }} />

            <Grid container rowSpacing={2.5}>
                {fields.map(({ name, label }, index) => (
                    <Grid key={index} size={6}>
                        <div style={{ color: "gray", fontSize: 14, fontFamily }}>{label}</div>
                        <div style={{ fontSize: 16, fontFamily }}>{data?.[name]}</div>
                    </Grid>
                ))}

                {Array.isArray(data.images) && data.images.length > 0 && (
                    <Grid size={12}>
                        <div style={{ color: "gray", fontSize: 14, marginBottom: 10, fontFamily }}>
                            Uploaded Images:
                        </div>

                        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: '10px' }}>
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
                    </Grid>
                )}
            </Grid>

            {/* IMAGE PREVIEW MODAL */}
            <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ p: 1 }}>
                    <IconButton onClick={() => setPreviewImage(null)} sx={{ position: 'absolute', right: 16, top: 16 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center" }}>
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "70vh",
                            borderRadius: 10
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPreviewImage(null)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DynamicViewDetail;
