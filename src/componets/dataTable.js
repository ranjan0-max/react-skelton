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
    Tooltip
} from '@mui/material';

// icon
import SearchIcon from '@mui/icons-material/Search';

// custom component
import MainCard from 'componets/MainCard';

const EnhancedDataTable = ({ data, headers, tableTitle, addButton, actions }) => {
    const [rows, setRows] = useState(data);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('jobNumber');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [searchKeys, setSearchKeys] = useState([]);

    // search=
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

    React.useEffect(() => {
        const searchKeys = headers.map((head) => head.id);
        setSearchKeys(searchKeys);
    }, [headers]);

    return (
        <MainCard
            title={
                <Typography variant="h5" color="primary">
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
                            placeholder="Search Job"
                            value={search}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
                <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell key={header.id} align={header.align}>
                                    <Typography
                                        variant="subtitle"
                                        onClick={(event) => handleRequestSort(event, header.id)}
                                        align="center"
                                        style={{ cursor: 'pointer', fontWeight: 'bolder', textTransform: 'uppercase' }}
                                    >
                                        {header.label}
                                    </Typography>
                                </TableCell>
                            ))}
                            {actions.length ? (
                                <TableCell align="center">
                                    <Typography
                                        variant="subtitle"
                                        align="center"
                                        style={{ cursor: 'pointer', fontWeight: 'bolder', textTransform: 'uppercase' }}
                                    >
                                        Actions
                                    </Typography>
                                </TableCell>
                            ) : (
                                ''
                            )}
                        </TableRow>
                    </TableHead>
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
                                .map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        {headers.map((header) => (
                                            <TableCell key={header.id} align={header.align}>
                                                <Typography variant="subtitle1" color={header.id === 'jobNumber' ? 'secondary' : 'inherit'}>
                                                    {row[header.id]}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
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
            />
        </MainCard>
    );
};

export default EnhancedDataTable;
