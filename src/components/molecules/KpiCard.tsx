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
        p: { xs: 1.5, sm: 1.75 },
        borderRadius: '16px',
        backgroundColor: '#000000', // Uber Eats Black Theme
        border: '1px solid #1C1C1C',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        height: 'auto', // Content-fit dynamic height
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: '#06C167',
          boxShadow: '0 4px 16px rgba(6, 193, 103, 0.25)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#AFAFAF', fontWeight: 600, fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', mt: 0.25, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </Typography>
    </Paper>
  );
};
