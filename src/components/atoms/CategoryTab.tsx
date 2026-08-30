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
        borderRadius: 9999, // Yoko Space Pill
        px: 2.5,
        py: 0.9,
        fontSize: '0.8125rem',
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: active ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#64748B',
        borderColor: active ? 'transparent' : '#E2E8F0',
        boxShadow: active ? '0 4px 14px rgba(99, 102, 241, 0.3)' : '0 1px 3px rgba(15, 23, 42, 0.04)',
        whiteSpace: 'nowrap',
        textTransform: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: active ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#EEF2FF',
          borderColor: active ? 'transparent' : 'rgba(99, 102, 241, 0.4)',
          color: active ? '#FFFFFF' : '#4338CA',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {label} {count !== undefined && `(${count})`}
    </Button>
  );
};
