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
              <SearchIcon sx={{ color: '#6366F1', fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')} edge="end" sx={{ color: '#64748B' }}>
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#FFFFFF',
          borderRadius: 9999, // Yoko Pill Shape
          color: '#0F172A',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
            borderColor: '#6366F1',
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};
