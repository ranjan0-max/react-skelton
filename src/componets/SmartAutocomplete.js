import React from 'react';
import { AutoComplete, Message } from 'rsuite';

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

            <AutoComplete
                data={options.map((o) => getOptionLabel(o))}
                value={inputValue}
                placeholder={placeholder}
                style={{ width: '100%', fontFamily }}
                filterBy={
                    filterOptions
                        ? (value, item) => filterOptions(options, { inputValue: value })
                        : (value, item) =>
                            item.toLowerCase().includes(value.toLowerCase())
                }
                onChange={(value) => {
                    if (value.length <= maxInputLength) {
                        value = value?.split('-')?.[0]?.trim();
                        setInputValue(value);
                    }
                }}
                onSelect={(value) => {
                    const selectedOption = options.find(
                        (o) => getOptionLabel(o) === value
                    );
                    const result = onSelectOption?.(selectedOption);
                    if (result !== undefined) setInputValue(result);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter?.(inputValue);
                    }
                }}
                renderMenuItem={(label, item) =>
                    renderOption ? (
                        renderOption(item)
                    ) : (
                        <span style={{ fontFamily }}>{label}</span>
                    )
                }
            />

            {error && (
                <Message
                    type="error"
                    bordered
                    style={{ marginTop: 8, fontFamily, padding: 8 }}
                >
                    {helperText}
                </Message>
            )}
        </div>
    );
};

export default SmartAutocomplete;
