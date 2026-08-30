import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Divider,
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { KpiCard } from '../components/molecules/KpiCard';
import { StatusChip } from '../components/atoms/StatusChip';
import { LineChart } from '../components/common/LineChart';
import { usePosStore } from '../store/posStore';
import { formatINR } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, alerts } = usePosStore();
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');

  const chartDataByPeriod = {
    Day: [
      { label: '8 AM', value: 2400 },
      { label: '10 AM', value: 5800 },
      { label: '12 PM', value: 12500 },
      { label: '2 PM', value: 9200 },
      { label: '4 PM', value: 6400 },
      { label: '6 PM', value: 14500 },
      { label: '8 PM', value: 18200 },
    ],
    Week: [
      { label: '07 Jun', value: 31000 },
      { label: '08 Jun', value: 42000 },
      { label: '09 Jun', value: 38000 },
      { label: '10 Jun', value: 51000 },
      { label: '11 Jun', value: 44820 },
      { label: '12 Jun', value: 49000 },
      { label: '13 Jun', value: 53000 },
    ],
    Month: [
      { label: 'Week 1', value: 245000 },
      { label: 'Week 2', value: 289000 },
      { label: 'Week 3', value: 312000 },
      { label: 'Week 4', value: 298000 },
    ],
  };

  const topItems = [
    { name: 'Margherita Pizza', amount: formatINR(15705), qty: '45 sold' },
    { name: 'Alfredo Pasta', amount: formatINR(10528), qty: '32 sold' },
    { name: 'Caesar Salad', amount: formatINR(9160), qty: '40 sold' },
    { name: 'BBQ Burger', amount: formatINR(6975), qty: '25 sold' },
    { name: 'Choco Lava Cake', amount: formatINR(6265), qty: '35 sold' },
  ];

  return (
    <MainLayoutTemplate title="Dashboard Overview">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Quick Action Shortcuts (Yoko Pill Format) */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/orders')}
              startIcon={<AddCircleOutlinedIcon />}
              sx={{
                py: 1.5,
                borderRadius: 9999, // Yoko Pill
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                },
              }}
            >
              New Order
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/tables')}
              startIcon={<TableRestaurantIcon />}
              sx={{
                py: 1.5,
                borderRadius: 9999,
                fontWeight: 700,
                color: '#0F172A',
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                '&:hover': {
                  borderColor: '#6366F1',
                  backgroundColor: '#EEF2FF',
                },
              }}
            >
              Floor Plan
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/kitchen')}
              startIcon={<SoupKitchenIcon />}
              sx={{
                py: 1.5,
                borderRadius: 9999,
                fontWeight: 700,
                color: '#0F172A',
                borderColor: '#E2E8F0',
                backgroundColor: '#FFFFFF',
                '&:hover': {
                  borderColor: '#6366F1',
                  backgroundColor: '#EEF2FF',
                },
              }}
            >
              KDS Prep
            </Button>
          </Grid>
        </Grid>

        {/* 4 KPI Cards Grid */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Today's Sales"
              value={formatINR(44825)}
              change="+12.5%"
              isPositive={true}
              icon={<AttachMoneyIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Orders"
              value="128"
              change="+8.0%"
              isPositive={true}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Average Order"
              value={formatINR(350.2)}
              change="+2.2%"
              isPositive={true}
              icon={<CreditCardIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Tips"
              value={formatINR(6207)}
              change="+15.4%"
              isPositive={true}
              icon={<VolunteerActivismIcon />}
            />
          </Grid>
        </Grid>

        {/* Sales Overview & Top Items */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', height: '100%' }}>
              <LineChart
                data={chartDataByPeriod[chartPeriod]}
                period={chartPeriod}
                onPeriodChange={setChartPeriod}
                height={230}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Top Selling Items
                </Typography>
                <Button size="small" onClick={() => navigate('/menu')} sx={{ color: '#6366F1', fontWeight: 700 }}>
                  View all
                </Button>
              </Box>

              <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {topItems.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, borderBottom: '1px solid #F1F5F9' }}>
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: 9999,
                        backgroundColor: '#EEF2FF',
                        color: '#4338CA',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {item.qty}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.amount}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Orders Table & Alerts */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Recent Orders
                </Typography>
                <Button size="small" onClick={() => navigate('/orders')} sx={{ color: '#6366F1', fontWeight: 700 }}>
                  View all orders
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Order Type</TableCell>
                      <TableCell>Table / Customer</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 5).map((order) => (
                      <TableRow
                        key={order.id}
                        hover
                        onClick={() => navigate('/orders')}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell sx={{ fontWeight: 800, color: '#4338CA' }}>{order.orderNumber}</TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell>{order.tableName || order.customerName}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{order.createdAt}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#0F172A' }}>{formatINR(order.total)}</TableCell>
                        <TableCell>
                          <StatusChip status={order.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Active Alerts
                </Typography>
                <Button size="small" onClick={() => navigate('/inventory')} sx={{ color: '#6366F1', fontWeight: 700 }}>
                  View inventory
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {alerts.map((alert) => (
                  <Paper
                    key={alert.id}
                    elevation={0}
                    onClick={() => navigate(alert.type === 'stock' ? '/inventory' : '/tables')}
                    sx={{
                      p: 1.75,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderRadius: '14px',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#F59E0B',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    <WarningAmberIcon sx={{ color: '#B45309', fontSize: 22 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 600 }}>
                        {alert.subtitle}
                      </Typography>
                    </Box>
                    <ChevronRightIcon sx={{ color: '#B45309', fontSize: 20 }} />
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayoutTemplate>
  );
};
