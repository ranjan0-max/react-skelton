import React from 'react';
import { Box, Typography, Input, Button, Menu, MenuItem, Divider } from '@mui/material';

const Invoice = () => {
    console.log('Rendering Invoice Component');

    return (
        <Box className="main-container">
            <Typography variant="h4">M/S KISSAN ENTERPRISES</Typography>
            <Typography variant="body1">V.P.O Shambhuwala, Nahan, Distt. Sirmour(H.P)</Typography>
            <Typography variant="h3">INVOICE</Typography>
            <Box id="p">
                <Box id="cus-detail">
                    <Box id="cus-input">
                        <Input type="text" className="cusmar pad" placeholder="Name/Cash" autoFocus />
                        <Box id="show-to" />
                        <Input type="text" className="cusmar pad" placeholder="Address" />
                        <Box id="show-address" />
                        <Input type="text" className="pad" placeholder="GST No" />
                        <Box id="show-gst" />
                    </Box>
                    <Box id="show-detail" />
                </Box>
                <Box id="ind">
                    <Input type="text" placeholder="Date" />
                    <Box id="show-date" />
                    <Input type="text" placeholder="Invoice Number" />
                    <Box id="show-billno" />
                    <Input type="text" placeholder="Vehicle No" />
                    <Box id="vehicle-no" />
                </Box>
            </Box>

            <Box id="table-con">
                <table>
                    <thead>
                        <tr id="heading">
                            <th>S.NO</th>
                            <th>ITEM NAME</th>
                            <th>HSN</th>
                            <th>GST</th>
                            <th>QUANTITY</th>
                            <th>PER</th>
                            <th>RATE</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="submit-form">
                            <td>
                                <Input id="sno" type="text" name="serial-no" disabled />
                            </td>
                            <td>
                                <Input id="itemname" type="text" name="item-name" list="itm-name" />
                                <datalist id="itm-name" />
                            </td>
                            <td>
                                <Input id="hsn" type="text" name="hsn" />
                            </td>
                            <td>
                                <Input id="gst" type="text" name="gst" />
                            </td>
                            <td>
                                <Input id="quantity" type="text" name="quantity" />
                            </td>
                            <td>
                                <Input id="per" type="text" name="per-unit" />
                            </td>
                            <td>
                                <Input id="rate" type="text" name="rate" />
                            </td>
                            <td>
                                <Input id="total" type="text" name="total" disabled />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <Box id="edit-form-holder">
                    <Box id="edi-form">
                        <Input type="text" disabled />
                        <Input type="text" />
                        <Input type="text" />
                        <Input type="text" id="gstupdate" />
                        <Input type="text" id="quantityupdate" />
                        <Input type="text" />
                        <Input type="text" id="rateupdate" />
                        <Input type="text" id="totalupdate" disabled />
                    </Box>
                    <Button id="update">Update</Button>
                </Box>

                <Box id="sub-total">
                    <Box id="subtotal-display" className="total-dis">
                        <Typography className="label">Sub Total</Typography>
                        <Typography className="value" id="tvalue"></Typography>
                    </Box>
                </Box>

                <Box id="ex-con">
                    <Box id="gstd">
                        <Box className="total-dis" id="gst5-display">
                            <Typography className="label">GST 5%</Typography>
                            <Typography className="value"></Typography>
                        </Box>
                        <Box className="total-dis" id="gst12-display">
                            <Typography className="label">GST 12%</Typography>
                            <Typography className="value"></Typography>
                        </Box>
                        <Box className="total-dis" id="gst18-display">
                            <Typography className="label">GST 18%</Typography>
                            <Typography className="value"></Typography>
                        </Box>
                        <Box className="total-dis" id="gst28-display">
                            <Typography className="label">GST 28%</Typography>
                            <Typography className="value"></Typography>
                        </Box>
                    </Box>
                </Box>

                <Box id="grand-total">
                    <Typography className="label">Total</Typography>
                    <Typography className="value" id="tvalue"></Typography>
                </Box>

                <Box>
                    <Button id="save">Save</Button>
                    <Button id="delete">Delete</Button>
                </Box>

                <Box id="busdetail">
                    <table id="au">
                        <tbody>
                            <tr id="bfrow">
                                <td>
                                    Bank Name: Central Bank of India
                                    <br />
                                    IFSC: CBIN0281452
                                    <br />
                                    Acc. No: 1903643495
                                    <br />
                                    Contact: 9418139348, 9418227526
                                    <br />
                                    GST No.: 02BFFPK7827A1ZW
                                </td>
                                <td>Authorized Signature</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
};

export default Invoice;
