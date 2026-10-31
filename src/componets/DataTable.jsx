import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import theme from './Theme';

const SEARCH_DELAY_MS = 500;
const CUSTOM_DATE = 'CUSTOM';

/**
 * server side table: parent fetches rows, this only shows them + tells parent about page / search / filter
 * @param headers [{ id, label, align, render?(row), type?: 'select', options?: [{ id, name }] }]
 * @param actions [{ title, icon, handler(row), color? }] or switch [{ title, isSwitch: true, property, handler(row) }]
 * @param filterFields [{ name, label, options: [{ id, name }], acccess }] -> name 'closedDate' + CUSTOM shows date range
 * @param handlePageChange (pageIndex starting 0, rowsPerPage)
 * @param handleSearchAndFilter (searchTerm, filters)
 */
const DataTable = ({
    headers = [],
    data = [],
    actions = [],
    tableTitle,
    addButton,
    totalRows = 0,
    handlePageChange,
    handleSearchAndFilter,
    searchTerm = '',
    filterFields = [],
    statusColors,
    fontFamily
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState(searchTerm);
    const [filters, setFilters] = useState({});
    const searchTimer = useRef(null);

    const visibleFilters = filterFields.filter((field) => field.acccess !== false);
    const hasActions = actions.length > 0;

    useEffect(() => () => clearTimeout(searchTimer.current), []);

    const applySearchAndFilter = (newSearch, newFilters) => {
        setPage(0);
        handleSearchAndFilter?.(newSearch, newFilters);
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);

        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => applySearchAndFilter(value, filters), SEARCH_DELAY_MS);
    };

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };

        if (name === 'closedDate' && value !== CUSTOM_DATE) {
            delete newFilters.startDate;
            delete newFilters.endDate;
        }

        setFilters(newFilters);

        //? custom date range -> wait until both dates are picked
        const waitingForDates = newFilters.closedDate === CUSTOM_DATE && (!newFilters.startDate || !newFilters.endDate);
        if (!waitingForDates) applySearchAndFilter(search, newFilters);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        handlePageChange?.(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        handlePageChange?.(0, newRowsPerPage);
    };

    const renderCell = (header, row) => {
        if (header.render) return header.render(row);

        const value = row?.[header.id];

        if (header.type === 'select' && header.options) {
            return header.options.find((option) => option.id === value)?.name ?? value;
        }

        if (header.id === 'status' && statusColors && value) {
            return <Chip size="small" label={value} sx={{ bgcolor: statusColors[value] || '#e0e0e0', color: 'white' }} />;
        }

        return value ?? '-';
    };

    const headCellSx = {
        fontWeight: 'bolder',
        fontFamily,
        background: theme.palette.primary.main,
        color: theme.typography.primaryTextColor.color
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', border: '2px solid #e5e5e5', mt: '1%' }}>
            {/* title + search + filters + add */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                useFlexGap
                sx={{ p: 2, alignItems: { md: 'center' }, justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
                <Typography sx={{ fontFamily, fontSize: 22, fontWeight: 600, color: theme.typography.themeColor.color }}>
                    {tableTitle}
                </Typography>

                <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                    {handleSearchAndFilter && (
                        <TextField
                            placeholder="Search"
                            size="small"
                            value={search}
                            onChange={handleSearch}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{ minWidth: 220, '& .MuiInputBase-input': { fontFamily } }}
                        />
                    )}

                    {visibleFilters.map((field) => (
                        <TextField
                            key={field.name}
                            select
                            size="small"
                            label={field.label}
                            value={filters[field.name] ?? ''}
                            onChange={(event) => handleFilterChange(field.name, event.target.value)}
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {field.options?.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    ))}

                    {filters.closedDate === CUSTOM_DATE && (
                        <>
                            <TextField
                                type="date"
                                size="small"
                                label="Start Date"
                                value={filters.startDate || ''}
                                onChange={(event) => handleFilterChange('startDate', event.target.value)}
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <TextField
                                type="date"
                                size="small"
                                label="End Date"
                                value={filters.endDate || ''}
                                onChange={(event) => handleFilterChange('endDate', event.target.value)}
                                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: filters.startDate } }}
                            />
                        </>
                    )}

                    {addButton && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addButton}
                            sx={{ fontFamily, fontWeight: 'bold', backgroundColor: theme.palette.primary.main }}
                        >
                            Add
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* table */}
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell key={header.id} align={header.align || 'left'} sx={headCellSx}>
                                    {header.label}
                                </TableCell>
                            ))}
                            {hasActions && (
                                <TableCell align="center" sx={headCellSx}>
                                    ACTION
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headers.length + (hasActions ? 1 : 0)} align="center" sx={{ py: 3 }}>
                                    <Typography sx={{ color: 'text.secondary', fontFamily }}>No data available</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow
                                    hover
                                    key={row.id ?? index}
                                    sx={{ backgroundColor: index % 2 === 0 ? theme.palette.customBackground.default : '#ffffff' }}
                                >
                                    {headers.map((header) => (
                                        <TableCell key={header.id} align={header.align || 'left'} sx={{ fontFamily, whiteSpace: 'nowrap' }}>
                                            {renderCell(header, row)}
                                        </TableCell>
                                    ))}

                                    {hasActions && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
                                                {actions.map((action, actionIndex) =>
                                                    action.isSwitch ? (
                                                        <Tooltip key={actionIndex} title={action.title}>
                                                            <Switch
                                                                size="small"
                                                                checked={Boolean(row[action.property])}
                                                                onChange={() => action.handler(row)}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip key={actionIndex} title={action.title}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => action.handler(row)}
                                                                sx={{ color: action.color || theme.palette.primary.main }}
                                                            >
                                                                {action.icon}
                                                            </IconButton>
                                                        </Tooltip>
                                                    )
                                                )}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 50]}
                count={totalRows || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: '2px solid #f0f0f0' }}
            />
        </Paper>
    );
};

DataTable.propTypes = {
    headers: PropTypes.array.isRequired,
    data: PropTypes.array,
    actions: PropTypes.array,
    tableTitle: PropTypes.node,
    addButton: PropTypes.func,
    totalRows: PropTypes.number,
    handlePageChange: PropTypes.func,
    handleSearchAndFilter: PropTypes.func,
    searchTerm: PropTypes.string,
    filterFields: PropTypes.array,
    statusColors: PropTypes.object,
    fontFamily: PropTypes.string
};

export default DataTable;
