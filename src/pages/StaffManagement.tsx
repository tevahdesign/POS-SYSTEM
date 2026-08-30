import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  IconButton,
  Avatar,
  Chip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { StatusChip } from '../components/atoms/StatusChip';
import { StaffModal } from '../components/organisms/Modals/StaffModal';
import { usePosStore, posStore } from '../store/posStore';
import { StaffMember } from '../types/pos';

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const StaffManagement: React.FC = () => {
  const { staff } = usePosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Dialog states for PIN reset & Delete
  const [pinResetStaff, setPinResetStaff] = useState<StaffMember | null>(null);
  const [newPin, setNewPin] = useState('1234');
  const [deleteStaffTarget, setDeleteStaffTarget] = useState<StaffMember | null>(null);

  // Toast feedback
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsModalOpen(true);
  };

  const handleConfirmPinReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinResetStaff && newPin.length === 4) {
      posStore.resetStaffPin(pinResetStaff.id, newPin);
      setToastMsg(`PIN for ${pinResetStaff.name} updated to ${newPin}`);
      setToastOpen(true);
      setPinResetStaff(null);
      setNewPin('1234');
    }
  };

  const handleToggleStatus = (staffId: string) => {
    posStore.toggleStaffStatus(staffId);
  };

  const handleConfirmDeleteStaff = () => {
    if (deleteStaffTarget) {
      posStore.deleteStaff(deleteStaffTarget.id);
      setToastMsg(`Removed worker credentials for "${deleteStaffTarget.name}"`);
      setToastOpen(true);
      setDeleteStaffTarget(null);
    }
  };

  const handleAddNew = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  return (
    <MainLayoutTemplate title="Staff & Worker Credentials Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Team Directory & Operational Access ({staff.length})
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.1,
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
            Add Worker Credentials
          </Button>
        </Box>

        {/* Staff Table */}
        <Paper elevation={1} sx={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Worker Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Access Rights</TableCell>
                  <TableCell>PIN</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member) => {
                  const hasWaiter =
                    member.permissions.waiterAccess ??
                    (member.permissions.orders && member.permissions.tables);
                  const hasKitchen =
                    member.permissions.kitchenAccess ?? member.permissions.kitchen;

                  return (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={member.avatar} alt={member.name} sx={{ width: 38, height: 38, borderRadius: 9999 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {member.name}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontFamily: 'monospace', color: '#545454' }}>
                        {member.username || member.name.toLowerCase().replace(/\s+/g, '.')}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{ backgroundColor: '#E6F9F0', fontWeight: 700, color: '#06C167', borderRadius: 9999 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {hasWaiter && (
                            <Chip
                              icon={<TableRestaurantIcon sx={{ fontSize: '14px !important', color: '#C05621' }} />}
                              label="Waiter"
                              size="small"
                              sx={{ backgroundColor: '#FEEBC8', color: '#C05621', fontWeight: 700, borderRadius: 9999 }}
                            />
                          )}
                          {hasKitchen && (
                            <Chip
                              icon={<SoupKitchenIcon sx={{ fontSize: '14px !important', color: '#06C167' }} />}
                              label="Kitchen"
                              size="small"
                              sx={{ backgroundColor: '#E6F9F0', color: '#06C167', fontWeight: 700, borderRadius: 9999 }}
                            />
                          )}
                          {!hasWaiter && !hasKitchen && (
                            <Chip label="No Access" size="small" sx={{ backgroundColor: '#F6F6F6', color: '#545454', borderRadius: 9999 }} />
                          )}
                        </Box>
                      </TableCell>

                      <TableCell sx={{ fontFamily: 'monospace', color: '#545454' }}>
                        •••• ({member.pin})
                      </TableCell>

                      <TableCell>
                        <StatusChip status={member.status} />
                      </TableCell>

                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          <IconButton size="small" aria-label={`Edit ${member.name}`} onClick={() => handleEdit(member)} sx={{ color: '#545454', '&:hover': { color: '#06C167' } }}>
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton size="small" aria-label={`Reset PIN for ${member.name}`} onClick={() => setPinResetStaff(member)} sx={{ color: '#545454', '&:hover': { color: '#06C167' } }}>
                            <LockIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label={`Toggle active state for ${member.name}`}
                            onClick={() => handleToggleStatus(member.id)}
                            sx={{ color: member.status === 'Active' ? '#06C167' : '#E53E3E' }}
                          >
                            <PowerSettingsNewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton size="small" aria-label={`Delete ${member.name}`} onClick={() => setDeleteStaffTarget(member)} sx={{ color: '#E53E3E', '&:hover': { color: '#C53030' } }}>
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staffToEdit={selectedStaff}
        />

        {/* PIN Reset Dialog */}
        <Dialog open={Boolean(pinResetStaff)} onClose={() => setPinResetStaff(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Reset PIN for {pinResetStaff?.name}
          </DialogTitle>
          <form onSubmit={handleConfirmPinReset}>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: '#545454' }}>
                Enter new 4-digit PIN for worker authentication:
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="New 4-Digit PIN"
                placeholder="1234"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 4 } }}
                autoFocus
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setPinResetStaff(null)} sx={{ borderRadius: 9999, color: '#545454' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ borderRadius: 9999 }}>
                Update PIN
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Worker Dialog */}
        <Dialog open={Boolean(deleteStaffTarget)} onClose={() => setDeleteStaffTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirm Credential Removal</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#545454' }}>
              Are you sure you want to PERMANENTLY REMOVE worker credentials for <strong>"{deleteStaffTarget?.name}"</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteStaffTarget(null)} sx={{ borderRadius: 9999, color: '#545454' }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeleteStaff} variant="contained" color="error" sx={{ borderRadius: 9999 }}>
              Remove Worker
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <NotificationToast
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </MainLayoutTemplate>
  );
};
