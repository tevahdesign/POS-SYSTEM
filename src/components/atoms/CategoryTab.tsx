import React from 'react';
import { Button } from '@mui/material';

interface CategoryTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  icon?: React.ReactNode;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({ label, active, onClick, count, icon }) => {
  return (
    <Button
      onClick={onClick}
      variant={active ? 'contained' : 'outlined'}
      startIcon={icon}
      sx={{
        borderRadius: 9999, // Uber Eats Pill
        px: 2.5,
        py: 0.9,
        fontSize: '0.8125rem',
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: active ? '#000000' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#000000',
        borderColor: active ? 'transparent' : '#EEEEEE',
        boxShadow: active ? '0 4px 14px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        whiteSpace: 'nowrap',
        textTransform: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: active ? '#242424' : '#E6F9F0',
          borderColor: active ? 'transparent' : '#06C167',
          color: active ? '#FFFFFF' : '#06C167',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {label} {count !== undefined && `(${count})`}
    </Button>
  );
};
