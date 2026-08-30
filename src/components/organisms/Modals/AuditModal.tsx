import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Divider,
} from '@mui/material';
import { PaymentTransaction } from '../../../types/pos';
import { posStore } from '../../../store/posStore';
import { formatINR } from '../../../utils/formatters';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, transaction }) => {
  const [bankAmount, setBankAmount] = useState('');
  const [auditNote, setAuditNote] = useState('');

  if (!transaction) return null;

  const handleResolve = () => {
    const updatedBank = parseFloat(bankAmount) || transaction.posAmount;
    const diff = Number((updatedBank - transaction.posAmount).toFixed(2));
    const newStatus = diff === 0 ? 'Matched' : 'Difference';

    const state = posStore.getState();
    const updatedPayments = state.payments.map((p) => {
      if (p.id === transaction.id) {
        return {
          ...p,
          bankAmount: updatedBank,
          difference: diff,
          status: newStatus as any,
        };
      }
      return p;
    });

    state.payments = updatedPayments;
    posStore.setCurrentUser(state.currentUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        Reconcile Transaction: {transaction.paymentId}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Payment ID:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{transaction.paymentId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Method:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{transaction.method}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>POS Sales Amount:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatINR(transaction.posAmount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Current Bank Amount:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatINR(transaction.bankAmount)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>Discrepancy:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>{formatINR(transaction.difference)}</Typography>
            </Box>
          </Paper>

          <TextField
            fullWidth
            type="number"
            slotProps={{ htmlInput: { step: '0.01' } }}
            label="Corrected Bank Deposit Amount (₹)"
            defaultValue={transaction.posAmount}
            onChange={(e) => setBankAmount(e.target.value)}
          />

          <TextField
            fullWidth
            label="Audit Reason / Note"
            placeholder="e.g. Card terminal batch fee adjustment"
            value={auditNote}
            onChange={(e) => setAuditNote(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleResolve} variant="contained" color="primary">
          Resolve Discrepancy
        </Button>
      </DialogActions>
    </Dialog>
  );
};
