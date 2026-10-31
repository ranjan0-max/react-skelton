import React from 'react';
import { Alert, Autocomplete, TextField } from '@mui/material';

const SmartAutocomplete = ({
    options = [],
    getOptionLabel = (opt) => (typeof opt === 'string' ? opt : opt.label || ''),
    filterOptions,
    inputValue,
    setInputValue,
    label = 'Search',
    placeholder = 'Type here',
    error,
    helperText,
    onEnter,
    renderOption,
    maxInputLength = 100,
    fontFamily = 'inherit',
    onSelectOption
}) => {
    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label style={{ fontFamily, marginBottom: 6, display: 'block' }}>
                    {label}
                </label>
            )}

            <Autocomplete
                freeSolo
                options={options}
                getOptionLabel={getOptionLabel}
                filterOptions={
                    filterOptions ||
                    ((opts, { inputValue: value }) =>
                        opts.filter((o) => getOptionLabel(o).toLowerCase().includes((value || '').toLowerCase())))
                }
                inputValue={inputValue || ''}
                onInputChange={(event, value, reason) => {
                    if (reason === 'input' && value.length <= maxInputLength) {
                        setInputValue(value?.split('-')?.[0]?.trim());
                    }
                }}
                onChange={(event, selectedOption) => {
                    if (!selectedOption || typeof selectedOption === 'string') return;
                    const result = onSelectOption?.(selectedOption);
                    if (result !== undefined) setInputValue(result);
                }}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <li key={key} {...optionProps}>
                            {renderOption ? renderOption(option) : <span style={{ fontFamily }}>{getOptionLabel(option)}</span>}
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onEnter?.(inputValue);
                            }
                        }}
                        sx={{ '& .MuiInputBase-input': { fontFamily } }}
                    />
                )}
            />

            {error && (
                <Alert severity="error" variant="outlined" sx={{ mt: 1, fontFamily, p: 1 }}>
                    {helperText}
                </Alert>
            )}
        </div>
    );
};

export default SmartAutocomplete;
