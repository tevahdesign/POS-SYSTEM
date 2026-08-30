import React from 'react';
import { Box, Typography } from '@mui/material';

interface OrderSummaryRowProps {
  label: string;
  value: string | number;
  isBold?: boolean;
  isHighlight?: boolean;
  color?: string;
}

export const OrderSummaryRow: React.FC<OrderSummaryRowProps> = ({
  label,
  value,
  isBold = false,
  isHighlight = false,
  color,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 0.5,
      }}
    >
      <Typography
        variant={isBold ? 'subtitle1' : 'body2'}
        sx={{
          fontWeight: isBold ? 700 : 500,
          color: color || (isHighlight ? 'primary.main' : 'text.secondary'),
        }}
      >
        {label}
      </Typography>
      <Typography
        variant={isBold ? 'h6' : 'body2'}
        sx={{
          fontWeight: isBold ? 700 : 600,
          color: color || (isBold ? 'text.primary' : 'text.primary'),
        }}
      >
        {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
      </Typography>
    </Box>
  );
};
