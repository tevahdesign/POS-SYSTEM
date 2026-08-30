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
          border: '2px solid #06C167',
          chipBg: '#E6F9F0',
          chipColor: '#06C167',
          glow: '0 4px 14px rgba(6, 193, 103, 0.15)',
        };
      case 'Occupied':
        return {
          bg: '#FFFFFF',
          border: '2px solid #000000',
          chipBg: '#000000',
          chipColor: '#FFFFFF',
          glow: '0 4px 14px rgba(0, 0, 0, 0.15)',
        };
      case 'Reserved':
        return {
          bg: '#FFFFFF',
          border: '2px solid #F59E0B',
          chipBg: '#FEF3C7',
          chipColor: '#C05621',
          glow: '0 4px 14px rgba(245, 158, 11, 0.15)',
        };
      case 'Paused':
        return {
          bg: '#FFFFFF',
          border: '2px solid #E53E3E',
          chipBg: '#FED7D7',
          chipColor: '#E53E3E',
          glow: '0 4px 14px rgba(229, 62, 62, 0.15)',
        };
      default:
        return {
          bg: '#FFFFFF',
          border: '2px solid #CCCCCC',
          chipBg: '#F6F6F6',
          chipColor: '#545454',
          glow: 'none',
        };
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        height: 'auto', // Content-fit dynamic height (No minHeight: 520)
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Floor Layout Overview ({tables.length} Tables)
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {tables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const style = getStatusStyle(table.status);

          return (
            <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={table.id}>
              <Paper
                elevation={isSelected ? 4 : 1}
                onClick={() => onSelectTable(table.id)}
                sx={{
                  p: 1.5,
                  borderRadius: '14px',
                  backgroundColor: style.bg,
                  border: isSelected ? '2.5px solid #06C167' : style.border,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 16px rgba(6, 193, 103, 0.3)' : style.glow,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.02)' : 'none',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {/* Header Table Name & Status Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem' }}>
                    {table.tableName || `Table ${table.number}`}
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.2,
                      borderRadius: 9999,
                      backgroundColor: style.chipBg,
                      color: style.chipColor,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                    }}
                  >
                    {table.status}
                  </Box>
                </Box>

                {/* Table Metrics */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#545454' }}>
                    <PeopleIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                      {table.guestCount ? `${table.guestCount}/${table.seats} Guests` : `${table.seats} Seats`}
                    </Typography>
                  </Box>

                  {table.status === 'Occupied' && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#545454' }}>
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                          {table.startTime || 'Started'}
                        </Typography>
                      </Box>

                      {table.totalAmount !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#06C167', pt: 0.25 }}>
                          <AttachMoneyIcon sx={{ fontSize: 14 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem' }}>
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
