import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import { KitchenTicket } from '../../types/pos';
import { posStore } from '../../store/posStore';

interface KdsTicketCardProps {
  ticket: KitchenTicket;
}

export const KdsTicketCard: React.FC<KdsTicketCardProps> = ({ ticket }) => {
  const elapsedMinutes = Math.floor((Date.now() - ticket.timestamp) / 60000);
  const isUrgent = elapsedMinutes > 15 && ticket.status !== 'Ready';

  const handleAdvanceStatus = () => {
    if (ticket.status === 'New') {
      posStore.updateTicketStatus(ticket.id, 'In-Progress');
    } else if (ticket.status === 'In-Progress') {
      posStore.updateTicketStatus(ticket.id, 'Ready');
    }
  };

  const getHeaderBg = () => {
    if (isUrgent) return '#FEE2E2';
    if (ticket.status === 'Ready') return '#ECFDF5';
    if (ticket.status === 'In-Progress') return '#EEF2FF';
    return '#F8FAFC';
  };

  const getBorderColor = () => {
    if (isUrgent) return '#F43F5E';
    if (ticket.status === 'Ready') return '#10B981';
    if (ticket.status === 'In-Progress') return '#6366F1';
    return '#E2E8F0';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: '18px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: `2px solid ${getBorderColor()}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: isUrgent ? '0 4px 16px rgba(244, 63, 94, 0.2)' : '0 1px 3px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.75,
          backgroundColor: getHeaderBg(),
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {ticket.orderNumber}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
            <TableRestaurantIcon sx={{ fontSize: 14 }} /> {ticket.tableName || 'Takeaway'}
          </Typography>
        </Box>

        {/* Timer Chip Badge */}
        <Chip
          icon={isUrgent ? <PriorityHighIcon sx={{ fontSize: '14px !important', color: '#B91C1C' }} /> : <AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
          label={`${elapsedMinutes}m`}
          size="small"
          sx={{
            backgroundColor: isUrgent ? '#FEE2E2' : '#EEF2FF',
            color: isUrgent ? '#B91C1C' : '#4338CA',
            fontWeight: 800,
            border: `1px solid ${isUrgent ? '#FECACA' : '#C7D2FE'}`,
            borderRadius: 9999,
          }}
        />
      </Box>

      {/* Item List */}
      <Box sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {ticket.items.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 0.75,
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.quantity}x {item.name}
              </Typography>
              {item.modifiers && item.modifiers.length > 0 && (
                <Typography variant="caption" sx={{ color: '#6366F1', display: 'block', fontSize: '0.7rem' }}>
                  + {item.modifiers.join(', ')}
                </Typography>
              )}
              {item.notes && (
                <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 600, display: 'block' }}>
                  Note: {item.notes}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: '#E2E8F0' }} />

      {/* Footer Action Button */}
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={ticket.status === 'Ready'}
          onClick={handleAdvanceStatus}
          startIcon={ticket.status === 'Ready' ? <CheckCircleIcon /> : undefined}
          sx={{
            py: 1,
            borderRadius: 9999, // Yoko Pill Button
            fontWeight: 800,
            fontSize: '0.8125rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background:
              ticket.status === 'New'
                ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                : ticket.status === 'In-Progress'
                ? '#F59E0B'
                : '#10B981',
            color: '#FFFFFF',
          }}
        >
          {ticket.status === 'New'
            ? 'Start Preparation'
            : ticket.status === 'In-Progress'
            ? 'Mark Order Ready'
            : 'Ticket Ready'}
        </Button>
      </Box>
    </Paper>
  );
};
