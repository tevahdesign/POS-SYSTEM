import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { MetricBadge } from '../atoms/MetricBadge';

export interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs previous period',
  icon,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'rgba(6, 193, 103, 0.5)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: '#545454', fontWeight: 600, fontSize: '0.8125rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: '#06C167',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 9999, // Uber Eats Pill
              backgroundColor: '#E6F9F0',
              border: '1px solid #A3E9C5',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000', letterSpacing: '-0.025em', my: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
        <MetricBadge change={change} isPositive={isPositive} />
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#8E8E8E', fontWeight: 500, fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
