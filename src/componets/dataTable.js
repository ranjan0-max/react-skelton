import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Paper,
    CardContent,
    Grid,
    TextField,
    InputAdornment,
    Stack,
    Button,
    Tooltip,
    // Checkbox,
    // headCells,
    TableSortLabel,
    Box,
    Toolbar,
    IconButton
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// icon
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

// custom component
import MainCard from 'componets/MainCard';

const EnhancedDataTable = ({ data, headers, tableTitle, addButton, actions }) => {
    const [rows, setRows] = useState(data);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(headers?.[0]?.id);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [searchKeys, setSearchKeys] = useState([]);
    const [selected, setSelected] = React.useState([]);

    // headers
    function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, selected }) {
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts'
                            }}
                        />
                    </TableCell> */}
                    {numSelected > 0 && (
                        <TableCell padding="none" colSpan={6}>
                            <EnhancedTableToolbar numSelected={selected.length} />
                        </TableCell>
                    )}
                    {numSelected <= 0 &&
                        headers.map((headers) => (
                            <TableCell
                                key={headers.id}
                                align={headers.align}
                                padding={headers.disablePadding ? 'none' : 'normal'}
                                sortDirection={orderBy === headers.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headers.id}
                                    direction={orderBy === headers.id ? order : 'asc'}
                                    onClick={createSortHandler(headers.id)}
                                    style={{ fontWeight: 'bolder' }}
                                >
                                    {headers.label}
                                    {orderBy === headers.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    {numSelected <= 0 && (
                        <TableCell sortDirection={false} align="center" sx={{ pr: 3, fontWeight: 'bolder' }}>
                            Action
                        </TableCell>
                    )}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        selected: PropTypes.array,
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired
    };

    // ==============================|| TABLE HEADER TOOLBAR ||============================== //

    const EnhancedTableToolbar = ({ numSelected }) => (
        <Toolbar
            sx={{
                p: 0,
                pl: 1,
                pr: 1,
                ...(numSelected > 0 && {
                    color: (theme) => theme.palette.secondary.main
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography color="inherit" variant="h4">
                    {numSelected} Selected
                </Typography>
            ) : (
                <Typography variant="h6" id="tableTitle">
                    Nutrition
                </Typography>
            )}
            <Box sx={{ flexGrow: 1 }} />
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton size="large">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );

    // search
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = data.filter((row) => {
                let matches = true;

                const properties = searchKeys;
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            setRows(newRows);
        } else {
            setRows(data);
        }
    };

    // Sorting Functions
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const getComparator = (order, orderBy) =>
        order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // select

    // const handleClick = (event, name) => {
    //     console.log(selected);
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];

    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    //     }

    //     setSelected(newSelected);
    // };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n._id);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    // const isSelected = (name) => selected.indexOf(name) !== -1;

    React.useEffect(() => {
        const searchKeys = headers.map((head) => head.id);
        setSearchKeys(searchKeys);
    }, [headers]);

    return (
        <MainCard
            border={true}
            title={
                <Typography variant="h5" color="primary" style={{ fontWeight: 'bolder' }}>
                    {tableTitle}
                </Typography>
            }
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    {addButton && (
                        <Button color="primary" variant="contained" onClick={addButton}>
                            Add
                        </Button>
                    )}
                </Stack>
            }
        >
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder="Search"
                            value={search}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
                <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        selected={selected}
                    />
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headers.length + 1} align="center">
                                    <Typography variant="subtitle1">NO DATA AVAILABLE IN TABLE</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    // const isItemSelected = isSelected(row?._id);
                                    // const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {/* <TableCell
                                                padding="checkbox"
                                                sx={{ pl: 3, padding: '3px' }}
                                                onClick={(event) => handleClick(event, row._id)}
                                                align="center"
                                            >
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell> */}
                                            {headers.map((header) => (
                                                <TableCell key={header.id} align={header.align} sx={{ padding: '4px' }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        color={header.id === 'jobNumber' ? 'secondary' : 'inherit'}
                                                    >
                                                        {row[header.id]}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                            <TableCell align="center" sx={{ padding: '4px' }}>
                                                {actions &&
                                                    actions.map((action, index) => (
                                                        <Tooltip key={index} title={action.title}>
                                                            <Button key={index} onClick={() => action.handler(row)}>
                                                                {action.icon}
                                                            </Button>
                                                        </Tooltip>
                                                    ))}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};

export default EnhancedDataTable;
