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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        {/* Top Controls Bar */}
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
      </Box>
    </MainLayoutTemplate>
  );
};
