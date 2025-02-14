import React, { useState, useEffect } from 'react';
import { Searchbar } from 'react-native-paper';
import { debounce } from 'lodash';

type FilterInputProps = {
    onChange: (value: string) => void;
    placeholder: string;
};

const FilterInput: React.FC<FilterInputProps> = ({ onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState<string>('');

    // Debounce para otimizar o desempenho e evitar chamadas excessivas
    const handleChange = debounce((value: string) => {
        onChange(value);
    }, 500);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        handleChange(value);
    };

    return (
        <Searchbar
            placeholder={placeholder}
            value={inputValue}
            onChangeText={handleInputChange}
            onIconPress={() => setInputValue('')}
            onClearIconPress={() => handleInputChange('')}
        />
    );
};

export default FilterInput;
