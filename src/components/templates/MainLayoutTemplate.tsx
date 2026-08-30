import React from 'react';
import { Box, Container } from '@mui/material';
import { AppHeader } from '../organisms/AppHeader';

interface MainLayoutTemplateProps {
  title: string;
  children: React.ReactNode;
}

export const MainLayoutTemplate: React.FC<MainLayoutTemplateProps> = ({ title, children }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 1.5, sm: 2.5 },
        px: { xs: 1.5, sm: 2.5, md: 3 },
        pb: { xs: 9, md: 3 }, // Bottom padding on mobile to clear bottom nav dock
      }}
    >
      <AppHeader title={title} />
      <Box sx={{ height: 'auto' }}>{children}</Box>
    </Container>
  );
};
