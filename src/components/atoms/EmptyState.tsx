import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  height?: number | string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  height = 240,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
        backgroundColor: '#F8FAFC',
        border: '1px stroke #E2E8F0',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#F1F5F9',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1.5,
        }}
      >
        {icon || <InboxOutlinedIcon sx={{ fontSize: 26 }} />}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mb: actionLabel ? 2 : 0 }}>
          {description}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button variant="outlined" size="small" onClick={onAction} sx={{ fontWeight: 700 }}>
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};
