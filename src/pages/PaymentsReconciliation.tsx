import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Chip,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { StatusChip } from '../components/atoms/StatusChip';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { AuditModal } from '../components/organisms/Modals/AuditModal';
import { usePosStore } from '../store/posStore';
import { PaymentTransaction } from '../types/pos';
import { formatINR } from '../utils/formatters';

import { EmptyState } from '../components/atoms/EmptyState';

export const PaymentsReconciliation: React.FC = () => {
  const { payments } = usePosStore();
  const [activeTab, setActiveTab] = useState<'Payments' | 'Reconciliation'>('Reconciliation');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const posSalesTotal = payments.reduce((sum, p) => sum + p.posAmount, 0);
  const bankDepositsTotal = payments.reduce((sum, p) => sum + p.bankAmount, 0);
  const totalDifference = bankDepositsTotal - posSalesTotal;

  const handleTxClick = (tx: PaymentTransaction) => {
    setSelectedTx(tx);
    setAuditModalOpen(true);
  };

  return (
    <MainLayoutTemplate title="Payments & Reconciliation">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Navigation Tabs & Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['Payments', 'Reconciliation'] as const).map((tab) => (
              <CategoryTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              px: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 9999, // Yoko Pill Badge
              fontWeight: 700,
              fontSize: '0.8125rem',
              color: '#0F172A',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 16, color: '#6366F1' }} />
            <span>15 Jun 2026</span>
          </Box>
        </Box>

        {/* Reconciliation Summary Cards */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                POS Sales
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatINR(posSalesTotal)}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                Bank Deposits
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {formatINR(bankDepositsTotal)}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                Difference
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  color: totalDifference < 0 ? '#B91C1C' : '#047857',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {formatINR(Math.abs(totalDifference))}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Paper elevation={1} sx={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Transactions Log
            </Typography>
          </Box>

          {payments.length === 0 ? (
            <EmptyState title="No transactions logged" description="Completed transactions and bank reconciliations will appear here." />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>POS Amount</TableCell>
                    <TableCell>Bank Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((tx) => (
                    <TableRow
                      key={tx.id}
                      hover
                      onClick={() => handleTxClick(tx)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 800, color: '#4338CA' }}>{tx.paymentId}</TableCell>
                      <TableCell>
                        <Chip label={tx.method} size="small" sx={{ backgroundColor: '#EEF2FF', color: '#4338CA', fontWeight: 700, borderRadius: 9999 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0F172A' }}>{formatINR(tx.posAmount)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#0F172A' }}>{formatINR(tx.bankAmount)}</TableCell>
                      <TableCell>
                        <StatusChip status={tx.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <AuditModal
          isOpen={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
          transaction={selectedTx}
        />
      </Box>
    </MainLayoutTemplate>
  );
};
