import { createTheme } from '@mui/material/styles';

export const posTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#06C167', // Uber Eats Signature Green
      light: '#E6F9F0',
      dark: '#049851',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#000000', // Uber Jet Black
      light: '#242424',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#06C167',
      light: '#E6F9F0',
      dark: '#049851',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E53E3E',
      light: '#FED7D7',
      dark: '#C53030',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#000000',
      light: '#F6F6F6',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA', // Uber Eats Crisp Background Canvas
      paper: '#FFFFFF',   // Uber Eats Surface Card
    },
    text: {
      primary: '#000000',
      secondary: '#545454',
      disabled: '#9E9E9E',
    },
    divider: '#EEEEEE',
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
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      '@media (max-width:600px)': {
        fontSize: '1.35rem',
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: '1.4rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      '@media (max-width:600px)': {
        fontSize: '1.05rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.05rem',
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '0.95rem',
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: '0.95rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    h6: {
      fontWeight: 700,
      fontSize: '0.84rem',
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
      },
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '0.78rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.8125rem',
      lineHeight: 1.45,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.45,
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
    '0px 2px 8px rgba(0, 0, 0, 0.04)',
    '0px 4px 16px rgba(0, 0, 0, 0.08)',
    '0px 8px 24px rgba(0, 0, 0, 0.10)',
    '0px 12px 32px rgba(0, 0, 0, 0.12)',
    '0px 16px 40px rgba(0, 0, 0, 0.14)',
    '0px 20px 48px rgba(0, 0, 0, 0.16)',
    ...Array(18).fill('0px 24px 56px rgba(0, 0, 0, 0.18)'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Uber Eats Pill Style
          fontWeight: 700,
          boxShadow: 'none',
          padding: '6px 18px',
          minHeight: 38,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '@media (max-width:600px)': {
            minHeight: 44, // Mobile touch target size
            padding: '8px 14px',
            fontSize: '0.78rem',
          },
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 14px rgba(6, 193, 103, 0.3)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#06C167',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(6, 193, 103, 0.3)',
            '&:hover': {
              backgroundColor: '#049851',
              boxShadow: '0 6px 20px rgba(6, 193, 103, 0.45)',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#000000',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#242424',
            },
          },
        },
        outlined: {
          borderColor: '#EEEEEE',
          color: '#000000',
          '&:hover': {
            borderColor: '#06C167',
            backgroundColor: '#E6F9F0',
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
          border: '1px solid #EEEEEE',
          height: 'auto', // Content-fit dynamic height
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #EEEEEE',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
          borderRadius: 16,
          height: 'auto', // Content-fit dynamic card sizing
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(6, 193, 103, 0.5)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.72rem',
          height: 24,
          borderRadius: 9999, // Pill Badge
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
          color: '#545454',
          backgroundColor: '#F6F6F6',
          borderBottom: '1px solid #EEEEEE',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          padding: '8px 12px',
          '@media (max-width:600px)': {
            padding: '6px 8px',
          },
        },
        body: {
          fontSize: '0.8rem',
          borderBottom: '1px solid #F6F6F6',
          color: '#000000',
          padding: '8px 12px',
          '@media (max-width:600px)': {
            padding: '6px 8px',
          },
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
          borderRadius: 9999, // Uber Eats Pill Inputs
          backgroundColor: '#FFFFFF',
          fontSize: '0.8125rem',
          '& fieldset': {
            borderColor: '#EEEEEE',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(6, 193, 103, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#06C167',
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
          boxShadow: '0px 20px 40px -10px rgba(0, 0, 0, 0.15)',
          border: '1px solid #EEEEEE',
          padding: 0,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: '#000000',
          color: '#FFFFFF',
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '4px 10px',
        },
        arrow: {
          color: '#000000',
        },
      },
    },
  },
});
