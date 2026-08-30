import React from 'react';
import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface MetricBadgeProps {
  change: number | string;
  isPositive?: boolean;
  trendText?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ change, isPositive = true, trendText }) => {
  const isUp = isPositive && Number(change) >= 0;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: 1.5,
        backgroundColor: isUp ? '#ECFDF5' : '#FEE2E2',
        color: isUp ? '#047857' : '#B91C1C',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
    >
      {isUp ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
      <span>{typeof change === 'number' ? `${isUp ? '+' : ''}${change}%` : change}</span>
      {trendText && (
        <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 500 }}>
          {trendText}
        </Typography>
      )}
    </Box>
  );
};
