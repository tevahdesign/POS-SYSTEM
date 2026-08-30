import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TableItem } from '../../types/pos';
import { formatINR } from '../../utils/formatters';

interface FloorPlanGridProps {
  tables: TableItem[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
}

export const FloorPlanGrid: React.FC<FloorPlanGridProps> = ({
  tables,
  selectedTableId,
  onSelectTable,
}) => {
  const getStatusStyle = (status: TableItem['status']) => {
    switch (status) {
      case 'Available':
        return {
          bg: '#FFFFFF',
          border: '2px solid #10B981',
          chipBg: '#ECFDF5',
          chipColor: '#047857',
          glow: '0 4px 14px rgba(16, 185, 129, 0.15)',
        };
      case 'Occupied':
        return {
          bg: '#FFFFFF',
          border: '2px solid #6366F1',
          chipBg: '#EEF2FF',
          chipColor: '#4338CA',
          glow: '0 4px 14px rgba(99, 102, 241, 0.2)',
        };
      case 'Reserved':
        return {
          bg: '#FFFFFF',
          border: '2px solid #F59E0B',
          chipBg: '#FEF3C7',
          chipColor: '#B45309',
          glow: '0 4px 14px rgba(245, 158, 11, 0.15)',
        };
      case 'Paused':
        return {
          bg: '#FFFFFF',
          border: '2px solid #F43F5E',
          chipBg: '#FEE2E2',
          chipColor: '#B91C1C',
          glow: '0 4px 14px rgba(244, 63, 94, 0.15)',
        };
      default:
        return {
          bg: '#FFFFFF',
          border: '2px solid #CBD5E1',
          chipBg: '#F1F5F9',
          chipColor: '#475569',
          glow: 'none',
        };
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        minHeight: 520,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Floor Layout Overview ({tables.length} Tables)
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {tables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const style = getStatusStyle(table.status);

          return (
            <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={table.id}>
              <Paper
                elevation={isSelected ? 4 : 1}
                onClick={() => onSelectTable(table.id)}
                sx={{
                  p: 2,
                  borderRadius: '18px',
                  backgroundColor: style.bg,
                  border: isSelected ? '2.5px solid #6366F1' : style.border,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.3)' : style.glow,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                {/* Header Table Name & Status Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {table.tableName || `Table ${table.number}`}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.25,
                      borderRadius: 9999,
                      backgroundColor: style.chipBg,
                      color: style.chipColor,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    {table.status}
                  </Box>
                </Box>

                {/* Table Metrics */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B' }}>
                    <PeopleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {table.guestCount ? `${table.guestCount}/${table.seats} Guests` : `${table.seats} Seats`}
                    </Typography>
                  </Box>

                  {table.status === 'Occupied' && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B' }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {table.startTime || 'Started'}
                        </Typography>
                      </Box>

                      {table.totalAmount !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4338CA', pt: 0.5 }}>
                          <AttachMoneyIcon sx={{ fontSize: 16 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {formatINR(table.totalAmount)}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};
