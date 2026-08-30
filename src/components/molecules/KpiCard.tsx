import React from 'react';
import { Paper, Typography } from '@mui/material';

export interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 1.75, sm: 2.25 },
        borderRadius: '16px',
        backgroundColor: '#000000', // Solid Uber Jet Black
        border: '1px solid #1C1C1C',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        height: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#06C167',
          boxShadow: '0 4px 16px rgba(6, 193, 103, 0.2)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: '#AFAFAF', // Solid neutral gray
          fontWeight: 600,
          fontSize: '0.75rem',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: '#FFFFFF', // Solid bold white text
          letterSpacing: '-0.02em',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
};
