import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type StatusType =
  | 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled' | 'Paused'
  | 'Available' | 'Occupied' | 'Reserved'
  | 'New' | 'In-Progress'
  | 'Good' | 'Medium' | 'Low'
  | 'Matched' | 'Difference'
  | 'Active' | 'Inactive';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusType | string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small', sx, ...props }) => {
  const getColors = (val: string) => {
    switch (val) {
      case 'Completed':
      case 'Available':
      case 'Good':
      case 'Matched':
      case 'Active':
      case 'Ready':
        return { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
      case 'Preparing':
      case 'Occupied':
      case 'In-Progress':
      case 'Medium':
        return { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' };
      case 'Pending':
      case 'Reserved':
      case 'New':
      case 'Low':
        return { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'Cancelled':
      case 'Difference':
      case 'Inactive':
      case 'Paused':
        return { bg: '#FEE2E2', color: '#B91C1C', border: '#FECACA' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    }
  };

  const { bg, color, border } = getColors(status);

  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontWeight: 700,
        borderRadius: 9999, // Yoko Pill Shape
        fontSize: size === 'small' ? '0.72rem' : '0.78rem',
        height: size === 'small' ? 24 : 28,
        letterSpacing: '0.01em',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...sx,
      }}
      {...props}
    />
  );
};
