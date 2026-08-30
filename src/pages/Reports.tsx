import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { KpiCard } from '../components/molecules/KpiCard';
import { LineChart } from '../components/common/LineChart';
import { formatINR } from '../utils/formatters';

import { NotificationToast } from '../components/atoms/NotificationToast';

export const Reports: React.FC = () => {
  const [activeReportTab, setActiveReportTab] = useState<string>('Sales Summary');
  const [chartPeriod, setChartPeriod] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const reportTabs = [
    'Sales Summary',
    'Item Sales',
    'Category Sales',
    'Payment Summary',
    'Labor Report',
    'Inventory Report',
  ];

  const salesTrendData = [
    { label: '07 Jun', value: 34000 },
    { label: '08 Jun', value: 41000 },
    { label: '09 Jun', value: 38500 },
    { label: '10 Jun', value: 52000 },
    { label: '11 Jun', value: 44820 },
    { label: '12 Jun', value: 49000 },
    { label: '13 Jun', value: 53000 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Date,Sales,Orders,AvgOrder\n07 Jun,34000,110,309.00\n08 Jun,41000,125,328.00\n09 Jun,38500,118,326.20\n10 Jun,52000,145,358.60\n11 Jun,44820,128,350.20\n12 Jun,49000,140,350.00\n13 Jun,53000,150,353.30';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMsg(`Exported "${activeReportTab}" report as CSV successfully.`);
    setToastOpen(true);
  };

  return (
    <MainLayoutTemplate title="Reports & Analytics">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarTodayIcon sx={{ color: '#6366F1' }} />}
            sx={{ borderRadius: 9999, borderColor: '#E2E8F0', color: '#0F172A', fontWeight: 600, backgroundColor: '#FFFFFF' }}
          >
            07 Jun 2026 - 13 Jun 2026
          </Button>

          <Button
            variant="contained"
            onClick={handleExportCSV}
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 9999, // Yoko Pill
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            Export CSV / PDF
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {/* Left Vertical Sub-Navigation Tabs */}
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {reportTabs.map((tab) => {
                const isActive = activeReportTab === tab;
                return (
                  <Button
                    key={tab}
                    fullWidth
                    onClick={() => setActiveReportTab(tab)}
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                      py: 1.1,
                      borderRadius: 9999, // Yoko Pill Tab
                      fontWeight: isActive ? 800 : 600,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                      '&:hover': {
                        background: isActive ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#F1F5F9',
                        color: isActive ? '#FFFFFF' : '#0F172A',
                      },
                    }}
                  >
                    {tab}
                  </Button>
                );
              })}
            </Paper>
          </Grid>

          {/* Right Content Body */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Summary KPI Cards Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard
                    title="Total Sales"
                    value={formatINR(284507)}
                    change="+12.5%"
                    isPositive={true}
                    icon={<AttachMoneyIcon />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard
                    title="Total Orders"
                    value="856"
                    change="+10.2%"
                    isPositive={true}
                    icon={<ShoppingBagIcon />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard
                    title="Average Order"
                    value={formatINR(332.4)}
                    change="+4.8%"
                    isPositive={true}
                    icon={<CreditCardIcon />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard
                    title="Total Tips"
                    value={formatINR(41255)}
                    change="+11.2%"
                    isPositive={true}
                    icon={<VolunteerActivismIcon />}
                  />
                </Grid>
              </Grid>

              {/* Sales Trend Chart Card */}
              <Paper elevation={1} sx={{ p: 3, borderRadius: '20px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Sales Trend ({activeReportTab})
                </Typography>
                <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />
                <LineChart
                  data={salesTrendData}
                  period={chartPeriod}
                  onPeriodChange={setChartPeriod}
                  height={250}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <NotificationToast
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </MainLayoutTemplate>
  );
};
