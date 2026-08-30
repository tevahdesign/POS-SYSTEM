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
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: 'rgba(99, 102, 241, 0.4)',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.8125rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: '#4338CA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 9999, // Yoko Pill
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', my: 0.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
        <MetricBadge change={change} isPositive={isPositive} />
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
