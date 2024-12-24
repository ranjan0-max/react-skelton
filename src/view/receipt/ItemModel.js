import PropTypes from 'prop-types';
import * as React from 'react';

import {
    Autocomplete,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// project imports
import { gridSpacing } from 'constant/constant';

// constant
const getInitialValues = (event, range, itemDetail) => {
    const newEvent = {
        name: !event ? itemDetail?.name : '',
        itemType: !event ? itemDetail?.itemType : '',
        purchaseRate: !event ? itemDetail?.purchaseRate : '',
        oneKg: !event ? itemDetail?.oneKg : '',
        hundredGram: !event ? itemDetail?.hundredGram : '',
        tenGram: !event ? itemDetail?.tenGram : '',
        sellingPrice: !event ? itemDetail?.sellingPrice : '',
        gst: !event ? itemDetail?.gst : '',
        hsnCode: !event ? itemDetail?.hsnCode : ''
    };

    if (event || range) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

// ==============================|| COUNTRY EVENT ADD / EDIT / DELETE ||============================== //

const ItemModel = ({ event, range, handleCreate, handleUpdate, onCancel, itemDetail, itemList }) => {
    const EventSchema = Yup.object().shape({
        name: Yup.string().max(255).required('Item Name is required'),
        itemType: Yup.string().max(255).required('Item Type is required'),
        purchaseRate: Yup.number().required('Purchase Rate is required'),
        gst: Yup.number().required('GST is required')
        // hsnCode: Yup.number().required('HSN is required')
    });

    const [openQuantity, setOpenQuantity] = React.useState(false);

    const formik = useFormik({
        initialValues: getInitialValues(event, range, itemDetail),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = values;
                if (event) {
                    handleCreate(data);
                } else {
                    handleUpdate(itemDetail._id, data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

    const handleNameChange = () => {
        formik.setFieldValue('name', values.name.toUpperCase());
    };

    React.useEffect(() => {
        if (values.itemType === 'OPEN') {
            setOpenQuantity(true);
        } else {
            setOpenQuantity(false);
        }
    }, [values.itemType]);

    // React.useEffect(() => {
    //     handleNameChange();
    //     // eslint-disable-next-line
    // }, [values.name]);

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider>
                <Form autoComplete="off" onSubmit={handleSubmit}>
                    <DialogTitle>{event ? 'Add Item' : 'Edit Item'}</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">Item Name</Typography>
                                <Autocomplete
                                    size="small"
                                    {...getFieldProps('name')}
                                    value={formik.values.name}
                                    onChange={(_, value) => {
                                        if (itemList.some((item) => item.name === value?.name)) {
                                            formik.setFieldError('name', 'This item already exists');
                                            setTimeout(() => {
                                                formik.setFieldValue('name', '');
                                            }, 1000);
                                        } else {
                                            formik.setFieldValue('name', value);
                                            formik.setFieldError('name', '');
                                        }
                                    }}
                                    options={itemList}
                                    getOptionLabel={(item) => item?.name || formik.values.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            {...getFieldProps('name')}
                                            label="Name"
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">Item Type</Typography>
                                <TextField
                                    size="small"
                                    select
                                    style={{ width: '70%' }}
                                    {...getFieldProps('itemType')}
                                    error={Boolean(touched.itemType && errors.itemType)}
                                    helperText={touched.itemType && errors.itemType}
                                >
                                    <MenuItem value="BOTTLE">BOTTLE</MenuItem>
                                    <MenuItem value="KNTR">KNTR</MenuItem>
                                    <MenuItem value="PKT">PKT</MenuItem>
                                    <MenuItem value="PIEC">PIEC</MenuItem>
                                    <MenuItem value="BAG">BAG</MenuItem>
                                    <MenuItem value="OPEN">OPEN</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">GST</Typography>
                                <TextField
                                    size="small"
                                    {...getFieldProps('gst')}
                                    error={Boolean(touched.gst && errors.gst)}
                                    helperText={touched.gst && errors.gst}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">HSN Code</Typography>
                                <TextField
                                    size="small"
                                    {...getFieldProps('hsnCode')}
                                    error={Boolean(touched.hsnCode && errors.hsnCode)}
                                    helperText={touched.hsnCode && errors.hsnCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={6}>
                                <Typography marginBottom="5px">Purchase Rate</Typography>
                                <TextField
                                    size="small"
                                    {...getFieldProps('purchaseRate')}
                                    error={Boolean(touched.purchaseRate && errors.purchaseRate)}
                                    helperText={touched.purchaseRate && errors.purchaseRate}
                                />
                            </Grid>
                            {openQuantity === true ? (
                                <>
                                    <Grid item xs={12} sm={3} md={6}>
                                        <Typography marginBottom="5px">1 KG Price</Typography>
                                        <TextField
                                            size="small"
                                            {...getFieldProps('oneKg')}
                                            error={Boolean(touched.oneKg && errors.oneKg)}
                                            helperText={touched.oneKg && errors.oneKg}
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <Grid item xs={12} sm={3} md={6}>
                                    <Typography marginBottom="5px">Selling Price</Typography>
                                    <TextField
                                        size="small"
                                        {...getFieldProps('sellingPrice')}
                                        error={Boolean(touched.sellingPrice && errors.sellingPrice)}
                                        helperText={touched.sellingPrice && errors.sellingPrice}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Grid item>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button type="button" variant="outlined" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        {!event ? 'Update' : 'Save'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

ItemModel.propTypes = {
    event: PropTypes.bool,
    range: PropTypes.object,
    handleDelete: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    onCancel: PropTypes.func
};

export default ItemModel;
