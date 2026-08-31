import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PersonIcon from '@mui/icons-material/Person';

import { Order, CartItem, PaymentMethod } from '../../../types/pos';
import { usePosStore, posStore } from '../../../store/posStore';
import { formatINR } from '../../../utils/formatters';

interface BillMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderCompleted?: () => void;
}

export const BillMenuModal: React.FC<BillMenuModalProps> = ({
  isOpen,
  onClose,
  order,
  onOrderCompleted,
}) => {
  const { settings } = usePosStore();

  const [items, setItems] = useState<CartItem[]>([]);
  const [discountInput, setDiscountInput] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isEditingBill, setIsEditingBill] = useState<boolean>(false);
  const [isPrintingMode, setIsPrintingMode] = useState<boolean>(false);

  useEffect(() => {
    if (order) {
      setItems([...order.items]);
      setDiscountInput(order.discount || 0);
      setPaymentMethod(order.paymentMethod || 'Cash');
      setIsEditingBill(false);
      setIsPrintingMode(false);
    }
  }, [order]);

  if (!order) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = Number((subtotal * (settings.taxRate / 100)).toFixed(2));
  const discount = Math.max(0, Number(discountInput) || 0);
  const finalTotal = Math.max(0, Number((subtotal + tax - discount).toFixed(2)));

  // Group items by seat number
  const guestSeats = Array.from(new Set(items.map((i) => i.seatNumber || 1))).sort((a, b) => a - b);

  const handleItemQuantityChange = (itemId: string, delta: number) => {
    const updated = items
      .map((i) => {
        if (i.id === itemId) {
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          const unitPrice = i.product.price + i.selectedModifiers.reduce((sum, m) => sum + m.price, 0);
          return {
            ...i,
            quantity: newQty,
            itemTotal: Number((unitPrice * newQty).toFixed(2)),
          };
        }
        return i;
      })
      .filter((i): i is CartItem => i !== null);

    setItems(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  const handleSaveBillEdits = () => {
    posStore.updateOrderPreBill(order.id, items, discount);
    setIsEditingBill(false);
  };

  const handleFinalizeAndPrint = () => {
    // Save any pending edits
    posStore.updateOrderPreBill(order.id, items, discount);
    // Mark as completed & paid, free table
    posStore.completeAndPrintOrder(order.id, paymentMethod);
    
    // Trigger browser print
    setTimeout(() => {
      window.print();
    }, 200);

    if (onOrderCompleted) {
      onOrderCompleted();
    }
    onClose();
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
                Bill Menu & Checkout — {order.orderNumber}
              </Typography>
              <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>
                {order.tableName || 'Takeaway'} • {order.type} • {order.createdAt}
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant={isEditingBill ? 'contained' : 'outlined'}
            onClick={() => {
              if (isEditingBill) {
                handleSaveBillEdits();
              } else {
                setIsEditingBill(true);
              }
            }}
            startIcon={<EditIcon sx={{ fontSize: 14 }} />}
            sx={{
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '0.72rem',
              backgroundColor: isEditingBill ? '#000000' : 'transparent',
              color: isEditingBill ? '#FFFFFF' : '#000000',
              borderColor: '#000000',
            }}
          >
            {isEditingBill ? 'Done Editing' : 'Edit Bill Items'}
          </Button>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Printable Thermal Receipt Wrapper */}
        <Box id="printable-receipt" sx={{ width: '100%' }}>
          {/* Restaurant Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {settings.restaurantName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#545454', display: 'block' }}>
              {settings.address} • Tel: {settings.phone}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

          {/* Items List (Grouped by Guest Seat) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {guestSeats.map((seatNum) => {
              const seatItems = items.filter((i) => (i.seatNumber || 1) === seatNum);
              if (seatItems.length === 0) return null;

              return (
                <Box key={seatNum} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#06C167' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontSize: '0.8rem' }}>
                      Guest #{seatNum}
                    </Typography>
                    <Divider sx={{ flex: 1, borderStyle: 'dashed' }} />
                  </Box>

                  {seatItems.map((item) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      sx={{
                        p: 1.25,
                        borderRadius: '10px',
                        backgroundColor: '#FAFAFA',
                        border: '1px solid #EEEEEE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#000000' }} noWrap>
                          {item.product.name}
                        </Typography>
                        {item.selectedModifiers.length > 0 && (
                          <Typography variant="caption" sx={{ color: '#545454', display: 'block', fontSize: '0.68rem' }}>
                            + {item.selectedModifiers.map((m) => m.name).join(', ')}
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600, fontSize: '0.72rem' }}>
                          {formatINR(item.product.price)} each
                        </Typography>
                      </Box>

                      {/* Editing Controls or Static Qty */}
                      {isEditingBill ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleItemQuantityChange(item.id, -1)}
                            sx={{ border: '1px solid #DDD', p: 0.3 }}
                          >
                            <RemoveIcon sx={{ fontSize: 12 }} />
                          </IconButton>

                          <Typography variant="subtitle2" sx={{ minWidth: 20, textAlign: 'center', fontWeight: 800 }}>
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() => handleItemQuantityChange(item.id, 1)}
                            sx={{ border: '1px solid #06C167', color: '#06C167', p: 0.3 }}
                          >
                            <AddIcon sx={{ fontSize: 12 }} />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ color: '#E53E3E', p: 0.3, ml: 0.5 }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontSize: '0.8rem' }}>
                            {item.quantity}x • {formatINR(item.itemTotal)}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

          {/* Pre-Bill Adjustments: Discount & Payment Method */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {isEditingBill && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalOfferIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                <TextField
                  label="Discount Amount (₹)"
                  type="number"
                  size="small"
                  fullWidth
                  value={discountInput}
                  onChange={(e) => setDiscountInput(Number(e.target.value))}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#545454' }}>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#000000' }}>
                {formatINR(subtotal)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#545454' }}>
              <Typography variant="body2">GST Tax ({settings.taxRate}%):</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#000000' }}>
                {formatINR(tax)}
              </Typography>
            </Box>

            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#E53E3E' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Discount Applied:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  -{formatINR(discount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1.5px solid #000000' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Final Total Bill:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#06C167', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatINR(finalTotal)}
              </Typography>
            </Box>
          </Box>

          {/* Payment Method Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#545454', textTransform: 'uppercase' }}>
              Payment Method:
            </Typography>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                sx={{ borderRadius: 9999, fontWeight: 700, fontSize: '0.8rem' }}
              >
                <MenuItem value="Cash">💵 Cash Payment</MenuItem>
                <MenuItem value="Card">💳 Credit / Debit Card</MenuItem>
                <MenuItem value="UPI">📱 UPI / QR Scan</MenuItem>
                <MenuItem value="Online">🌐 Online Order</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 9999, color: '#545454' }}>
          Close
        </Button>

        <Button
          onClick={handleFinalizeAndPrint}
          variant="contained"
          startIcon={<PrintIcon />}
          sx={{
            borderRadius: 9999,
            fontWeight: 800,
            backgroundColor: '#06C167',
            color: '#FFFFFF',
            py: 1,
            px: 2.5,
            boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
            '&:hover': { backgroundColor: '#049851' },
          }}
        >
          Print Bill & Move to Completed
        </Button>
      </DialogActions>
    </Dialog>
  );
};
