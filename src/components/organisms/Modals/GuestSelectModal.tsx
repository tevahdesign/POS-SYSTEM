import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { TableItem, Order } from '../../../types/pos';
import { formatINR } from '../../../utils/formatters';

interface GuestSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableItem | null;
  linkedOrder?: Order | null;
  onSelectGuest: (seatNumber: number) => void;
  onOpenBillMenu?: (table: TableItem) => void;
}

export const GuestSelectModal: React.FC<GuestSelectModalProps> = ({
  isOpen,
  onClose,
  table,
  linkedOrder,
  onSelectGuest,
  onOpenBillMenu,
}) => {
  if (!table) return null;

  const seatsCount = table.seats || 4;
  const guestList = Array.from({ length: seatsCount }, (_, i) => i + 1);

  // Group items by guest seat
  const getGuestItems = (seatNum: number) => {
    if (!linkedOrder) return [];
    return linkedOrder.items.filter((item) => item.seatNumber === seatNum);
  };

  const getGuestSubtotal = (seatNum: number) => {
    const items = getGuestItems(seatNum);
    return items.reduce((sum, item) => sum + item.itemTotal, 0);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ p: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableRestaurantIcon sx={{ color: '#06C167', fontSize: 26 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#000000',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  lineHeight: 1.2,
                }}
              >
                {table.tableName || `Table ${table.number}`} — Select Guest
              </Typography>
              <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>
                Table Capacity: {table.seats} Seats • Status: {table.status}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={table.status}
            size="small"
            sx={{
              fontWeight: 800,
              backgroundColor: table.status === 'Occupied' ? '#000000' : '#E6F9F0',
              color: table.status === 'Occupied' ? '#FFFFFF' : '#06C167',
            }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 800, color: '#000000', mb: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Select Guest Seat to Take / Add Order Items:
        </Typography>

        {/* Guest Seat Buttons Grid - Small & Simple UI */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
            gap: 1.25,
          }}
        >
          {guestList.map((seat) => {
            const guestItems = getGuestItems(seat);
            const subtotal = getGuestSubtotal(seat);

            return (
              <Paper
                key={seat}
                elevation={1}
                onClick={() => {
                  onSelectGuest(seat);
                  onClose();
                }}
                sx={{
                  p: 1.25,
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #EEEEEE',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  '&:hover': {
                    borderColor: '#06C167',
                    backgroundColor: '#E6F9F0',
                    boxShadow: '0 4px 14px rgba(6, 193, 103, 0.18)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    backgroundColor: guestItems.length > 0 ? '#06C167' : '#F6F6F6',
                    color: guestItems.length > 0 ? '#FFFFFF' : '#06C167',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontSize: '0.82rem', lineHeight: 1.2 }}>
                    Guest #{seat}
                  </Typography>
                  <Typography variant="caption" sx={{ color: guestItems.length > 0 ? '#06C167' : '#888888', fontWeight: 700, fontSize: '0.68rem', display: 'block' }} noWrap>
                    {guestItems.length > 0 ? `${guestItems.length} items (${formatINR(subtotal)})` : '0 items'}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>

      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {linkedOrder && onOpenBillMenu ? (
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              onOpenBillMenu(table);
            }}
            startIcon={<ReceiptLongIcon />}
            sx={{ borderRadius: 9999, color: '#000000', borderColor: '#000000', fontWeight: 800 }}
          >
            View / Edit Table Bill Menu ({formatINR(linkedOrder.total)})
          </Button>
        ) : (
          <Box />
        )}

        <Button onClick={onClose} sx={{ borderRadius: 9999, color: '#545454', fontWeight: 700 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
