import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Popover,
  Button,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { usePosStore } from '../../store/posStore';
import { DateSelectorBadge } from '../molecules/DateSelectorBadge';
import { UserAvatarBadge } from '../molecules/UserAvatarBadge';
import { AlertItemRow } from '../molecules/AlertItemRow';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const { currentUser, alerts } = usePosStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenAlerts = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAlerts = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        pb: 1.5,
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      {/* Page Title & Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#000000',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            letterSpacing: '-0.025em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {title}
        </Typography>

        {/* Uber Eats Search Pill (Shortcut Indicator) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 0.75,
            borderRadius: 9999, // Pill style
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEEEEE',
            color: '#545454',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'rgba(6, 193, 103, 0.5)',
              color: '#000000',
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#06C167' }} />
          <span>Quick search...</span>
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: '6px',
              backgroundColor: '#F6F6F6',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#545454',
              border: '1px solid #EEEEEE',
            }}
          >
            ⌘K
          </Box>
        </Box>
      </Box>

      {/* Header Actions & Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Date Selector Badge */}
        <DateSelectorBadge />

        {/* Notifications Icon Button */}
        <IconButton
          aria-label={`Notifications (${alerts.length})`}
          onClick={handleOpenAlerts}
          sx={{
            width: 42,
            height: 42,
            borderRadius: 9999, // Pill
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEEEEE',
            color: '#000000',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#06C167',
              backgroundColor: '#E6F9F0',
            },
          }}
        >
          <Badge badgeContent={alerts.length} color="primary" variant="dot">
            <NotificationsIcon sx={{ color: '#545454', fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* Alerts Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseAlerts}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 360,
                p: 2.5,
                borderRadius: '20px',
                mt: 1.5,
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
                border: '1px solid #EEEEEE',
                backgroundColor: '#FFFFFF',
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000' }}>
              Active Notifications ({alerts.length})
            </Typography>
            <Button size="small" onClick={handleCloseAlerts} sx={{ color: '#06C167', p: 0, fontWeight: 700 }}>
              Dismiss
            </Button>
          </Box>
          <Divider sx={{ mb: 1.5, borderColor: '#EEEEEE' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 320, overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#545454', textAlign: 'center', py: 2 }}>
                No active notifications
              </Typography>
            ) : (
              alerts.map((alert) => (
                <AlertItemRow
                  key={alert.id}
                  title={alert.title}
                  subtitle={alert.subtitle}
                  time={alert.time}
                  severity={alert.severity}
                />
              ))
            )}
          </Box>
        </Popover>

        {/* User Profile Badge */}
        <UserAvatarBadge name={currentUser.name} role={currentUser.role} avatar={currentUser.avatar} />
      </Box>
    </Box>
  );
};
