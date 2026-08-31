import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface KeyboardAlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

export const KeyboardAlphabetFilter: React.FC<KeyboardAlphabetFilterProps> = ({
  selectedLetter,
  onSelectLetter,
}) => {
  const rows = [
    ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
    ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        p: 1.25,
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: '#545454',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          🔤 Alphabet Search (Click key to filter)
        </Typography>
        {selectedLetter !== 'ALL' && selectedLetter !== 'All' && (
          <Button
            size="small"
            onClick={() => onSelectLetter('ALL')}
            sx={{
              py: 0,
              px: 1,
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#E53E3E',
              textTransform: 'none',
            }}
          >
            Clear Filter ({selectedLetter})
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        {rows.map((row, rIdx) => (
          <Box
            key={rIdx}
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${row.length}, 1fr)`,
              gap: { xs: 0.4, sm: 0.6 },
              width: '100%',
            }}
          >
            {row.map((letter) => {
              const isActive =
                selectedLetter === letter ||
                (letter === 'ALL' && (selectedLetter === 'All' || selectedLetter === 'ALL'));

              return (
                <Button
                  key={letter}
                  size="small"
                  onClick={() => onSelectLetter(letter === 'ALL' ? 'All' : letter)}
                  sx={{
                    minWidth: 0,
                    height: { xs: 30, sm: 34 },
                    p: 0,
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: { xs: '0.72rem', sm: '0.8rem' },
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: isActive ? '#06C167' : '#F6F6F6',
                    color: isActive ? '#FFFFFF' : '#333333',
                    border: `1px solid ${isActive ? '#06C167' : '#E0E0E0'}`,
                    boxShadow: isActive ? '0 3px 10px rgba(6, 193, 103, 0.3)' : 'none',
                    transition: 'all 0.15s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive ? '#049851' : '#EFEFEF',
                      transform: 'translateY(-1px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {letter}
                </Button>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
