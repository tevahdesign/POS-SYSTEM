import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Chip,
} from '@mui/material';
import AuditIcon from '@mui/icons-material/FactCheck';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { KpiCard } from '../components/molecules/KpiCard';
import { AuditModal } from '../components/organisms/Modals/AuditModal';
import { formatINR } from '../utils/formatters';
import { usePosStore } from '../store/posStore';

export const PaymentsReconciliation: React.FC = () => {
  const { payments } = usePosStore();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const paymentBatches = [
    { id: 'BATCH-8821', method: 'Cash Drawer', expected: 15400, actual: 15400, diff: 0, status: 'Matched' },
    { id: 'BATCH-8822', method: 'Card Terminal (PineLabs)', expected: 28900, actual: 28900, diff: 0, status: 'Matched' },
    { id: 'BATCH-8823', method: 'UPI / QR Gateway', expected: 18250, actual: 18200, diff: -50, status: 'Difference' },
    { id: 'BATCH-8824', method: 'Zomato / Swiggy Online Payout', expected: 32400, actual: 32400, diff: 0, status: 'Matched' },
  ];

  return (
    <MainLayoutTemplate title="Payments & Shift Reconciliation Audit">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Audit Action Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Shift Drawer Audit & Gateway Reconciliation
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsAuditModalOpen(true)}
            startIcon={<AuditIcon />}
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
            Start Shift Drawer Audit
          </Button>
        </Box>

        {/* 4 Payment Method KPI Cards */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Cash Drawer Total"
              value={formatINR(15400)}
              change="Matched"
              isPositive={true}
              icon={<AccountBalanceWalletIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Card Terminal"
              value={formatINR(28900)}
              change="Matched"
              isPositive={true}
              icon={<CreditCardIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="UPI / QR Code"
              value={formatINR(18200)}
              change="-₹50 Diff"
              isPositive={false}
              icon={<QrCode2Icon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Online Delivery Payouts"
              value={formatINR(32400)}
              change="Matched"
              isPositive={true}
              icon={<CheckCircleIcon />}
            />
          </Grid>
        </Grid>

        {/* Batch Audit Table */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Payment Batch Reconciliation Records
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Batch Reference</TableCell>
                  <TableCell>Payment Channel</TableCell>
                  <TableCell>System Expected</TableCell>
                  <TableCell>Actual Counted</TableCell>
                  <TableCell>Variance / Discrepancy</TableCell>
                  <TableCell align="right">Audit Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentBatches.map((batch) => (
                  <TableRow key={batch.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#06C167', fontFamily: 'monospace' }}>
                      {batch.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#000000' }}>{batch.method}</TableCell>
                    <TableCell sx={{ color: '#545454' }}>{formatINR(batch.expected)}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#000000' }}>{formatINR(batch.actual)}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: batch.diff === 0 ? '#06C167' : '#E53E3E' }}>
                      {batch.diff === 0 ? '₹0 (Exact)' : formatINR(batch.diff)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={batch.status}
                        size="small"
                        sx={{
                          backgroundColor: batch.status === 'Matched' ? '#E6F9F0' : '#FED7D7',
                          color: batch.status === 'Matched' ? '#06C167' : '#E53E3E',
                          fontWeight: 800,
                          borderRadius: 9999,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <AuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          transaction={payments && payments.length > 0 ? payments[0] : null}
        />
      </Box>
    </MainLayoutTemplate>
  );
};
