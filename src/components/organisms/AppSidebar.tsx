import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LogoutIcon from '@mui/icons-material/Logout';

import { posStore, usePosStore } from '../../store/posStore';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { id: 'orders', label: 'Order Entry', path: '/orders', icon: ShoppingBagIcon },
  { id: 'tables', label: 'Table Management', path: '/tables', icon: TableRestaurantIcon },
  { id: 'kitchen', label: 'KDS - Kitchen Display', path: '/kitchen', icon: SoupKitchenIcon },
  { id: 'menu', label: 'Menu Management', path: '/menu', icon: MenuBookIcon },
  { id: 'inventory', label: 'Inventory', path: '/inventory', icon: InventoryIcon },
  { id: 'reports', label: 'Reports', path: '/reports', icon: BarChartIcon },
  { id: 'staff', label: 'Staff Management', path: '/staff', icon: PeopleIcon },
  { id: 'payments', label: 'Payments & Reconciliation', path: '/payments', icon: CreditCardIcon },
  { id: 'settings', label: 'Settings', path: '/settings', icon: SettingsIcon },
];

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, settings } = usePosStore();

  const activePath = location.pathname;
  const isManager = currentUser.role === 'Manager' || currentUser.role === 'Owner';
  const isShopOpen = settings.isShopOpen !== false;

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (isManager) return true;
    if (item.id === 'orders' || item.id === 'tables') {
      if (currentUser.permissions?.waiterAccess !== undefined) {
        return Boolean(currentUser.permissions.waiterAccess);
      }
    }
    if (item.id === 'kitchen') {
      if (currentUser.permissions?.kitchenAccess !== undefined) {
        return Boolean(currentUser.permissions.kitchenAccess);
      }
    }
    const permKey = item.id as keyof typeof currentUser.permissions;
    return Boolean(currentUser.permissions?.[permKey]);
  });

  const toggleShop = () => {
    posStore.toggleShopStatus(!isShopOpen);
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 80,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        py: 2.5,
        zIndex: 1100,
        userSelect: 'none',
        flexShrink: 0,
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Brand Logo - Yoko Space Light Style */}
      <Box
        onClick={() => navigate(filteredNavItems[0]?.path || '/login')}
        sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
          cursor: 'pointer',
          mb: 3,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.06)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
          },
        }}
      >
        Y
      </Box>

      {/* Nav List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePath === item.path || (item.path !== '/' && activePath.startsWith(item.path));

          return (
            <Tooltip key={item.id} title={item.label} placement="right" arrow>
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {isActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -16,
                      width: 4,
                      height: 28,
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#6366F1',
                      boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                    }}
                  />
                )}
                <IconButton
                  aria-label={item.label}
                  onClick={() => navigate(item.path)}
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 9999, // Yoko Pill Button
                    backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4338CA' : '#64748B',
                    border: isActive ? '1px solid #C7D2FE' : '1px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: isActive ? '#E0E7FF' : '#F1F5F9',
                      color: isActive ? '#3730A3' : '#0F172A',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </IconButton>
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <Divider sx={{ width: 40, my: 2, borderColor: '#E2E8F0' }} />

      {/* Footer Shop Toggle & Profile Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        {isManager && (
          <Tooltip
            title={
              isShopOpen
                ? 'Click to Close Shop (Lock POS)'
                : 'Click to Open Shop'
            }
            placement="right"
            arrow
          >
            <IconButton
              aria-label="Toggle Shop Open/Close"
              onClick={toggleShop}
              sx={{
                width: 42,
                height: 42,
                borderRadius: 9999,
                backgroundColor: isShopOpen ? '#ECFDF5' : '#FEE2E2',
                color: isShopOpen ? '#047857' : '#B91C1C',
                border: `1px solid ${isShopOpen ? '#A7F3D0' : '#FECACA'}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isShopOpen ? '#D1FAE5' : '#FCA5A5',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <PowerSettingsNewIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={`${currentUser.name} (${currentUser.role})`} placement="right" arrow>
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            onClick={() => (isManager ? navigate('/settings') : undefined)}
            sx={{
              width: 38,
              height: 38,
              cursor: isManager ? 'pointer' : 'default',
              border: '2px solid #E2E8F0',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': isManager ? { borderColor: '#6366F1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' } : {},
            }}
          />
        </Tooltip>

        <Tooltip title="Sign Out / Lock POS" placement="right" arrow>
          <IconButton
            aria-label="Sign Out"
            onClick={() => navigate('/login')}
            sx={{
              width: 42,
              height: 42,
              borderRadius: 9999,
              color: '#64748B',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
