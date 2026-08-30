import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { KpiCard } from '../components/molecules/KpiCard';
import { LineChart } from '../components/common/LineChart';
import { formatINR } from '../utils/formatters';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const Reports: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const reportChartData = {
    Day: [
      { label: '8 AM', value: 3100 },
      { label: '11 AM', value: 8900 },
      { label: '2 PM', value: 14500 },
      { label: '5 PM', value: 9800 },
      { label: '8 PM', value: 19500 },
    ],
    Week: [
      { label: 'Mon', value: 42000 },
      { label: 'Tue', value: 38500 },
      { label: 'Wed', value: 51200 },
      { label: 'Thu', value: 46800 },
      { label: 'Fri', value: 68900 },
      { label: 'Sat', value: 74500 },
      { label: 'Sun', value: 61200 },
    ],
    Month: [
      { label: 'Jan', value: 1250000 },
      { label: 'Feb', value: 1420000 },
      { label: 'Mar', value: 1380000 },
      { label: 'Apr', value: 1650000 },
    ],
  };

  const salesBreakdownData = [
    { category: 'Dine-In Sales', orders: 420, revenue: formatINR(147000), avgOrder: formatINR(350) },
    { category: 'Takeaway Orders', orders: 280, revenue: formatINR(84000), avgOrder: formatINR(300) },
    { category: 'Delivery Orders', orders: 190, revenue: formatINR(66500), avgOrder: formatINR(350) },
  ];

  const handleExportCSV = () => {
    setToastMsg('Sales & Tax Report exported as CSV file.');
    setToastOpen(true);
  };

  return (
    <MainLayoutTemplate title="Financial & Sales Analytics Reports">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeIcon sx={{ color: '#06C167' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Reporting Period: Current Shift / Month
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleExportCSV}
            startIcon={<DownloadIcon />}
            sx={{
              px: 3,
              py: 1.1,
              borderRadius: 9999, // Uber Eats Pill Button
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: '#06C167',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
              '&:hover': {
                backgroundColor: '#049851',
              },
            }}
          >
            Export CSV Report
          </Button>
        </Box>

        {/* 4 Financial KPI Cards */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Gross Revenue"
              value={formatINR(383100)}
              change="+14.2%"
              isPositive={true}
              icon={<LocalAtmIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Net Sales (Excl Tax)"
              value={formatINR(364857)}
              change="+13.8%"
              isPositive={true}
              icon={<ReceiptLongIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Total GST Collected"
              value={formatINR(18243)}
              change="+14.0%"
              isPositive={true}
              icon={<RequestQuoteIcon />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              title="Total Completed Orders"
              value="890"
              change="+9.5%"
              isPositive={true}
              icon={<PointOfSaleIcon />}
            />
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <LineChart
            data={reportChartData[chartPeriod]}
            period={chartPeriod}
            onPeriodChange={setChartPeriod}
            height={260}
          />
        </Paper>

        {/* Sales Channel Breakdown Table */}
        <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Sales Channel Breakdown
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fulfillment Channel</TableCell>
                  <TableCell>Order Volume</TableCell>
                  <TableCell>Total Revenue</TableCell>
                  <TableCell>Avg Ticket Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesBreakdownData.map((row) => (
                  <TableRow key={row.category} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {row.category}
                    </TableCell>
                    <TableCell sx={{ color: '#545454' }}>{row.orders} orders</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#06C167', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {row.revenue}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#000000' }}>{row.avgOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <NotificationToast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
    </MainLayoutTemplate>
  );
};
