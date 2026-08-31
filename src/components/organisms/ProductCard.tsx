import React from 'react';
import { Card, CardMedia, Box, Typography, Chip } from '@mui/material';
import { Product } from '../../types/pos';
import { formatINR } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddDirect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const hasModifiers = product.modifierGroups && product.modifierGroups.length > 0;

  return (
    <Card
      onClick={() => onSelect(product)}
      sx={{
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        cursor: 'pointer',
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          borderColor: '#06C167',
        },
      }}
    >
      {/* Product Image Container */}
      <Box sx={{ position: 'relative', width: '100%', pt: '50%', borderRadius: '10px', overflow: 'hidden', mb: 1, backgroundColor: '#F6F6F6' }}>
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
        {hasModifiers && (
          <Chip
            label="Customizable"
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 800,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: '#FFFFFF',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </Box>

      {/* Product Details */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.8125rem',
            color: '#000000',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1.25,
            mb: 0.75,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#06C167', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem' }}>
            {formatINR(product.price)}
          </Typography>

          <Typography variant="caption" sx={{ color: '#8E8E8E', fontWeight: 600, fontSize: '0.7rem' }}>
            {hasModifiers ? 'Options >' : 'Select >'}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
