import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

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
  icon,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        height: 'auto', // Content-fit dynamic height
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
        <Typography variant="subtitle2" sx={{ color: '#545454', fontWeight: 600, fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: '#06C167',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 9999, // Uber Eats Pill
              backgroundColor: '#E6F9F0',
              border: '1px solid #A3E9C5',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, color: '#000000', letterSpacing: '-0.02em', mt: 0.25, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </Typography>
    </Paper>
  );
};
