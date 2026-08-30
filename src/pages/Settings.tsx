import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { usePosStore, posStore } from '../store/posStore';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const Settings: React.FC = () => {
  const { settings } = usePosStore();
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [formData, setFormData] = useState({ ...settings });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const categories = [
    'General',
    'Restaurant Info',
    'Tax Settings',
    'Payment Methods',
    'Printers',
    'Users & Permissions',
    'Notifications',
    'Backup & Restore',
    'Integrations',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    posStore.updateSettings(formData);
    setToastMsg('Settings updated successfully!');
    setToastOpen(true);
  };

  const handleConfirmResetData = () => {
    posStore.resetAllState();
    setResetDialogOpen(false);
    window.location.reload();
  };

  return (
    <MainLayoutTemplate title="Settings">
      <Grid container spacing={2.5}>
        {/* Left Sub-Navigation Sidebar */}
        <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
          <Paper elevation={1} sx={{ p: 1.5, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  fullWidth
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1.1,
                    borderRadius: 9999, // Yoko Pill Tab
                    fontWeight: isActive ? 800 : 600,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#0F172A',
                    },
                  }}
                >
                  {cat}
                </Button>
              );
            })}
          </Paper>
        </Grid>

        {/* Right Form Card */}
        <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
          <Paper elevation={1} sx={{ p: 4, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {activeCategory} Settings
              </Typography>
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#E2E8F0' }} />

            <form onSubmit={handleSave}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 540 }}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#64748B' }}>Currency</InputLabel>
                      <Select
                        value={formData.currency}
                        label="Currency"
                        onChange={(e) => {
                          const val = e.target.value;
                          const sym = val.includes('INR')
                            ? '₹'
                            : val.includes('EUR')
                            ? '€'
                            : val.includes('GBP')
                            ? '£'
                            : '$';
                          setFormData({ ...formData, currency: val, currencySymbol: sym });
                        }}
                        sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      >
                        <MenuItem value="INR (₹)">INR (₹)</MenuItem>
                        <MenuItem value="USD ($)">USD ($)</MenuItem>
                        <MenuItem value="EUR (€)">EUR (€)</MenuItem>
                        <MenuItem value="GBP (£)">GBP (£)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#64748B' }}>Time Zone</InputLabel>
                      <Select
                        value={formData.timezone}
                        label="Time Zone"
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      >
                        <MenuItem value="(UTC-05:00) Eastern Time">(UTC-05:00) Eastern Time</MenuItem>
                        <MenuItem value="(UTC-08:00) Pacific Time">(UTC-08:00) Pacific Time</MenuItem>
                        <MenuItem value="(UTC+00:00) London">(UTC+00:00) London</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#64748B' }}>Date Format</InputLabel>
                      <Select
                        value={formData.datePattern}
                        label="Date Format"
                        onChange={(e) => setFormData({ ...formData, datePattern: e.target.value })}
                        sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      >
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#64748B' }}>Time Format</InputLabel>
                      <Select
                        value={formData.timeFormat}
                        label="Time Format"
                        onChange={(e) =>
                          setFormData({ ...formData, timeFormat: e.target.value as any })
                        }
                        sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                      >
                        <MenuItem value="12 Hour">12 Hour</MenuItem>
                        <MenuItem value="24 Hour">24 Hour</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: '#64748B' }}>Language</InputLabel>
                  <Select
                    value={formData.language}
                    label="Language"
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    sx={{ borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0F172A' }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  label="Default Tax Rate (%)"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                  }
                />

                <Divider sx={{ my: 1, borderColor: '#E2E8F0' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setResetDialogOpen(true)}
                    startIcon={<RestartAltIcon />}
                    sx={{ borderRadius: 9999 }}
                  >
                    Factory Reset Demo State
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{
                      px: 3.5,
                      borderRadius: 9999, // Yoko Pill Button
                      fontWeight: 800,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirm Factory Reset</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Are you sure you want to reset all POS data back to factory seed defaults? This will erase custom products, orders, and settings.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResetDialogOpen(false)} sx={{ borderRadius: 9999, color: '#64748B' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmResetData} variant="contained" color="error" sx={{ borderRadius: 9999 }}>
            Reset All Data
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationToast
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </MainLayoutTemplate>
  );
};
