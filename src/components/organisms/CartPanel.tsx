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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';

import { usePosStore, posStore } from '../../store/posStore';
import { formatINR } from '../../utils/formatters';
import { OrderType } from '../../types/pos';
import { EmptyState } from '../atoms/EmptyState';
import { NotificationToast } from '../atoms/NotificationToast';
import { BillMenuModal } from './Modals/BillMenuModal';

interface CartPanelProps {
  onReturnToCatalog?: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onReturnToCatalog }) => {
  const { cart, activeOrderType, selectedTableId, selectedTableName, selectedSeatNumber, tables, orders, settings } = usePosStore();
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeSeatTab, setActiveSeatTab] = useState<number>(selectedSeatNumber || 1);

  const activeTable = tables.find((t) => t.id === selectedTableId);
  const isTablePaused = activeTable?.isPaused;

  // Active table order
  const activeOrder = orders.find((o) => (o.tableId === selectedTableId || o.tableName === selectedTableName) && !o.isPaid);

  const seatList = Array.from({ length: activeTable?.seats || 4 }, (_, i) => i + 1);

  const handleOrderTypeChange = (type: OrderType) => {
    posStore.setOrderType(type);
  };

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    posStore.updateCartQuantity(cartItemId, delta);
  };

  const handleClearCart = () => {
    posStore.clearCart();
  };

  const handlePauseOrder = () => {
    if (cart.length === 0 && !selectedTableId) return;
    posStore.pauseTableOrder(selectedTableId);
    setToastMsg(`Order for ${selectedTableName || 'Table'} has been paused ⏸️`);
    setToastOpen(true);
  };

  const handleResumeOrder = () => {
    if (selectedTableId) {
      posStore.reopenTableOrder(selectedTableId);
      setToastMsg(`Resumed order for ${selectedTableName || 'Table'} ▶️`);
      setToastOpen(true);
    }
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;
    const sentOrder = posStore.sendToKitchen();
    setCheckoutDialogOpen(false);
    if (sentOrder) {
      const hasRound2 = cart.some((i) => i.isSentToKitchen);
      setToastMsg(
        hasRound2
          ? `Round 2 Add-On dispatched to kitchen for ${sentOrder.tableName}!`
          : `Order ${sentOrder.orderNumber} successfully sent to kitchen!`
      );
      setToastOpen(true);
    }
  };

  const sentItems = cart.filter((i) => i.isSentToKitchen);
  const unsentItems = cart.filter((i) => !i.isSentToKitchen);

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const taxTotal = Number((subtotal * (settings.taxRate / 100)).toFixed(2));
  const grandTotal = Number((subtotal + taxTotal).toFixed(2));
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unsentSubtotal = unsentItems.reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        {onReturnToCatalog && (
          <IconButton onClick={onReturnToCatalog} sx={{ display: { xs: 'flex', md: 'none' }, color: '#000000', mr: 1, p: 0.5 }}>
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem' }}>
          Current Order ({totalItemCount})
        </Typography>

        {unsentItems.length > 0 && (
          <IconButton size="small" onClick={handleClearCart} sx={{ color: '#E53E3E', p: 0.5 }} title="Clear Unsent Items">
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Order Type Selector Pills */}
      <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
        {[
          { type: 'Dine In' as OrderType, label: 'Dine-In', icon: <TableRestaurantIcon sx={{ fontSize: 14 }} /> },
          { type: 'Takeaway' as OrderType, label: 'Takeout', icon: <LocalTakeoutIcon sx={{ fontSize: 14 }} /> },
          { type: 'Delivery' as OrderType, label: 'Delivery', icon: <DeliveryDiningIcon sx={{ fontSize: 14 }} /> },
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
                borderRadius: 9999,
                py: 0.5,
                px: 1,
                fontWeight: 700,
                fontSize: '0.72rem',
                minHeight: 32,
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
        <Box sx={{ mb: 1.5, p: 1, borderRadius: '10px', backgroundColor: isTablePaused ? '#FEF3C7' : '#E6F9F0', border: `1px solid ${isTablePaused ? '#F59E0B' : '#A3E9C5'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: isTablePaused ? '#B45309' : '#06C167', fontWeight: 700, fontSize: '0.72rem' }}>
            Table: <strong>{activeTable ? (activeTable.tableName || `Table ${activeTable.number}`) : (selectedTableName || 'Unassigned Table')}</strong>
          </Typography>
          <Chip label={isTablePaused ? '⏸️ Order Paused' : 'Dine-In Active'} size="small" sx={{ backgroundColor: isTablePaused ? '#F59E0B' : '#06C167', color: '#FFFFFF', fontWeight: 700, height: 20, fontSize: '0.65rem' }} />
        </Box>
      )}

      {/* Guest / Seat Tag Selector Bar for Multi-Customer Table Ordering */}
      {activeOrderType === 'Dine In' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5, pb: 0.5, overflowX: 'auto' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#545454', fontSize: '0.68rem', textTransform: 'uppercase' }}>
            Seat:
          </Typography>
          {seatList.map((seat) => (
            <Button
              key={seat}
              size="small"
              onClick={() => {
                setActiveSeatTab(seat);
                posStore.setSelectedSeat(seat);
              }}
              sx={{
                minWidth: 32,
                height: 26,
                px: 1,
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: '0.68rem',
                backgroundColor: activeSeatTab === seat ? '#000000' : '#F6F6F6',
                color: activeSeatTab === seat ? '#FFFFFF' : '#545454',
                border: '1px solid #EEEEEE',
              }}
            >
              Guest #{seat}
            </Button>
          ))}
        </Box>
      )}

      <Divider sx={{ mb: 1.5, borderColor: '#EEEEEE' }} />

      {/* Cart Items Scroll Container */}
      <Box sx={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, pr: 0.5 }}>
        {cart.length === 0 ? (
          <EmptyState
            title="Cart is Empty"
            description="Select products from the catalog to build this order ticket."
          />
        ) : (
          <>
            {/* New Unsent Round Items */}
            {unsentItems.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {sentItems.length > 0 && (
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#06C167', textTransform: 'uppercase', letterSpacing: '0.04em', mt: 0.5 }}>
                    ⚡ New Round Items (Unsent)
                  </Typography>
                )}
                {unsentItems.map((item) => (
                  <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                      p: 1.25,
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #06C167',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(6, 193, 103, 0.1)',
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                          {item.product.name}
                        </Typography>
                        {item.seatNumber && (
                          <Chip label={`Guest #${item.seatNumber}`} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#000000', color: '#FFFFFF' }} />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600, fontSize: '0.7rem' }}>
                        {formatINR(item.product.price)} each
                      </Typography>
                      {item.selectedModifiers.length > 0 && (
                        <Typography variant="caption" sx={{ color: '#06C167', display: 'block', fontSize: '0.65rem' }}>
                          + {item.selectedModifiers.map((m) => m.name).join(', ')}
                        </Typography>
                      )}
                      {item.notes && (
                        <Typography variant="caption" sx={{ color: '#E53E3E', display: 'block', fontSize: '0.65rem', fontStyle: 'italic' }}>
                          Note: {item.notes}
                        </Typography>
                      )}
                    </Box>

                    {/* Quantity Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)} sx={{ color: '#545454', border: '1px solid #EEEEEE', p: 0.3, borderRadius: 9999 }}>
                        <RemoveIcon sx={{ fontSize: 13 }} />
                      </IconButton>

                      <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 16, textAlign: 'center', color: '#000000', fontSize: '0.78rem' }}>
                        {item.quantity}
                      </Typography>

                      <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)} sx={{ color: '#06C167', border: '1px solid #A3E9C5', backgroundColor: '#E6F9F0', p: 0.3, borderRadius: 9999 }}>
                        <AddIcon sx={{ fontSize: 13 }} />
                      </IconButton>

                      <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 54, textAlign: 'right', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem' }}>
                        {formatINR(item.itemTotal)}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Previously Sent Items (Locked in Prep) */}
            {sentItems.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: unsentItems.length > 0 ? 1.5 : 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#545454', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🔒 Sent to Kitchen (Round 1)
                </Typography>
                {sentItems.map((item) => (
                  <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                      p: 1.25,
                      borderRadius: '12px',
                      backgroundColor: '#F6F6F6',
                      border: '1px solid #EEEEEE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: 0.85,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: '#06C167' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                          {item.product.name}
                        </Typography>
                        {item.seatNumber && (
                          <Chip label={`Guest #${item.seatNumber}`} size="small" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700, backgroundColor: '#EEEEEE', color: '#545454' }} />
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600, fontSize: '0.7rem' }}>
                        {item.quantity}x • Sent to Kitchen
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, minWidth: 54, textAlign: 'right', color: '#545454', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem' }}>
                      {formatINR(item.itemTotal)}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>

      <Divider sx={{ my: 1.5, borderColor: '#EEEEEE' }} />

      {/* Totals & Submit */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>Subtotal</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', fontSize: '0.78rem' }}>{formatINR(subtotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#545454', fontWeight: 600 }}>Tax ({settings.taxRate}%)</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', fontSize: '0.78rem' }}>{formatINR(taxTotal)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.75, borderTop: '1px solid #EEEEEE' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}>Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#06C167', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatINR(grandTotal)}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons: Send to Kitchen, Bill Menu & Pause/Resume Order */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isTablePaused ? (
            <Button
              variant="contained"
              size="medium"
              fullWidth
              onClick={handleResumeOrder}
              startIcon={<PlayCircleOutlinedIcon />}
              sx={{
                py: 1.1,
                borderRadius: 9999,
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                '&:hover': { backgroundColor: '#D97706' },
              }}
            >
              Resume Order ▶️
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                size="medium"
                disabled={cart.length === 0}
                onClick={handlePauseOrder}
                startIcon={<PauseCircleOutlinedIcon />}
                sx={{
                  borderRadius: 9999,
                  fontWeight: 700,
                  minWidth: 84,
                  color: '#D97706',
                  borderColor: '#FBD38D',
                  backgroundColor: '#FEF3C7',
                  fontSize: '0.75rem',
                  '&:hover': { backgroundColor: '#FDE68A', borderColor: '#F59E0B' },
                }}
              >
                Pause
              </Button>

              <Button
                variant="contained"
                size="medium"
                fullWidth
                disabled={cart.length === 0 || unsentItems.length === 0}
                onClick={() => setCheckoutDialogOpen(true)}
                startIcon={<ShoppingCartCheckoutIcon />}
                sx={{
                  py: 1.1,
                  borderRadius: 9999,
                  fontWeight: 800,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: '#06C167',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
                  '&:hover': {
                    backgroundColor: '#049851',
                    boxShadow: '0 6px 20px rgba(6, 193, 103, 0.5)',
                  },
                }}
              >
                {sentItems.length > 0 ? `Send Round 2 (${formatINR(unsentSubtotal)})` : `Send Kitchen (${formatINR(grandTotal)})`}
              </Button>
            </>
          )}
        </Box>

        {/* Bill Menu & Print Bill Action */}
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          disabled={!activeOrder && cart.length === 0}
          onClick={() => setBillModalOpen(true)}
          startIcon={<ReceiptLongIcon />}
          sx={{
            py: 0.85,
            borderRadius: 9999,
            fontWeight: 800,
            color: '#000000',
            borderColor: '#000000',
            fontSize: '0.8rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            '&:hover': { backgroundColor: '#F6F6F6' },
          }}
        >
          📄 View / Edit Bill Menu & Print Bill
        </Button>
      </Box>

      {/* Bill Menu Modal */}
      <BillMenuModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        order={
          activeOrder || {
            id: 'temp-' + Date.now(),
            orderNumber: '#Draft',
            type: activeOrderType,
            tableId: selectedTableId,
            tableName: selectedTableName || 'Current Order',
            items: cart,
            subtotal,
            tax: taxTotal,
            discount: 0,
            total: grandTotal,
            status: 'Preparing',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now(),
            staffId: '1',
            staffName: 'Staff',
            isPaid: false,
          }
        }
        onOrderCompleted={() => {
          setToastMsg('Bill printed and order moved to completed bills!');
          setToastOpen(true);
        }}
      />

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Confirm Kitchen Dispatch
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#545454', mb: 2 }}>
            Confirm dispatching <strong>{unsentItems.length > 0 ? unsentItems.length : totalItemCount} items</strong> to the kitchen for {selectedTableName || 'Table'}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCheckoutDialogOpen(false)} sx={{ borderRadius: 9999, color: '#545454' }}>
            Cancel
          </Button>
          <Button onClick={handleCompleteOrder} variant="contained" sx={{ borderRadius: 9999, backgroundColor: '#06C167' }}>
            Confirm & Dispatch Ticket
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
