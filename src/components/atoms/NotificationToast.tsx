import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface NotificationToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  open,
  message,
  severity = 'success',
  onClose,
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', fontWeight: 600, borderRadius: 1.5, boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
