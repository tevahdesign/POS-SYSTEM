import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { OrderEntry } from './pages/OrderEntry';
import { TableManagement } from './pages/TableManagement';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { MenuManagement } from './pages/MenuManagement';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { StaffManagement } from './pages/StaffManagement';
import { PaymentsReconciliation } from './pages/PaymentsReconciliation';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredPermission="dashboard">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredPermission="orders">
            <OrderEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute requiredPermission="orders">
            <OrderEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute requiredPermission="tables">
            <TableManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute requiredPermission="kitchen">
            <KitchenDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute requiredPermission="menu">
            <MenuManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute requiredPermission="inventory">
            <Inventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute requiredPermission="reports">
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute requiredPermission="staff">
            <StaffManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute requiredPermission="payments">
            <PaymentsReconciliation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredPermission="settings">
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

