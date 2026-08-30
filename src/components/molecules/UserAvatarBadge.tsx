import React from 'react';
import { Box, Avatar, Typography, Chip } from '@mui/material';

interface UserAvatarBadgeProps {
  name: string;
  role: string;
  avatar: string;
  onClick?: () => void;
}

export const UserAvatarBadge: React.FC<UserAvatarBadgeProps> = ({ name, role, avatar, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 0.75,
        px: 1.5,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        '&:hover': onClick ? { borderColor: 'primary.main', backgroundColor: '#FFF7ED' } : {},
      }}
    >
      <Avatar src={avatar} alt={name} sx={{ width: 32, height: 32, border: '1px solid #E2E8F0' }} />
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', lineHeight: 1.2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8125rem', color: 'text.primary' }}>
          {name}
        </Typography>
        <Chip
          label={role}
          size="small"
          sx={{
            height: 16,
            fontSize: '0.625rem',
            fontWeight: 700,
            mt: 0.25,
            backgroundColor: role === 'Owner' || role === 'Manager' ? 'primary.light' : '#F1F5F9',
            color: role === 'Owner' || role === 'Manager' ? 'primary.dark' : 'text.secondary',
          }}
        />
      </Box>
    </Box>
  );
};
