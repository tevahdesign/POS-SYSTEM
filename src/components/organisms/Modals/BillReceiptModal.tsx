import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { Order } from '../../../types/pos';
import { usePosStore } from '../../../store/posStore';
import { formatINR } from '../../../utils/formatters';

interface BillReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({ isOpen, onClose, order }) => {
  const { settings } = usePosStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Customer Bill / Receipt</DialogTitle>
      <DialogContent>
        <PaperReceiptContent order={order} settings={settings} />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
        <Button onClick={handlePrint} variant="contained" color="primary" startIcon={<PrintIcon />}>
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const PaperReceiptContent: React.FC<{ order: Order; settings: any }> = ({ order, settings }) => {
  return (
    <Box
      id="printable-receipt"
      sx={{
        p: 2.5,
        backgroundColor: '#FFFFFF',
        border: '1px dashed #CBD5E1',
        borderRadius: 2,
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.8125rem',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'inherit' }}>
          {settings.restaurantName}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          {settings.address}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
          Tel: {settings.phone}
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, fontSize: '0.75rem' }}>
        <div><strong>Order:</strong> {order.orderNumber} ({order.type})</div>
        <div><strong>Table:</strong> {order.tableName || 'N/A'}</div>
        <div><strong>Date:</strong> {order.createdAt}</div>
        <div><strong>Server:</strong> {order.staffName}</div>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

      <Box sx={{ width: '100%', mb: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, pb: 0.5, borderBottom: '1px solid #E2E8F0' }}>
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </Box>
        {order.items.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Box sx={{ flex: 1 }}>
              <div>{item.product.name}</div>
              {item.selectedModifiers.map((m) => (
                <Typography key={m.id} variant="caption" sx={{ color: 'text.secondary', display: 'block', pl: 1 }}>
                  + {m.name}
                </Typography>
              ))}
            </Box>
            <Box sx={{ width: 30, textAlign: 'center' }}>{item.quantity}</Box>
            <Box sx={{ width: 60, textAlign: 'right' }}>{formatINR(item.itemTotal)}</Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal:</span>
          <span>{formatINR(order.subtotal)}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Tax ({settings.taxRate}%):</span>
          <span>{formatINR(order.tax)}</span>
        </Box>
        {order.discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'error.main' }}>
            <span>Discount:</span>
            <span>-{formatINR(order.discount)}</span>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9375rem', color: 'primary.main', mt: 0.5 }}>
          <span>Total Amount:</span>
          <span>{formatINR(order.total)}</span>
        </Box>
      </Box>

      <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          {settings.receiptFooterText}
        </Typography>
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            border: '2px solid',
            borderColor: order.isPaid ? 'success.main' : 'warning.main',
            color: order.isPaid ? 'success.main' : 'warning.main',
            fontWeight: 800,
            borderRadius: 1,
            letterSpacing: '0.05em',
          }}
        >
          {order.isPaid ? 'PAID — THANK YOU' : 'UNPAID BILL'}
        </Box>
      </Box>
    </Box>
  );
};
