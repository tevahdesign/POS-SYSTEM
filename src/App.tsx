import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { AppRoutes } from './routes';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <div className="app-container">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Dynamic Page Main Content */}
      <AppRoutes />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
