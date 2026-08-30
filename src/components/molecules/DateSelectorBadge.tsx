import React from 'react';
import { Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DateSelectorBadgeProps {
  dateString?: string;
  onClick?: () => void;
}

export const DateSelectorBadge: React.FC<DateSelectorBadgeProps> = ({
  dateString = 'Today, 15 Jun 2026',
  onClick,
}) => {
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={onClick}
      startIcon={<CalendarTodayIcon sx={{ fontSize: '16px !important', color: 'primary.main' }} />}
      endIcon={<KeyboardArrowDownIcon sx={{ fontSize: '16px !important', color: 'text.secondary' }} />}
      sx={{
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        color: 'text.primary',
        fontSize: '0.8125rem',
        fontWeight: 600,
        textTransform: 'none',
        display: { xs: 'none', md: 'inline-flex' },
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: '#FFF7ED',
        },
      }}
    >
      {dateString}
    </Button>
  );
};
