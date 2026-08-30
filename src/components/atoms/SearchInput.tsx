import React from 'react';
import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
  size = 'small',
  sx,
  ...props
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#06C167', fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')} edge="end" sx={{ color: '#545454' }}>
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: 9999, // Uber Eats Pill Shape
          color: '#000000',
          border: '1px solid #EEEEEE',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'rgba(6, 193, 103, 0.5)',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(6, 193, 103, 0.15)',
            borderColor: '#06C167',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};
