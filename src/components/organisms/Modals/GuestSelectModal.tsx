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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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

        {/* Guest Seat Buttons Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            gap: 1.5,
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
                  p: 1.5,
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #EEEEEE',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  '&:hover': {
                    borderColor: '#06C167',
                    boxShadow: '0 4px 16px rgba(6, 193, 103, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 9999,
                        backgroundColor: '#E6F9F0',
                        color: '#06C167',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontSize: '0.9rem' }}>
                      Guest #{seat}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${guestItems.length} items`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: guestItems.length > 0 ? '#000000' : '#F6F6F6',
                      color: guestItems.length > 0 ? '#FFFFFF' : '#545454',
                    }}
                  />
                </Box>

                {/* Items Summary preview */}
                {guestItems.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, pt: 0.5, borderTop: '1px dashed #EEEEEE' }}>
                    {guestItems.slice(0, 3).map((gi, idx) => (
                      <Typography key={idx} variant="caption" sx={{ color: '#545454', fontSize: '0.72rem' }} noWrap>
                        • {gi.quantity}x {gi.product.name}
                      </Typography>
                    ))}
                    {guestItems.length > 3 && (
                      <Typography variant="caption" sx={{ color: '#06C167', fontWeight: 700, fontSize: '0.68rem' }}>
                        + {guestItems.length - 3} more items...
                      </Typography>
                    )}
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#06C167', mt: 0.5, textAlign: 'right' }}>
                      {formatINR(subtotal)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: '#9E9E9E', fontStyle: 'italic', display: 'block', pt: 0.5 }}>
                    No items ordered yet. Click to select items for Guest #{seat}.
                  </Typography>
                )}

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    mt: 0.5,
                    borderRadius: 9999,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    color: '#06C167',
                    borderColor: '#A3E9C5',
                    '&:hover': {
                      backgroundColor: '#E6F9F0',
                      borderColor: '#06C167',
                    },
                  }}
                >
                  Order for Guest #{seat}
                </Button>
              </Paper>
            );
          })}
        </Box>

        {/* General / All Seats Option */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            onSelectGuest(1);
            onClose();
          }}
          startIcon={<AddShoppingCartIcon />}
          sx={{
            mt: 2,
            py: 1,
            borderRadius: 9999,
            fontWeight: 800,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#242424' },
          }}
        >
          Open Catalog for Entire Table
        </Button>
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
