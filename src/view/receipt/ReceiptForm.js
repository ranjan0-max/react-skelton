import { Close } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { getItemList } from 'api/item/itemApi';
import MainCard from 'componets/MainCard';
import useSnackbarAlert from 'customHook/alert';
import React, { useRef, useState } from 'react';
import PrintReceipt from './PrintReceipt';

const BLANK = '';

const tableHeader = [
    {
        itemName: BLANK,
        quantity: BLANK,
        rate: BLANK,
        total: BLANK
    }
];

const ReceiptForm = ({ onClose }) => {
    const { handleOpen, SnackbarComponent } = useSnackbarAlert();
    const buttonRef = useRef(null);

    const [tableInputBox, setTableInputBox] = useState(tableHeader);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [itemTableDetail, setItemTableDetail] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [total, setTotal] = useState(0);
    const [showPrintReceipt, setShowPrintReceipt] = useState(false);
    const [showUnit, setShowUnit] = useState(false);
    const [selectedItemType, setSelectedItemType] = useState('');
    const [customerName, setCustomerName] = useState('');

    const fetchItem = async () => {
        try {
            const response = await getItemList();
            if (typeof response === 'string') {
                handleOpen(response, 'error');
            } else {
                setItemList(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddRow = () => {
        if (tableInputBox[0].itemName && tableInputBox[0].quantity && tableInputBox[0].rate) {
            if (selectedRowIndex !== null) {
                // update
                tableInputBox[0].quantity = tableInputBox[0].quantity + selectedItemType;
                const updatedTableDetail = [...itemTableDetail];
                updatedTableDetail[selectedRowIndex] = { ...tableInputBox[0] };
                setItemTableDetail(updatedTableDetail);
                setSelectedRowIndex(null);
                buttonRef.current.focus();
            } else {
                // add
                tableInputBox[0].quantity = tableInputBox[0].quantity + selectedItemType;
                setItemTableDetail((prevDetail) => [...prevDetail, tableInputBox[0]]);
                buttonRef.current.focus();
                setSelectedItemType('');
            }
            setTableInputBox(tableHeader);
            setShowUnit(false);
        } else {
            handleOpen('Field Should Not Be Empty Of Item Table', 'error');
        }
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedItem = [...tableInputBox];
        updatedItem[index] = { ...updatedItem[index], [name]: value };
        const currentItem = updatedItem[index];
        if (name === 'itemName') {
            const item = itemList.filter((row) => row.name.toLowerCase() === value.toLowerCase());
            if (item.length) {
                if (item[0]?.itemType !== 'OPEN') {
                    if (item[0].itemType === 'BOTTLE') {
                        setSelectedItemType('BTL');
                    } else if (item[0].itemType === 'KNTR') {
                        setSelectedItemType('KNTR');
                    } else if (item[0].itemType === 'PKT') {
                        setSelectedItemType('PKT');
                    } else if (item[0].itemType === 'PIEC') {
                        setSelectedItemType('PC');
                    } else if (item[0].itemType === 'BAG') {
                        setSelectedItemType('BAG');
                    }
                    currentItem.rate = item[0].sellingPrice;
                }

                if (item[0]?.itemType === 'OPEN') {
                    setSelectedItemType('KG');
                    currentItem.rate = item[0].oneKg;
                }
            } else {
                currentItem.rate = null;
            }
        }

        if (currentItem.quantity && currentItem.rate) {
            currentItem.total = currentItem.quantity * currentItem.rate;
        }
        updatedItem[index] = { ...currentItem };
        setTableInputBox(updatedItem);
    };

    const handleDeleteRow = (index) => {
        setItemTableDetail((prevDimensions) => prevDimensions.filter((_, i) => i !== index));
    };

    const getQuatityValue = (quantity) => {
        if (quantity.includes('BTL')) {
            quantity = quantity.replace('BTL', '');
            let intValue = parseInt(quantity);
            return intValue;
        } else if (quantity.includes('KNTR')) {
            quantity = quantity.replace('KNTR', '');
            let intValue = parseInt(quantity);
            return intValue;
        } else if (quantity.includes('PKT')) {
            quantity = quantity.replace('PKT', '');
            let intValue = parseInt(quantity);
            return intValue;
        } else if (quantity.includes('PC')) {
            quantity = quantity.replace('PC', '');
            let intValue = parseInt(quantity);
            return intValue;
        } else if (quantity.includes('BAG')) {
            quantity = quantity.replace('BAG', '');
            let intValue = parseInt(quantity);
            return intValue;
        } else if (quantity.includes('KG')) {
            quantity = quantity.replace('KG', '');
            let intValue = parseInt(quantity);
            return intValue;
        }
    };

    const handleEditRow = (index) => {
        const selectedRow = itemTableDetail[index];
        const filterItem = itemList.filter((row) => row.name.toLowerCase() === selectedRow.itemName.toLowerCase());
        if (filterItem[0].itemType !== 'OPEN') {
            if (filterItem[0].itemType === 'BOTTLE') {
                setSelectedItemType('BTL');
            } else if (filterItem[0].itemType === 'KNTR') {
                setSelectedItemType('KNTR');
            } else if (filterItem[0].itemType === 'PKT') {
                setSelectedItemType('PKT');
            } else if (filterItem[0].itemType === 'PIEC') {
                setSelectedItemType('PC');
            } else if (filterItem[0].itemType === 'BAG') {
                setSelectedItemType('BAG');
            }
        } else if (filterItem[0].itemType === 'OPEN') {
            if (selectedRow.rate == filterItem[0].oneKg) {
                setSelectedItemType('KG');
            }
        }

        const quantity = getQuatityValue(selectedRow.quantity);
        setSelectedRowIndex(index);
        setTableInputBox([
            {
                itemName: selectedRow.itemName,
                rate: selectedRow.rate,
                quantity: quantity,
                total: selectedRow.total
            }
        ]);
    };

    const handleTotalAmountOfTable = (tableDetail) => {
        let totalAmmount = 0;
        tableDetail.forEach((row) => {
            totalAmmount += parseFloat(row.total, 10);
        });
        setTotal(totalAmmount);
    };

    const handleBackClick = () => {
        onClose();
    };

    const printTable = () => {
        setShowPrintReceipt(true);
    };

    const handleClose = () => {
        setShowPrintReceipt(false);
        setItemTableDetail([]);
    };

    React.useEffect(() => {
        handleTotalAmountOfTable(itemTableDetail);
    }, [itemTableDetail]);

    React.useEffect(() => {
        fetchItem();
        // eslint-disable-next-line
    }, []);

    if (showPrintReceipt) {
        return <PrintReceipt itemTable={itemTableDetail} onCancel={handleClose} total={total} customerName={customerName} />;
    }

    return (
        <MainCard
            // title="Receipt"
            content={false}
        >
            <SnackbarComponent />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '12%', marginBottom: '1%', marginTop: '1%' }}>
                <TextField placeholder="Customer Name" size="small" onChange={(event) => setCustomerName(event.target.value)} />
                <Button color="error" variant="contained" onClick={handleBackClick}>
                    <Close />
                </Button>
            </div>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <TableContainer sx={{ maxHeight: 550, maxWidth: 900 }}>
                    <Table
                        style={{
                            border: '1px solid #2878b6',
                            borderRadius: '4px',
                            borderCollapse: 'inherit',
                            background: '#f8fafd'
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                >
                                    S.NO
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                >
                                    ITEM NAME
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                >
                                    QUANTITY
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                >
                                    RATE
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                >
                                    TOTAL
                                </TableCell>
                                <TableCell
                                    style={{ borderBottom: '1px solid black', color: '#2878b6', fontWeight: 'bolder', padding: '4px' }}
                                />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemTableDetail.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px' }}>{index + 1}</TableCell>
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px' }}>{row.itemName}</TableCell>{' '}
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px' }}>{row.quantity}</TableCell>
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px' }}>{row.rate}</TableCell>
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px' }}>{row.total}</TableCell>
                                    <TableCell style={{ borderBottom: '1px solid #2878b6', padding: '2px', display: 'flex' }}>
                                        <Stack direction="row">
                                            <Button color="error" onClick={() => handleDeleteRow(index)}>
                                                <RemoveCircleIcon sx={{ fontSize: '1.3rem' }} />
                                            </Button>
                                            <Button color="primary" onClick={() => handleEditRow(index)}>
                                                <EditIcon sx={{ fontSize: '1.3rem' }} />
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tableInputBox.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ padding: '2px' }} />
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            list={`browsers-${index}`}
                                            name="itemName"
                                            id={`itemName-${index}`}
                                            style={{
                                                width: '90%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid #2878b6'
                                            }}
                                            ref={buttonRef}
                                            value={row.itemName || ''}
                                            onChange={(e) => {
                                                handleInputChange(e, index);
                                            }}
                                        />
                                        {itemList.length > 0 && (
                                            <datalist id={`browsers-${index}`}>
                                                {itemList.map((row, idx) => (
                                                    <option key={idx} value={row.name}>
                                                        {row.name}
                                                    </option>
                                                ))}
                                            </datalist>
                                        )}
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid #2878b6'
                                            }}
                                            name="quantity"
                                            type="number"
                                            value={row.quantity || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid #2878b6'
                                            }}
                                            type="number"
                                            name="rate"
                                            value={row.rate || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <input
                                            style={{
                                                width: '80%',
                                                height: '30px',
                                                borderRadius: '4px',
                                                border: '1px solid #2878b6'
                                            }}
                                            name="total"
                                            type="number"
                                            value={row.total || BLANK}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </TableCell>
                                    <TableCell style={{ padding: '2px' }}>
                                        <Button onClick={handleAddRow} color="success" style={{ fontWeight: 'bolder' }}>
                                            {selectedRowIndex !== null ? 'Update' : 'Add'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <div
                                        style={{
                                            width: '110px'
                                        }}
                                    >
                                        <span style={{ fontWeight: 'bolder' }}>Total</span>
                                    </div>
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell>{total || 0}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '10px' }}>
                <Grid container justifyContent="center" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button type="button" variant="outlined" onClick={printTable}>
                            Print
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReceiptForm;
