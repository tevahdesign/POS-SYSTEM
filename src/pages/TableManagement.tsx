import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Grid,
} from '@mui/material';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { FloorPlanGrid } from '../components/organisms/FloorPlanGrid';
import { TableDetailDrawer } from '../components/organisms/TableDetailDrawer';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { usePosStore } from '../store/posStore';

export const TableManagement: React.FC = () => {
  const { tables, selectedTableId: storeSelectedTableId } = usePosStore();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(storeSelectedTableId || null);

  const statusCategories = ['All', 'Available', 'Occupied', 'Reserved', 'Paused'];

  const filteredTables = tables.filter((t) => {
    if (selectedStatusFilter === 'All') return true;
    return t.status === selectedStatusFilter;
  });

  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
  };

  const activeSelectedTable = tables.find((t) => t.id === selectedTableId) || null;

  return (
    <MainLayoutTemplate title="Table & Seating Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          {/* Status Filters */}
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
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
        </Box>

        {/* Legend Indicator Bar */}
        <Paper
          elevation={1}
          sx={{
            p: 1.75,
            px: 3,
            borderRadius: 9999, // Pill style
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Table Legend:
          </Typography>

          {[
            { label: 'Available', color: '#10B981', bg: '#ECFDF5' },
            { label: 'Occupied', color: '#6366F1', bg: '#EEF2FF' },
            { label: 'Reserved', color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Paused / Dirty', color: '#F43F5E', bg: '#FEE2E2' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  backgroundColor: item.color,
                  boxShadow: `0 0 6px ${item.color}`,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Layout Grid: Floor Plan Graphic + Table Detail Drawer */}
        <Grid container spacing={2.5}>
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
      </Box>
    </MainLayoutTemplate>
  );
};
