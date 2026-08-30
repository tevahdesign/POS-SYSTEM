import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { TableItem } from '../../types/pos';
import { StatusChip } from '../atoms/StatusChip';
import { formatINR } from '../../utils/formatters';
import { usePosStore, posStore } from '../../store/posStore';
import { useNavigate } from 'react-router-dom';
import { NotificationToast } from '../atoms/NotificationToast';

interface TableDetailDrawerProps {
  table: TableItem | null;
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({ table }) => {
  const navigate = useNavigate();
  const { orders, staff, tables } = usePosStore();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState('');
  const [targetTableId, setTargetTableId] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  if (!table) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: '20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EEEEEE',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 520,
          textAlign: 'center',
        }}
      >
        <TableRestaurantIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000' }}>
          No Table Selected
        </Typography>
        <Typography variant="body2" sx={{ color: '#545454', maxWidth: 220, mt: 0.5 }}>
          Click on any table card in the floor plan layout to manage seating, orders, and servers.
        </Typography>
      </Paper>
    );
  }

  const tableNameStr = table.tableName || `Table ${table.number}`;
  const linkedOrder = orders.find((o) => o.id === table.currentOrderId || (o.tableId === table.id && !o.isPaid));

  const handleOpenOrderEntry = () => {
    posStore.setSelectedTable(table.id, tableNameStr);
    navigate('/orders');
  };

  const handleConfirmAssignServer = () => {
    const s = staff.find((st) => st.id === selectedServerId);
    if (s && table) {
      posStore.updateTableStatus(table.id, table.status, s.name, table.guestCount);
      setToastMsg(`Assigned server "${s.name}" to ${tableNameStr}`);
      setToastOpen(true);
      setAssignDialogOpen(false);
    }
  };

  const handleConfirmPauseOrder = () => {
    if (table) {
      posStore.pauseTableOrder(table.id);
      setToastMsg(`Paused order for ${tableNameStr}`);
      setToastOpen(true);
      setTransferDialogOpen(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        minHeight: 520,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {tableNameStr}
          </Typography>
          <Typography variant="caption" sx={{ color: '#545454' }}>
            Section: Main Dining Hall
          </Typography>
        </Box>
        <StatusChip status={table.status} />
      </Box>

      <Divider sx={{ borderColor: '#EEEEEE' }} />

      {/* Info Grid */}
      <Grid container spacing={1.5}>
        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#FAFAFA', border: '1px solid #EEEEEE', borderRadius: '12px' }}>
            <Typography variant="caption" sx={{ color: '#545454', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} /> Started
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.25, color: '#000000' }}>
              {table.startTime || 'Not started'}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#FAFAFA', border: '1px solid #EEEEEE', borderRadius: '12px' }}>
            <Typography variant="caption" sx={{ color: '#545454', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <PeopleIcon sx={{ fontSize: 14 }} /> Guests
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.25, color: '#000000' }}>
              {table.guestCount || table.seats} Guests
            </Typography>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#FAFAFA', border: '1px solid #EEEEEE', borderRadius: '12px' }}>
            <Typography variant="caption" sx={{ color: '#545454', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <PersonIcon sx={{ fontSize: 14 }} /> Server
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.25, color: '#000000' }}>
              {table.serverName || 'Unassigned'}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper elevation={0} sx={{ p: 1.5, backgroundColor: '#FAFAFA', border: '1px solid #EEEEEE', borderRadius: '12px' }}>
            <Typography variant="caption" sx={{ color: '#545454', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <AttachMoneyIcon sx={{ fontSize: 14 }} /> Order Total
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#06C167', mt: 0.25, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {formatINR(table.totalAmount || linkedOrder?.total || 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenOrderEntry}
          startIcon={<AddCircleOutlinedIcon />}
          sx={{
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
          {table.status === 'Occupied' ? 'Modify Table Order' : 'Open Order Ticket'}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setAssignDialogOpen(true)}
            startIcon={<PersonIcon />}
            sx={{ borderRadius: 9999, color: '#000000', borderColor: '#EEEEEE' }}
          >
            Assign Server
          </Button>

          <Button
            variant="outlined"
            fullWidth
            disabled={table.status !== 'Occupied'}
            onClick={handleConfirmPauseOrder}
            startIcon={<SwapHorizIcon />}
            sx={{ borderRadius: 9999, color: '#000000', borderColor: '#EEEEEE' }}
          >
            Pause Order
          </Button>
        </Box>
      </Box>

      {/* Assign Server Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Assign Server to {tableNameStr}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Select Server</InputLabel>
            <Select
              value={selectedServerId}
              label="Select Server"
              onChange={(e) => setSelectedServerId(e.target.value)}
            >
              {staff.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)} sx={{ borderRadius: 9999, color: '#545454' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAssignServer} variant="contained" sx={{ borderRadius: 9999 }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationToast
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </Paper>
  );
};
