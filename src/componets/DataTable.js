import React, { useState, useEffect } from 'react';
import {
    Table,
    Input,
    InputGroup,
    Button,
    Tooltip,
    FlexboxGrid,
    DateRangePicker,
    SelectPicker,
    IconButton,
    ButtonGroup,
    Whisper,
    Toggle
} from 'rsuite';
import { useSearchParams } from "react-router-dom";
import MainCard from 'componets/MainCard';
import theme from '../componets/Theme';
import SearchIcon from '@rsuite/icons/Search';

const { Column, HeaderCell, Cell } = Table;

const DataTable = ({
    data,
    headers,
    tableTitle,
    addButton,
    actions,
    fileUpload,
    fontFamily,
    totalRows,
    filterFields,
    handlePageChange,
    searchTerm,
    handleSearchAndFilter,
    statusColors
}) => {

    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(headers?.[0]?.id);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState(
        filterFields
            ?.filter((field) => field.acccess)
            ?.reduce((acc, field) => {
                acc[field.name] = field.defaultValue ?? '';
                return acc;
            }, {}) || {}
    );

    // search
    const handleSearch = (value) => {
        setPage(0);
        handleSearchAndFilter(value || '', filters);
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

    const handleChangePage = (pageNumber) => {
        const zeroBasedPage = pageNumber - 1;
        setPage(zeroBasedPage);
        handlePageChange(zeroBasedPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (value) => {
        const newLimit = parseInt(value, 10);
        setRowsPerPage(newLimit);
        setPage(0);
        handlePageChange(0, newLimit);
    };

    const sortedRows = stableSort(rows || [], getComparator(order, orderBy));

    useEffect(() => {
        if (data?.length) {
            setRows(data);
        } else {
            setRows([]);
        }
    }, [data]);

    useEffect(() => {
        handleSearchAndFilter(searchTerm, filters);
    }, [filters]);

    useEffect(() => {
        const urlStatus = searchParams.get("status")
        const urlRaisedToCreatedBy = searchParams.get("raiseToCreatedByList")
        if (!urlStatus && !urlRaisedToCreatedBy) {
            return;
        }
        setFilters((prev) => ({
            ...prev,
            status: urlStatus === "all" ? "" : urlStatus ?? '',
            raisedToCreatedBy: urlRaisedToCreatedBy ?? ''
        }));
        setSearchParams({})
    }, [searchParams]);

    const renderActions = (rowData) => (
        <ButtonGroup size="xs">
            {actions.map((action, actionIndex) => {
                if (typeof action.visible === 'function' && !action.visible(rowData)) {
                    return null;
                }

                return (
                    <Whisper
                        key={actionIndex}
                        placement="top"
                        trigger="hover"
                        speaker={<Tooltip>{action.title}</Tooltip>}
                    >
                        {action.property && action.isSwitch ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '28px',
                                    minWidth: '42px'
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Toggle
                                    checked={rowData[action.property]}
                                    onChange={() => action.handler(rowData)}
                                    size="sm"
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                    style={{
                                        color: action.color || theme.palette.primary.main,
                                    }}
                                />
                            </div>
                        ) : (
                            <IconButton
                                icon={action.icon}
                                onClick={() => action.handler(rowData)}
                                size="sm"
                                appearance="subtle"
                                style={{
                                    color: action.color || theme.palette.primary.main,
                                    minWidth: '42px',
                                }}
                            />
                        )}
                    </Whisper>
                );
            })}
        </ButtonGroup>
    );

    return (
        <MainCard
            border={true}
            title={
                <div style={{ color: theme.typography.themeColor.color, fontWeight: 'bold', fontFamily, fontSize: '40px' }}>
                    {tableTitle}
                </div>
            }
        >

            {/* Search and Filters */}
            <div style={{ padding: '16px 0px', width: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {/* Search box  */}
                    <div style={{ flex: '0 1 300px', maxWidth: 300 }}>
                        <InputGroup style={{ width: '100%' }}>
                            <InputGroup.Addon>
                                <SearchIcon />
                            </InputGroup.Addon>
                            <Input
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ fontFamily }}
                            />
                        </InputGroup>
                    </div>

                    {/* Filters */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginLeft: 'auto',
                            alignItems: 'center',
                        }}
                    >
                        {/* Filters */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {filterFields &&
                                filterFields.length > 0 &&
                                filterFields
                                    .filter((field) => field.acccess)
                                    .map((field) => (
                                        <div key={field.name} style={{ flex: '0 0 auto' }}>
                                            <SelectPicker
                                                data={[{ label: `All ${field.label}'s`, value: '' }, ...field.options.map((opt) => ({ label: opt.name, value: opt.id }))]}
                                                placeholder={`All ${field.label}s`}
                                                value={filters[field.name]}
                                                onChange={(value) => {
                                                    setFilters((prev) => ({ ...prev, [field.name]: value }));
                                                }}
                                                style={{ width: 150, fontFamily }}
                                                cleanable={false}
                                                searchable={field.name !== 'raisedToCreatedBy'} />
                                            {field.name === "closedDate" && filters.closedDate === "CUSTOM" && (
                                                <div style={{ marginTop: 8 }}>
                                                    <DateRangePicker
                                                        format="dd-MM-yyyy"
                                                        placeholder="Select Date Range"
                                                        onChange={(range) => {
                                                            if (range) {
                                                                setFilters(prev => ({
                                                                    ...prev,
                                                                    startDate: range[0]?.toLocaleDateString("en-CA"),
                                                                    endDate: range[1]?.toLocaleDateString("en-CA")
                                                                }));
                                                            } else {
                                                                setFilters(prev => ({
                                                                    ...prev,
                                                                    startDate: "",
                                                                    endDate: ""
                                                                }));
                                                            }
                                                        }}
                                                        value={
                                                            filters.startDate && filters.endDate
                                                                ? [new Date(filters.startDate), new Date(filters.endDate)]
                                                                : null
                                                        }
                                                        style={{ width: 180 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                            }
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {addButton && (
                                <Button
                                    appearance="primary"
                                    onClick={addButton}
                                    style={{
                                        width: 100,
                                        backgroundColor: theme.palette.primary.main,
                                        color: 'white',
                                    }}
                                >
                                    Add
                                </Button>
                            )}
                            {fileUpload && (
                                <Button appearance="primary" onClick={fileUpload}>
                                    Upload Excel
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            <div style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'auto', width: '100%' }}>
                <Table
                    height={450}
                    data={sortedRows}
                    style={{ fontFamily, width: '100%' }}
                    sortColumn={orderBy}
                    sortType={order}
                    onSortColumn={(sortColumn, sortType) => {
                        const isAsc = orderBy === sortColumn && order === 'asc';
                        handleRequestSort(null, sortColumn, isAsc ? 'desc' : 'asc');
                    }}
                >
                    {headers.map((header) => (
                        <Column
                            key={header.id}
                            flexGrow={1}
                            minWidth={150}
                            align={header.align || 'left'}
                            sortable
                            fixed="top"
                        >
                            <HeaderCell
                                style={{
                                    backgroundColor: theme.palette.secondary.main,
                                    fontWeight: 'bolder',
                                    fontFamily,
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontSize: '14px',
                                }}
                            >
                                {header.label}
                            </HeaderCell>
                            <Cell
                                dataKey={header.id}
                                style={{ padding: '10px 16px', fontSize: '14px', fontWeight: 500 }}
                            >
                                {(rowData) =>
                                    header.render
                                        ? header.render(rowData, statusColors)
                                        : rowData[header.id]
                                }
                            </Cell>
                        </Column>
                    ))}

                    {actions && actions.length > 0 && (
                        <Column width={200} align="center" >
                            <HeaderCell
                                style={{
                                    backgroundColor: theme.palette.secondary.main,
                                    color: 'white',
                                    fontWeight: 'bolder',
                                    fontFamily,
                                    paddingRight: 24,
                                }}
                            >
                                ACTION
                            </HeaderCell>
                            <Cell
                                style={{
                                    padding: '10px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {(rowData) => renderActions(rowData)}
                            </Cell>
                        </Column>
                    )}
                </Table>

            </div>

            {/* Pagination */}
            <div style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ fontFamily, fontSize: '14px', color: '#666' }}>
                    Showing {(page * rowsPerPage) + 1}-{(page + 1) * rowsPerPage > totalRows
                        ? totalRows
                        : (page + 1) * rowsPerPage} of {totalRows} entries
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontFamily, fontSize: '14px', color: '#666' }}>Rows per page:</span>
                    <SelectPicker
                        data={[
                            { label: '10', value: '10' },
                            { label: '20', value: '20' },
                            { label: '30', value: '30' }
                        ]}
                        value={rowsPerPage.toString()}
                        onChange={handleChangeRowsPerPage}
                        style={{ width: 80, fontFamily }}
                        cleanable={false}
                        searchable={false}
                    />
                    <ButtonGroup>
                        <Button
                            appearance="subtle"
                            onClick={() => handleChangePage(page)}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>

                        <Button
                            appearance="subtle"
                            onClick={() => handleChangePage(page + 2)}
                            disabled={(page + 1) * rowsPerPage >= totalRows}
                        >
                            Next
                        </Button>
                    </ButtonGroup>

                </div>
            </div>
        </MainCard>
    );
};

export default DataTable;