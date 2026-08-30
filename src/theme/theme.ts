import { createTheme } from '@mui/material/styles';

export const posTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Yoko Indigo Accent
      light: '#EEF2FF',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8B5CF6', // Yoko Accent Violet
      light: '#F3E8FF',
      dark: '#6D28D9',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Emerald
      light: '#ECFDF5',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FEF3C7',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F43F5E', // Rose
      light: '#FEE2E2',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#06B6D4', // Cyan
      light: '#E0F2FE',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Yoko Light Space Canvas
      paper: '#FFFFFF',   // Yoko Light Space Card Surface
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 800,
      fontSize: '1.75rem',
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.35rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.15rem',
      lineHeight: 1.35,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 700,
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.03)',
    '0px 4px 14px rgba(15, 23, 42, 0.06)',
    '0px 8px 20px rgba(15, 23, 42, 0.08)',
    '0px 12px 28px rgba(15, 23, 42, 0.10)',
    '0px 16px 36px rgba(15, 23, 42, 0.12)',
    '0px 20px 44px rgba(15, 23, 42, 0.14)',
    ...Array(18).fill('0px 24px 52px rgba(15, 23, 42, 0.16)'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Pill style per Yoko Space System
          fontWeight: 700,
          boxShadow: 'none',
          padding: '8px 20px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#F1F5F9',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            '&:hover': {
              backgroundColor: '#E2E8F0',
              borderColor: 'rgba(99, 102, 241, 0.4)',
            },
          },
        },
        outlined: {
          borderColor: '#E2E8F0',
          color: '#0F172A',
          '&:hover': {
            borderColor: '#6366F1',
            backgroundColor: '#EEF2FF',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.03)',
        },
        elevation2: {
          boxShadow: '0px 4px 14px rgba(15, 23, 42, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 8px 20px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.05)',
          borderRadius: 16,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.75rem',
          borderRadius: 9999, // Yoko Pill Badge
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#64748B',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        body: {
          fontSize: '0.875rem',
          borderBottom: '1px solid #F1F5F9',
          color: '#0F172A',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '& fieldset': {
            borderColor: '#E2E8F0',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(99, 102, 241, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6366F1',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 20px 40px -10px rgba(15, 23, 42, 0.15)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '6px 12px',
        },
        arrow: {
          color: '#0F172A',
        },
      },
    },
  },
});
