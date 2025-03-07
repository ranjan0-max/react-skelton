import {
    Box,
    Button,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    // Checkbox,
    // headCells,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// icon
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

// custom component
import MainCard from './cards/MainCard';

const CustomDataTable = ({ data, headers, tableTitle, addButton, actions }) => {
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
            border
            sx={{
                borderRadius: 3,
                boxShadow: 4,
                overflow: 'hidden',
                backgroundColor: '#fdfdfd'
            }}
            title={
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        letterSpacing: '0.75px',
                        textTransform: 'capitalize',
                        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    {tableTitle}
                </Typography>
            }
            secondary={
                <Stack direction="row" spacing={2} alignItems="center">
                    {addButton && (
                        <Button
                            variant="contained"
                            onClick={addButton}
                            sx={{
                                fontWeight: 'bold',
                                textTransform: 'none',
                                background: 'linear-gradient(to right,#4facfe,#4facfe)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(to right, #4facfe, #4facfe)'
                                }
                            }}
                        >
                            Add
                        </Button>
                    )}
                </Stack>
            }
        >
            <CardContent sx={{ p: 2, borderBottom: '2px solid #f0f0f0' }}>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                        <TextField
                            placeholder="Search"
                            value={search}
                            onChange={handleSearch}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" sx={{ color: '#4facfe' }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                width: '100%',
                                backgroundColor: '#f5f7ff',
                                borderRadius: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '& fieldset': { border: '1px solid #ddd' },
                                    '&:hover fieldset': { borderColor: '#4facfe' },
                                    '&.Mui-focused fieldset': { borderColor: '#4facfe' }
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 700,
                    borderRadius: 0,
                    borderTop: '2px solid #f0f0f0'
                }}
            >
                <Table stickyHeader sx={{ minWidth: 750 }}>
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
                                <TableCell colSpan={headers.length + 1} align="center" sx={{ py: 3 }}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        No data available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#f0f9ff' : '#ffffff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                                                cursor: 'pointer'
                                            },
                                            transition: 'background-color 0.3s ease'
                                        }}
                                    >
                                        {headers.map((header) => (
                                            <TableCell
                                                key={header.id}
                                                align={header.align}
                                                sx={{
                                                    padding: '10px 16px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    color: header.id === 'jobNumber' ? '#ff4b2b' : 'text.primary',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {row[header.id]}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ padding: '10px 16px' }}>
                                            {actions?.map((action, actionIndex) => (
                                                <Tooltip key={actionIndex} title={action.title}>
                                                    <Button
                                                        onClick={() => action.handler(row)}
                                                        sx={{
                                                            minWidth: 32,
                                                            color: actionIndex % 2 === 0 ? '#ff4b2b' : '#4facfe',
                                                            '&:hover': {
                                                                backgroundColor: 'transparent',
                                                                color: actionIndex % 2 === 0 ? '#d50000' : '#1976d2'
                                                            }
                                                        }}
                                                    >
                                                        {action.icon}
                                                    </Button>
                                                </Tooltip>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))
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
                sx={{
                    borderTop: '2px solid #f0f0f0',
                    '& .MuiTablePagination-toolbar': {
                        px: 2,
                        py: 1,
                        fontSize: '0.875rem'
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontSize: '0.875rem'
                    }
                }}
            />
        </MainCard>
    );
};

export default CustomDataTable;
