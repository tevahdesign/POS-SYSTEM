import React from 'react';
import { Card, CardMedia, Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Product } from '../../types/pos';
import { formatINR } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddDirect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddDirect }) => {
  return (
    <Card
      onClick={() => onSelect(product)}
      sx={{
        p: 1.75,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
          borderColor: 'rgba(99, 102, 241, 0.4)',
        },
      }}
    >
      {/* Product Image Container */}
      <Box sx={{ position: 'relative', width: '100%', pt: '65%', borderRadius: '12px', overflow: 'hidden', mb: 1.5, backgroundColor: '#F1F5F9' }}>
        <CardMedia
          component="img"
          image={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.06)',
            },
          }}
        />
        <IconButton
          size="small"
          aria-label={`View details for ${product.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #E2E8F0',
            p: 0.5,
            color: '#64748B',
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
            },
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Product Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#0F172A',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {formatINR(product.price)}
          </Typography>

          <IconButton
            size="small"
            aria-label={`Add ${product.name} to order`}
            onClick={(e) => {
              e.stopPropagation();
              onAddDirect(product);
            }}
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              borderRadius: 9999, // Yoko Pill Button
              width: 32,
              height: 32,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
