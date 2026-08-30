import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { posTheme } from './theme/theme';
import { AppSidebar } from './components/organisms/AppSidebar';
import { MobileBottomNav } from './components/organisms/MobileBottomNav';
import { AppRoutes } from './routes';
import { Box } from '@mui/material';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Desktop Sidebar Organism */}
      <AppSidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          pb: { xs: 8, md: 0 },
        }}
      >
        <AppRoutes />
      </Box>

      {/* Mobile Bottom Navigation Organism */}
      <MobileBottomNav />
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={posTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
