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
        p: 1.25, // Compact 10px padding
        display: 'flex',
        flexDirection: 'column',
        height: 'auto', // Content-fit dynamic height
        cursor: 'pointer',
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEEEE',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          borderColor: 'rgba(6, 193, 103, 0.5)',
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
        <IconButton
          size="small"
          aria-label={`View details for ${product.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #EEEEEE',
            p: 0.4,
            color: '#545454',
            '&:hover': {
              backgroundColor: '#FFFFFF',
              color: '#000000',
            },
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 14 }} />
        </IconButton>
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
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem' }}>
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
              backgroundColor: '#06C167',
              color: '#FFFFFF',
              borderRadius: 9999, // Pill Button
              width: 30,
              height: 30,
              boxShadow: '0 2px 8px rgba(6, 193, 103, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#049851',
                boxShadow: '0 4px 14px rgba(6, 193, 103, 0.45)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};
