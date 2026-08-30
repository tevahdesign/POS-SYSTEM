import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { usePosStore, posStore } from '../store/posStore';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const Settings: React.FC = () => {
  const { settings } = usePosStore();

  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [currency, setCurrency] = useState(settings.currency);
  const [isShopOpen, setIsShopOpen] = useState(settings.isShopOpen !== false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    posStore.updateSettings({
      restaurantName,
      address,
      phone,
      taxRate: parseFloat(taxRate) || 0,
      currency,
      isShopOpen,
    });
    setToastMsg('POS Terminal Configuration & Store Profile Saved Successfully!');
    setToastOpen(true);
  };

  return (
    <MainLayoutTemplate title="System & Store Profile Settings">
      <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 880 }}>
        {/* Store Info Configuration */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <StorefrontIcon sx={{ color: '#06C167' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Restaurant Profile & Thermal Receipt Info
            </Typography>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: '#EEEEEE' }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Full Address (Printed on Receipt Header)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Default Tax Rate (%)"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Currency Symbol"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Operational Controls */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Operational Terminal Status
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={isShopOpen}
                onChange={(e) => setIsShopOpen(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
                Store Open Status (Active POS Ordering Terminal)
              </Typography>
            }
          />
        </Paper>

        {/* Submit Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: 9999, // Uber Eats Pill Button
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: '#06C167',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
              '&:hover': {
                backgroundColor: '#049851',
              },
            }}
          >
            Save Configuration Changes
          </Button>
        </Box>
      </Box>

      <NotificationToast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
    </MainLayoutTemplate>
  );
};
