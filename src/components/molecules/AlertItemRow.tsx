import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface AlertItemRowProps {
  title: string;
  subtitle: string;
  time: string;
  severity?: 'low' | 'medium' | 'high';
}

export const AlertItemRow: React.FC<AlertItemRowProps> = ({ title, subtitle, time, severity = 'medium' }) => {
  const getIconColor = () => {
    if (severity === 'high') return 'error.main';
    if (severity === 'medium') return 'warning.main';
    return 'info.main';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.25,
        borderRadius: 2,
        backgroundColor: '#F8FAFC',
        border: '1px solid #F1F5F9',
      }}
    >
      <WarningAmberIcon sx={{ color: getIconColor(), fontSize: 20, mt: 0.25 }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
          {subtitle} • {time}
        </Typography>
      </Box>
    </Box>
  );
};
