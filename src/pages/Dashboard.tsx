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
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Day');

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        {/* 1st: Sales Overview Chart (Default: Today / Day) */}
        <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE', height: 'auto' }}>
          <LineChart
            data={chartDataByPeriod[chartPeriod]}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            height={160}
          />
        </Paper>

        {/* 2nd: 4 KPI Cards Grid */}
        <Grid container spacing={{ xs: 1.25, sm: 2 }}>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <KpiCard
              title="Today's Sales"
              value={formatINR(44825)}
              change="+12.5%"
              isPositive={true}
              icon={<AttachMoneyIcon />}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <KpiCard
              title="Orders"
              value="128"
              change="+8.0%"
              isPositive={true}
              icon={<ShoppingBagIcon />}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <KpiCard
              title="Average Order"
              value={formatINR(350.2)}
              change="+2.2%"
              isPositive={true}
              icon={<CreditCardIcon />}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <KpiCard
              title="Tips"
              value={formatINR(6207)}
              change="+15.4%"
              isPositive={true}
              icon={<VolunteerActivismIcon />}
            />
          </Grid>
        </Grid>

        {/* 3rd: Recent Orders Table & Top Selling Items / Alerts */}
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {/* Recent Orders Table */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={1} sx={{ p: { xs: 1.75, sm: 2.5 }, borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE', height: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Recent Orders
                </Typography>
                <Button size="small" onClick={() => navigate('/orders')} sx={{ color: '#06C167', fontWeight: 700 }}>
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
                        <TableCell sx={{ fontWeight: 800, color: '#06C167' }}>{order.orderNumber}</TableCell>
                        <TableCell>{order.type}</TableCell>
                        <TableCell>{order.tableName || order.customerName}</TableCell>
                        <TableCell sx={{ color: '#545454' }}>{order.createdAt}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#000000' }}>{formatINR(order.total)}</TableCell>
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

          {/* Top Selling Items & Active Alerts Column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Top Selling Items Card */}
              <Paper elevation={1} sx={{ p: { xs: 1.75, sm: 2.5 }, borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE', height: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Top Selling Items
                  </Typography>
                  <Button size="small" onClick={() => navigate('/menu')} sx={{ color: '#06C167', fontWeight: 700 }}>
                    View all
                  </Button>
                </Box>

                <Divider sx={{ mb: 1.5, borderColor: '#EEEEEE' }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {topItems.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pb: 0.75, borderBottom: '1px solid #F6F6F6' }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: 9999,
                          backgroundColor: '#E6F9F0',
                          color: '#06C167',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }} noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#545454', fontSize: '0.7rem' }}>
                          {item.qty}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem' }}>
                        {item.amount}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Active Alerts Card */}
              <Paper elevation={1} sx={{ p: { xs: 1.75, sm: 2.5 }, borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE', display: 'flex', flexDirection: 'column', height: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Active Alerts
                  </Typography>
                  <Button size="small" onClick={() => navigate('/inventory')} sx={{ color: '#06C167', fontWeight: 700 }}>
                    View inventory
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {alerts.map((alert) => (
                    <Paper
                      key={alert.id}
                      elevation={0}
                      onClick={() => navigate(alert.type === 'stock' ? '/inventory' : '/tables')}
                      sx={{
                        p: 1.25,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        borderRadius: '12px',
                        backgroundColor: '#FEEBC8',
                        border: '1px solid #FBD38D',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#F59E0B',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <WarningAmberIcon sx={{ color: '#C05621', fontSize: 20 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {alert.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#C05621', fontWeight: 600, fontSize: '0.7rem' }}>
                          {alert.subtitle}
                        </Typography>
                      </Box>
                      <ChevronRightIcon sx={{ color: '#C05621', fontSize: 18 }} />
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainLayoutTemplate>
  );
};
