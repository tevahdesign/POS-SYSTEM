import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import SettingsIcon from '@mui/icons-material/Settings';
import { usePosStore } from '../../store/posStore';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = usePosStore();

  const activePath = location.pathname;
  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';

  const mobileNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, show: isManager || currentUser.permissions?.dashboard },
    { label: 'Orders', path: '/orders', icon: <ShoppingBagIcon />, show: isManager || currentUser.permissions?.orders || currentUser.permissions?.waiterAccess },
    { label: 'Tables', path: '/tables', icon: <TableRestaurantIcon />, show: isManager || currentUser.permissions?.tables || currentUser.permissions?.waiterAccess },
    { label: 'Kitchen', path: '/kitchen', icon: <SoupKitchenIcon />, show: isManager || currentUser.permissions?.kitchen || currentUser.permissions?.kitchenAccess },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon />, show: isManager || currentUser.permissions?.settings },
  ].filter((item) => item.show);

  const currentVal = mobileNavItems.findIndex((item) => activePath.startsWith(item.path));

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #EEEEEE',
        backdropFilter: 'blur(16px)',
      }}
    >
      <BottomNavigation
        showLabels
        value={currentVal !== -1 ? currentVal : 0}
        onChange={(_, newValue) => {
          if (mobileNavItems[newValue]) {
            navigate(mobileNavItems[newValue].path);
          }
        }}
        sx={{
          height: 64,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: '#545454',
            minWidth: 'auto',
            px: 1,
            py: 0.75,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: '#06C167',
              fontWeight: 800,
              '& .MuiSvgIcon-root': {
                color: '#06C167',
                filter: 'drop-shadow(0 2px 6px rgba(6, 193, 103, 0.3))',
              },
            },
          },
        }}
      >
        {mobileNavItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            aria-label={item.label}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
