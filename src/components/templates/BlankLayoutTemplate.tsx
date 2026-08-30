import React from 'react';
import { Box } from '@mui/material';

interface BlankLayoutTemplateProps {
  children: React.ReactNode;
}

export const BlankLayoutTemplate: React.FC<BlankLayoutTemplateProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
      }}
    >
      {children}
    </Box>
  );
};
