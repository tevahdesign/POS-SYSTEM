import React from 'react';
import { Box, Container } from '@mui/material';
import { AppHeader } from '../organisms/AppHeader';

interface MainLayoutTemplateProps {
  title: string;
  children: React.ReactNode;
}

export const MainLayoutTemplate: React.FC<MainLayoutTemplateProps> = ({ title, children }) => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
      <AppHeader title={title} />
      <Box sx={{ minHeight: 'calc(100vh - 120px)' }}>{children}</Box>
    </Container>
  );
};
