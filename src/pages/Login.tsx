import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BackspaceIcon from '@mui/icons-material/Backspace';

import { usePosStore, posStore } from '../store/posStore';
import { StaffMember } from '../types/pos';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { staff, settings } = usePosStore();

  const [mode, setMode] = useState<'pin' | 'manager'>('pin');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleQuickSelectStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setPin('');
  };

  const handleNumpadPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4 && selectedStaff) {
        attemptPinLogin(selectedStaff, nextPin);
      }
    }
  };

  const handleNumpadDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const attemptPinLogin = (member: StaffMember, enteredPin: string) => {
    if (enteredPin === member.pin) {
      posStore.setCurrentUser(member);
      setToastMsg(`Welcome back, ${member.name}!`);
      setToastOpen(true);
      setTimeout(() => {
        if (member.role === 'Manager' || member.role === 'Owner') {
          navigate('/dashboard');
        } else if (member.permissions.waiterAccess || member.permissions.orders) {
          navigate('/orders');
        } else if (member.permissions.kitchenAccess || member.permissions.kitchen) {
          navigate('/kitchen');
        } else {
          navigate('/orders');
        }
      }, 400);
    } else {
      setToastMsg('Invalid PIN. Please try again.');
      setToastOpen(true);
      setPin('');
    }
  };

  const handleManagerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const manager = staff.find(
      (s) =>
        (s.role === 'Manager' || s.role === 'Owner') &&
        (s.username?.toLowerCase() === username.toLowerCase() ||
          s.name.toLowerCase().includes(username.toLowerCase()))
    );

    if (manager) {
      posStore.setCurrentUser(manager);
      navigate('/dashboard');
    } else {
      setToastMsg('Invalid manager credentials.');
      setToastOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        p: 2,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(6, 193, 103, 0.08) 0%, transparent 60%)',
      }}
    >
      <Card
        elevation={4}
        sx={{
          maxWidth: 920,
          width: '100%',
          borderRadius: '24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EEEEEE',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Brand Panel */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            background: '#E6F9F0',
            borderRight: '1px solid #EEEEEE',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  backgroundColor: '#06C167',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
                }}
              >
                Y
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {settings.restaurantName}
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#000000', mb: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Fast, Modern POS Terminal
            </Typography>
            <Typography variant="body2" sx={{ color: '#545454', lineHeight: 1.6 }}>
              Select your worker avatar and enter your 4-digit PIN to open your shift terminal.
            </Typography>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Chip
              label={settings.isShopOpen !== false ? 'POS Terminal Open' : 'Terminal Locked'}
              sx={{
                backgroundColor: settings.isShopOpen !== false ? '#E6F9F0' : '#FED7D7',
                color: settings.isShopOpen !== false ? '#06C167' : '#E53E3E',
                fontWeight: 800,
                borderRadius: 9999,
                border: `1px solid ${settings.isShopOpen !== false ? '#A3E9C5' : '#FEB2B2'}`,
              }}
            />
          </Box>
        </Box>

        {/* Right Authentication Form Panel */}
        <Box sx={{ flex: 1.2, p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Mode Switcher Tabs */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3.5, backgroundColor: '#F6F6F6', p: 0.5, borderRadius: 9999 }}>
            <Button
              fullWidth
              onClick={() => setMode('pin')}
              sx={{
                borderRadius: 9999,
                py: 0.75,
                fontWeight: 700,
                fontSize: '0.8125rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: mode === 'pin' ? '#000000' : 'transparent',
                color: mode === 'pin' ? '#FFFFFF' : '#545454',
                boxShadow: mode === 'pin' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
              }}
            >
              PIN Quick Entry
            </Button>
            <Button
              fullWidth
              onClick={() => setMode('manager')}
              sx={{
                borderRadius: 9999,
                py: 0.75,
                fontWeight: 700,
                fontSize: '0.8125rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: mode === 'manager' ? '#000000' : 'transparent',
                color: mode === 'manager' ? '#FFFFFF' : '#545454',
                boxShadow: mode === 'manager' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
              }}
            >
              Manager Login
            </Button>
          </Box>

          {mode === 'pin' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Staff Avatars Selection */}
              <Box>
                <Typography variant="caption" sx={{ color: '#545454', fontWeight: 700, mb: 1, display: 'block' }}>
                  SELECT ACTIVE WORKER
                </Typography>
                <Grid container spacing={1.5}>
                  {staff.slice(0, 4).map((member) => (
                    <Grid size={6} key={member.id}>
                      <Paper
                        elevation={0}
                        onClick={() => handleQuickSelectStaff(member)}
                        sx={{
                          p: 1.25,
                          borderRadius: '14px',
                          backgroundColor: selectedStaff?.id === member.id ? '#E6F9F0' : '#FAFAFA',
                          border: `2px solid ${selectedStaff?.id === member.id ? '#06C167' : '#EEEEEE'}`,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#06C167',
                          },
                        }}
                      >
                        <Avatar src={member.avatar} alt={member.name} sx={{ width: 36, height: 36, borderRadius: 9999 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.8125rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#545454', fontSize: '0.7rem' }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* PIN Display Dots */}
              {selectedStaff && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', mb: 1 }}>
                    Enter PIN for {selectedStaff.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    {[0, 1, 2, 3].map((idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: 9999,
                          backgroundColor: idx < pin.length ? '#06C167' : '#EEEEEE',
                          boxShadow: idx < pin.length ? '0 0 10px rgba(6, 193, 103, 0.4)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Numpad */}
                  <Grid container spacing={1} sx={{ maxWidth: 240 }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <Grid size={4} key={digit}>
                        <Button
                          fullWidth
                          onClick={() => handleNumpadPress(digit)}
                          sx={{
                            height: 48,
                            borderRadius: 9999,
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: '#000000',
                            backgroundColor: '#F6F6F6',
                            border: '1px solid #EEEEEE',
                            '&:hover': {
                              backgroundColor: '#E6F9F0',
                              borderColor: '#06C167',
                              color: '#06C167',
                            },
                          }}
                        >
                          {digit}
                        </Button>
                      </Grid>
                    ))}
                    <Grid size={4}>
                      <Button
                        fullWidth
                        onClick={() => setPin('')}
                        sx={{ height: 48, borderRadius: 9999, fontWeight: 700, color: '#545454', fontSize: '0.75rem' }}
                      >
                        Clear
                      </Button>
                    </Grid>
                    <Grid size={4}>
                      <Button
                        fullWidth
                        onClick={() => handleNumpadPress('0')}
                        sx={{
                          height: 48,
                          borderRadius: 9999,
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color: '#000000',
                          backgroundColor: '#F6F6F6',
                          border: '1px solid #EEEEEE',
                          '&:hover': {
                            backgroundColor: '#E6F9F0',
                            borderColor: '#06C167',
                          },
                        }}
                      >
                        0
                      </Button>
                    </Grid>
                    <Grid size={4}>
                      <IconButton
                        onClick={handleNumpadDelete}
                        sx={{ height: 48, width: '100%', borderRadius: 9999, color: '#545454', backgroundColor: '#F6F6F6' }}
                      >
                        <BackspaceIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          ) : (
            /* Manager Login Form */
            <form onSubmit={handleManagerLoginSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="manager"
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 1,
                    py: 1.25,
                    borderRadius: 9999,
                    fontWeight: 800,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: '#06C167',
                    '&:hover': {
                      backgroundColor: '#049851',
                    },
                  }}
                >
                  Open Dashboard
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Card>

      <NotificationToast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
    </Box>
  );
};
