import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Paper,
  Checkbox,
  Grid,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import { StaffMember, StaffRole } from '../../../types/pos';
import { posStore } from '../../../store/posStore';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit: StaffMember | null;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, staffToEdit }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<StaffRole>('Server');
  const [pin, setPin] = useState('');
  const [avatar, setAvatar] = useState('');
  const [permissions, setPermissions] = useState({
    dashboard: true,
    orders: true,
    tables: true,
    kitchen: false,
    menu: false,
    inventory: false,
    reports: false,
    staff: false,
    payments: false,
    settings: false,
    waiterAccess: true,
    kitchenAccess: false,
  });

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setUsername(staffToEdit.username || staffToEdit.name.toLowerCase().replace(/\s+/g, '.'));
      setRole(staffToEdit.role);
      setPin(staffToEdit.pin);
      setAvatar(staffToEdit.avatar);
      setPermissions({
        waiterAccess:
          staffToEdit.permissions.waiterAccess ??
          (staffToEdit.permissions.orders && staffToEdit.permissions.tables),
        kitchenAccess: staffToEdit.permissions.kitchenAccess ?? staffToEdit.permissions.kitchen,
        ...staffToEdit.permissions,
      });
    } else {
      setName('');
      setUsername('');
      setRole('Server');
      setPin('1234');
      setAvatar(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      );
      setPermissions({
        dashboard: false,
        orders: true,
        tables: true,
        kitchen: false,
        menu: false,
        inventory: false,
        reports: false,
        staff: false,
        payments: false,
        settings: false,
        waiterAccess: true,
        kitchenAccess: false,
      });
    }
  }, [staffToEdit, isOpen]);

  const handleRoleChange = (selectedRole: StaffRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Manager' || selectedRole === 'Owner') {
      setPermissions({
        dashboard: true,
        orders: true,
        tables: true,
        kitchen: true,
        menu: true,
        inventory: true,
        reports: true,
        staff: true,
        payments: true,
        settings: true,
        waiterAccess: true,
        kitchenAccess: true,
      });
    } else if (selectedRole === 'Server') {
      setPermissions({
        dashboard: false,
        orders: true,
        tables: true,
        kitchen: false,
        menu: false,
        inventory: false,
        reports: false,
        staff: false,
        payments: false,
        settings: false,
        waiterAccess: true,
        kitchenAccess: false,
      });
    } else if (selectedRole === 'Cook') {
      setPermissions({
        dashboard: false,
        orders: false,
        tables: false,
        kitchen: true,
        menu: true,
        inventory: true,
        reports: false,
        staff: false,
        payments: false,
        settings: false,
        waiterAccess: false,
        kitchenAccess: true,
      });
    } else if (selectedRole === 'Cashier') {
      setPermissions({
        dashboard: true,
        orders: true,
        tables: true,
        kitchen: false,
        menu: false,
        inventory: false,
        reports: false,
        staff: false,
        payments: true,
        settings: false,
        waiterAccess: true,
        kitchenAccess: false,
      });
    }
  };

  const handleToggleWaiterAccess = (val: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      waiterAccess: val,
      orders: val,
      tables: val,
    }));
  };

  const handleToggleKitchenAccess = (val: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      kitchenAccess: val,
      kitchen: val,
    }));
  };

  const handleTogglePerm = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) return;

    const finalPermissions = {
      ...permissions,
      orders: permissions.waiterAccess || permissions.orders,
      tables: permissions.waiterAccess || permissions.tables,
      kitchen: permissions.kitchenAccess || permissions.kitchen,
    };

    if (staffToEdit) {
      posStore.updateStaff({
        ...staffToEdit,
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        role,
        pin,
        avatar:
          avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        permissions: finalPermissions,
      });
    } else {
      const newStaff: StaffMember = {
        id: 's-' + Date.now(),
        name,
        username: username || name.toLowerCase().replace(/\s+/g, '.'),
        role,
        pin,
        avatar:
          avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        status: 'Active',
        permissions: finalPermissions,
      };
      posStore.addStaff(newStaff);
    }

    onClose();
  };

  const permKeys: (keyof typeof permissions)[] = [
    'dashboard',
    'orders',
    'tables',
    'kitchen',
    'menu',
    'inventory',
    'reports',
    'staff',
    'payments',
    'settings',
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {staffToEdit ? `Edit Credentials: ${staffToEdit.name}` : 'Add New Worker Credentials'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Username / Login ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="rahul.waiter"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    label="Role"
                    onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
                  >
                    <MenuItem value="Owner">Owner</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Cashier">Cashier</MenuItem>
                    <MenuItem value="Server">Server (Waiter)</MenuItem>
                    <MenuItem value="Cook">Cook (Kitchen)</MenuItem>
                    <MenuItem value="Dishwasher">Dishwasher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="password"
                  slotProps={{ htmlInput: { maxLength: 4 } }}
                  label="4-Digit POS PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Avatar Image URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
              </Grid>
            </Grid>

            {/* Operational Access Controls */}
            <Paper elevation={0} sx={{ p: 2, backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#C2410C', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <ShieldOutlinedIcon sx={{ fontSize: 18 }} /> Primary Operational Access Controls
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: '1px solid',
                      borderColor: permissions.waiterAccess ? 'primary.main' : '#E2E8F0',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TableRestaurantIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Waiter Access
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Floor plan & Order Entry
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={Boolean(permissions.waiterAccess)}
                      onChange={(e) => handleToggleWaiterAccess(e.target.checked)}
                      color="primary"
                    />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: '1px solid',
                      borderColor: permissions.kitchenAccess ? 'success.main' : '#E2E8F0',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SoupKitchenIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Kitchen Access
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          KDS & Cooking Prep
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      checked={Boolean(permissions.kitchenAccess)}
                      onChange={(e) => handleToggleKitchenAccess(e.target.checked)}
                      color="success"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* Modular Permissions Grid */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Detailed Module Access Permissions
              </Typography>
              <Grid container spacing={1} sx={{ backgroundColor: '#F8FAFC', p: 1.5, borderRadius: 2 }}>
                {permKeys.map((pKey) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={pKey}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={permissions[pKey]}
                          onChange={() => handleTogglePerm(pKey)}
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                          {pKey}
                        </Typography>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Worker Credentials
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
