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
        return { bg: '#E6F9F0', color: '#06C167', border: '#A3E9C5' };
      case 'Preparing':
      case 'Occupied':
      case 'In-Progress':
      case 'Medium':
        return { bg: '#000000', color: '#FFFFFF', border: '#000000' };
      case 'Pending':
      case 'Reserved':
      case 'New':
      case 'Low':
        return { bg: '#FEEBC8', color: '#C05621', border: '#FBD38D' };
      case 'Cancelled':
      case 'Difference':
      case 'Inactive':
      case 'Paused':
        return { bg: '#FED7D7', color: '#E53E3E', border: '#FEB2B2' };
      default:
        return { bg: '#F6F6F6', color: '#545454', border: '#EEEEEE' };
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
        borderRadius: 9999, // Uber Eats Pill Shape
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
