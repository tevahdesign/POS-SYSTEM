import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { KdsTicketCard } from '../components/organisms/KdsTicketCard';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { StockAdjustModal } from '../components/organisms/Modals/StockAdjustModal';
import { usePosStore } from '../store/posStore';
import { EmptyState } from '../components/atoms/EmptyState';

export const KitchenDisplay: React.FC = () => {
  const { kitchenTickets } = usePosStore();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const statusCategories = ['All', 'New', 'In-Progress', 'Ready'];

  const filteredTickets = kitchenTickets.filter((ticket) => {
    if (selectedStatusFilter === 'All') return true;
    return ticket.status === selectedStatusFilter;
  });

  return (
    <MainLayoutTemplate title="Kitchen Display System (KDS)">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {/* Status Filter Tabs */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
            {statusCategories.map((status) => {
              const count =
                status === 'All'
                  ? kitchenTickets.length
                  : kitchenTickets.filter((t) => t.status === status).length;
              return (
                <CategoryTab
                  key={status}
                  label={status}
                  active={selectedStatusFilter === status}
                  onClick={() => setSelectedStatusFilter(status)}
                  count={count}
                />
              );
            })}
          </Box>

          <Button
            variant="outlined"
            color="warning"
            onClick={() => setIsStockModalOpen(true)}
            startIcon={<WarningAmberIcon />}
            sx={{
              borderRadius: 9999,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: '#FEF3C7',
              borderColor: '#FDE68A',
              color: '#B45309',
              '&:hover': {
                backgroundColor: '#FDE68A',
              },
            }}
          >
            Kitchen Stock Alert
          </Button>
        </Box>

        {/* KDS Column Header Summary Bar */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SoupKitchenIcon sx={{ color: '#6366F1' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Active Prep Stream ({filteredTickets.length} Orders Pending)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              Avg Prep Time: <strong>12 mins</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
              Urgent Tickets (&gt;15m): <strong>{kitchenTickets.filter((t) => (Date.now() - t.timestamp) / 60000 > 15 && t.status !== 'Ready').length}</strong>
            </Typography>
          </Box>
        </Paper>

        {/* KDS Ticket Cards Grid */}
        {filteredTickets.length === 0 ? (
          <EmptyState
            title="No kitchen tickets"
            description="Active kitchen tickets dispatched from POS order entry will stream here in real-time."
          />
        ) : (
          <Grid container spacing={2.5}>
            {filteredTickets.map((ticket) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ticket.id}>
                <KdsTicketCard ticket={ticket} />
              </Grid>
            ))}
          </Grid>
        )}

        <StockAdjustModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          ingredient={null}
        />
      </Box>
    </MainLayoutTemplate>
  );
};
