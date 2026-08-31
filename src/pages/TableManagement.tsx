import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import LocalTakeoutIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useNavigate } from 'react-router-dom';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { FloorPlanGrid } from '../components/organisms/FloorPlanGrid';
import { TableDetailDrawer } from '../components/organisms/TableDetailDrawer';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { usePosStore, posStore } from '../store/posStore';
import { GuestSelectModal } from '../components/organisms/Modals/GuestSelectModal';
import { BillMenuModal } from '../components/organisms/Modals/BillMenuModal';
import { TableItem, Order } from '../types/pos';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const TableManagement: React.FC = () => {
  const navigate = useNavigate();
  const { tables, orders, selectedTableId: storeSelectedTableId } = usePosStore();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(storeSelectedTableId || null);

  // Guest & Bill Modals state
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestTable, setGuestTable] = useState<TableItem | null>(null);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [billOrder, setBillOrder] = useState<Order | null>(null);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const statusCategories = ['All', 'Available', 'Occupied', 'Reserved', 'Paused'];

  const filteredTables = tables.filter((t) => {
    if (selectedStatusFilter === 'All') return true;
    return t.status === selectedStatusFilter;
  });

  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
    const targetTable = tables.find((t) => t.id === tableId);
    if (targetTable) {
      setGuestTable(targetTable);
      setGuestModalOpen(true);
    }
  };

  const handleStartStandaloneOrder = (type: 'Takeaway' | 'Delivery') => {
    posStore.setOrderType(type);
    setToastMsg(`Started standalone ${type} order!`);
    setToastOpen(true);
    setTimeout(() => {
      navigate('/orders');
    }, 150);
  };

  const activeSelectedTable = tables.find((t) => t.id === selectedTableId) || null;

  return (
    <MainLayoutTemplate title="Table & Seating Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        {/* Top Controls & Standalone Takeaway/Delivery Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          {/* Status Filters */}
          <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', pb: 0.5 }}>
            {statusCategories.map((status) => {
              const count =
                status === 'All'
                  ? tables.length
                  : tables.filter((t) => t.status === status).length;
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

          {/* Standalone Takeaway and Delivery Order Buttons (No Table Needed) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleStartStandaloneOrder('Takeaway')}
              startIcon={<LocalTakeoutIcon />}
              sx={{
                borderRadius: 9999,
                fontWeight: 800,
                py: 0.75,
                px: 2,
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                '&:hover': { backgroundColor: '#242424' },
              }}
            >
              🛍️ Takeaway Order
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => handleStartStandaloneOrder('Delivery')}
              startIcon={<DeliveryDiningIcon />}
              sx={{
                borderRadius: 9999,
                fontWeight: 800,
                py: 0.75,
                px: 2,
                backgroundColor: '#06C167',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
                '&:hover': { backgroundColor: '#049851' },
              }}
            >
              🛵 Delivery Order
            </Button>
          </Box>
        </Box>

        {/* Legend Indicator Bar */}
        <Paper
          elevation={1}
          sx={{
            p: 1.25,
            px: 2.5,
            borderRadius: 9999, // Pill style
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEEEEE',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1.5, sm: 2.5 },
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.7rem' }}>
            Table Legend:
          </Typography>

          {[
            { label: 'Available', color: '#06C167', bg: '#E6F9F0' },
            { label: 'Occupied', color: '#000000', bg: '#000000' },
            { label: 'Reserved', color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Paused / Dirty', color: '#E53E3E', bg: '#FED7D7' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${item.color}`,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#545454', fontSize: '0.72rem' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Layout Grid: Floor Plan Graphic + Table Detail Drawer */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <FloorPlanGrid
              tables={filteredTables}
              selectedTableId={selectedTableId}
              onSelectTable={handleSelectTable}
            />
          </Grid>

          {/* Desktop Right Panel */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableDetailDrawer table={activeSelectedTable} />
          </Grid>
        </Grid>

        {/* Table Guest Capacity Selection Modal */}
        <GuestSelectModal
          isOpen={guestModalOpen}
          onClose={() => setGuestModalOpen(false)}
          table={guestTable}
          linkedOrder={orders.find((o) => o.tableId === guestTable?.id && !o.isPaid)}
          onSelectGuest={(seatNum) => {
            if (guestTable) {
              posStore.setSelectedTable(guestTable.id, guestTable.tableName || `Table ${guestTable.number}`);
              posStore.setSelectedSeat(seatNum);
              posStore.setOrderType('Dine In');
              navigate('/orders');
            }
          }}
          onOpenBillMenu={(tbl) => {
            const ord = orders.find((o) => o.tableId === tbl.id && !o.isPaid);
            if (ord) {
              setBillOrder(ord);
              setBillModalOpen(true);
            }
          }}
        />

        {/* Bill Menu Modal */}
        <BillMenuModal
          isOpen={billModalOpen}
          onClose={() => setBillModalOpen(false)}
          order={billOrder}
          onOrderCompleted={() => {
            setToastMsg(`Bill printed and order completed!`);
            setToastOpen(true);
          }}
        />

        <NotificationToast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      </Box>
    </MainLayoutTemplate>
  );
};
