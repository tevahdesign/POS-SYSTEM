import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
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
    if (isUrgent) return '#FED7D7';
    if (ticket.status === 'Ready') return '#E6F9F0';
    if (ticket.status === 'In-Progress') return '#000000';
    return '#F6F6F6';
  };

  const getHeaderColor = () => {
    if (ticket.status === 'In-Progress') return '#FFFFFF';
    return '#000000';
  };

  const getBorderColor = () => {
    if (isUrgent) return '#E53E3E';
    if (ticket.status === 'Ready') return '#06C167';
    if (ticket.status === 'In-Progress') return '#000000';
    return '#EEEEEE';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: `2px solid ${getBorderColor()}`,
        display: 'flex',
        flexDirection: 'column',
        height: 'auto', // Content-fit dynamic height
        boxShadow: isUrgent ? '0 4px 16px rgba(229, 62, 62, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.25,
          backgroundColor: getHeaderBg(),
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: getHeaderColor(), fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem' }}>
            {ticket.orderNumber}
          </Typography>
          <Typography variant="caption" sx={{ color: ticket.status === 'In-Progress' ? '#CCCCCC' : '#545454', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600, fontSize: '0.7rem' }}>
            <TableRestaurantIcon sx={{ fontSize: 13 }} /> {ticket.tableName || 'Takeaway'}
          </Typography>
        </Box>

        {/* Timer Chip Badge */}
        <Chip
          icon={isUrgent ? <PriorityHighIcon sx={{ fontSize: '13px !important', color: '#C53030' }} /> : <AccessTimeIcon sx={{ fontSize: '13px !important' }} />}
          label={`${elapsedMinutes}m`}
          size="small"
          sx={{
            backgroundColor: isUrgent ? '#FED7D7' : ticket.status === 'In-Progress' ? '#242424' : '#E6F9F0',
            color: isUrgent ? '#C53030' : ticket.status === 'In-Progress' ? '#FFFFFF' : '#06C167',
            fontWeight: 800,
            border: `1px solid ${isUrgent ? '#FEB2B2' : ticket.status === 'In-Progress' ? '#333333' : '#A3E9C5'}`,
            borderRadius: 9999,
            height: 22,
            fontSize: '0.68rem',
          }}
        />
      </Box>

      {/* Item List */}
      <Box sx={{ p: 1.25, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {ticket.items.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 0.6,
              borderRadius: '8px',
              backgroundColor: '#FAFAFA',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem' }}>
                {item.quantity}x {item.name}
              </Typography>
              {item.modifiers && item.modifiers.length > 0 && (
                <Typography variant="caption" sx={{ color: '#06C167', display: 'block', fontSize: '0.65rem' }}>
                  + {item.modifiers.join(', ')}
                </Typography>
              )}
              {item.notes && (
                <Typography variant="caption" sx={{ color: '#C05621', fontWeight: 600, display: 'block', fontSize: '0.65rem' }}>
                  Note: {item.notes}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: '#EEEEEE' }} />

      {/* Footer Action Button */}
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          disabled={ticket.status === 'Ready'}
          onClick={handleAdvanceStatus}
          startIcon={ticket.status === 'Ready' ? <CheckCircleIcon /> : undefined}
          sx={{
            py: 0.75,
            borderRadius: 9999, // Uber Eats Pill Button
            fontWeight: 800,
            fontSize: '0.75rem',
            minHeight: 34,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundColor:
              ticket.status === 'New'
                ? '#06C167'
                : ticket.status === 'In-Progress'
                ? '#000000'
                : '#06C167',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor:
                ticket.status === 'New'
                  ? '#049851'
                  : ticket.status === 'In-Progress'
                  ? '#242424'
                  : '#049851',
            },
          }}
        >
          {ticket.status === 'New'
            ? 'Start Prep'
            : ticket.status === 'In-Progress'
            ? 'Mark Ready'
            : 'Ticket Ready'}
        </Button>
      </Box>
    </Paper>
  );
};
