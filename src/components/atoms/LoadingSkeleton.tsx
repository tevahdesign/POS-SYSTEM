import React from 'react';
import { Box, Skeleton, Grid, Paper } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'table' | 'cards' | 'chart';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'cards',
  count = 4,
}) => {
  if (variant === 'cards') {
    return (
      <Grid container spacing={2.5}>
        {Array.from({ length: count }).map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={36} sx={{ my: 1, borderRadius: 1 }} />
              <Skeleton variant="text" width="40%" height={16} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'table') {
    return (
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Skeleton variant="rectangular" width="100%" height={32} sx={{ borderRadius: 1 }} />
          {Array.from({ length: count }).map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" width="100%" height={44} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1 }} />
    </Paper>
  );
};
