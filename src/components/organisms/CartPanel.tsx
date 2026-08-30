import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import LocalTakeoutIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { usePosStore, posStore } from '../../store/posStore';
import { formatINR } from '../../utils/formatters';
import { OrderType } from '../../types/pos';
import { EmptyState } from '../atoms/EmptyState';
import { NotificationToast } from '../atoms/NotificationToast';

interface CartPanelProps {
  onReturnToCatalog?: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onReturnToCatalog }) => {
  const { cart, activeOrderType, selectedTableId, selectedTableName, tables, settings } = usePosStore();
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const activeTable = tables.find((t) => t.id === selectedTableId);

  const handleOrderTypeChange = (type: OrderType) => {
    posStore.setOrderType(type);
  };

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    posStore.updateCartQuantity(cartItemId, delta);
  };

  const handleClearCart = () => {
    posStore.clearCart();
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;
    const sentOrder = posStore.sendToKitchen();
    setCheckoutDialogOpen(false);
    if (sentOrder) {
      setToastMsg(`Order ${sentOrder.orderNumber} successfully completed & ticket routed to KDS!`);
      setToastOpen(true);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const taxTotal = Number((subtotal * (settings.taxRate / 100)).toFixed(2));
  const grandTotal = Number((subtotal + taxTotal).toFixed(2));
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Order Type Pill Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        {onReturnToCatalog && (
          <IconButton onClick={onReturnToCatalog} sx={{ display: { xs: 'flex', md: 'none' }, color: '#000000', mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Current Order ({totalItemCount})
        </Typography>

        {cart.length > 0 && (
          <IconButton size="small" onClick={handleClearCart} sx={{ color: '#E53E3E' }}>
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      {/* Order Type Selector Pills */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {[
          { type: 'Dine In' as OrderType, label: 'Dine-In', icon: <TableRestaurantIcon sx={{ fontSize: 16 }} /> },
          { type: 'Takeaway' as OrderType, label: 'Takeout', icon: <LocalTakeoutIcon sx={{ fontSize: 16 }} /> },
          { type: 'Delivery' as OrderType, label: 'Delivery', icon: <DeliveryDiningIcon sx={{ fontSize: 16 }} /> },
        ].map((item) => {
          const isActive = activeOrderType === item.type;
          return (
            <Button
              key={item.type}
              fullWidth
              size="small"
              onClick={() => handleOrderTypeChange(item.type)}
              startIcon={item.icon}
              sx={{
                borderRadius: 9999, // Uber Eats Pill Tab
                py: 0.75,
                fontWeight: 700,
                fontSize: '0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: isActive ? '#000000' : '#F6F6F6',
                color: isActive ? '#FFFFFF' : '#545454',
                border: `1px solid ${isActive ? 'transparent' : '#EEEEEE'}`,
                boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                '&:hover': {
                  background: isActive ? '#242424' : '#EEEEEE',
                  color: isActive ? '#FFFFFF' : '#000000',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>

      {/* Linked Table Header Badge */}
      {activeOrderType === 'Dine In' && (
        <Box sx={{ mb: 2, p: 1.25, borderRadius: '12px', backgroundColor: '#E6F9F0', border: '1px solid #A3E9C5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#06C167', fontWeight: 700 }}>
            Table: <strong>{activeTable ? (activeTable.tableName || `Table ${activeTable.number}`) : (selectedTableName || 'Unassigned Table')}</strong>
          </Typography>
          <Chip label="Dine-In Active" size="small" sx={{ backgroundColor: '#06C167', color: '#FFFFFF', fontWeight: 700 }} />
        </Box>
      )}

      <Divider sx={{ mb: 2, borderColor: '#EEEEEE' }} />

      {/* Cart Items Scroll Container */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, pr: 0.5 }}>
        {cart.length === 0 ? (
          <EmptyState
            title="Cart is Empty"
            description="Select products from the catalog to build this order ticket."
          />
        ) : (
          cart.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: '14px',
                backgroundColor: '#FAFAFA',
                border: '1px solid #EEEEEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                  {item.product.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>
                  {formatINR(item.product.price)} each
                </Typography>
                {item.selectedModifiers.length > 0 && (
                  <Typography variant="caption" sx={{ color: '#06C167', display: 'block', fontSize: '0.7rem' }}>
                    + {item.selectedModifiers.map((m) => m.name).join(', ')}
                  </Typography>
                )}
              </Box>

              {/* Quantity Adjuster */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)} sx={{ color: '#545454', border: '1px solid #EEEEEE', p: 0.5, borderRadius: 9999 }}>
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 20, textAlign: 'center', color: '#000000' }}>
                  {item.quantity}
                </Typography>

                <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)} sx={{ color: '#06C167', border: '1px solid #A3E9C5', backgroundColor: '#E6F9F0', p: 0.5, borderRadius: 9999 }}>
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 60, textAlign: 'right', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {formatINR(item.itemTotal)}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <Divider sx={{ my: 2, borderColor: '#EEEEEE' }} />

      {/* Totals & Submit */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>Subtotal</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>{formatINR(subtotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>Tax ({settings.taxRate}%)</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>{formatINR(taxTotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px stroke #EEEEEE' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#06C167', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatINR(grandTotal)}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={cart.length === 0}
        onClick={() => setCheckoutDialogOpen(true)}
        startIcon={<ShoppingCartCheckoutIcon />}
        sx={{
          py: 1.5,
          borderRadius: 9999, // Uber Eats Pill Button
          fontWeight: 800,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: '#06C167',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
          '&:hover': {
            backgroundColor: '#049851',
            boxShadow: '0 6px 20px rgba(6, 193, 103, 0.5)',
          },
        }}
      >
        Send Order to Kitchen ({formatINR(grandTotal)})
      </Button>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Confirm Order Submission
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#545454', mb: 2 }}>
            Confirm submission of <strong>{totalItemCount} items</strong> total <strong>{formatINR(grandTotal)}</strong>? This will dispatch kitchen tickets automatically.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCheckoutDialogOpen(false)} sx={{ borderRadius: 9999, color: '#545454' }}>
            Cancel
          </Button>
          <Button onClick={handleCompleteOrder} variant="contained" sx={{ borderRadius: 9999 }}>
            Confirm & Print Ticket
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
