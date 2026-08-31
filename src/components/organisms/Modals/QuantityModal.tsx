import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { Product } from '../../../types/pos';
import { formatINR } from '../../../utils/formatters';
import { posStore } from '../../../store/posStore';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm?: (product: Product, quantity: number, notes: string, seatNumber?: number) => void;
  currentSeat?: number;
}

export const QuantityModal: React.FC<QuantityModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  currentSeat = 1,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<number>(currentSeat);

  if (!product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (onConfirm) {
      onConfirm(product, quantity, notes, selectedSeat);
    } else {
      posStore.addToCart(product, [], quantity, notes, selectedSeat);
    }
    setQuantity(1);
    setNotes('');
    onClose();
  };

  const total = Number((product.price * quantity).toFixed(2));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            backgroundColor: '#FFFFFF',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Select Quantity
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#545454' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#EEEEEE', py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Product Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid #EEEEEE',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {product.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#06C167' }}>
                {formatINR(product.price)} each
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Seat Tagging Selection */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000', fontSize: '0.8rem' }}>
              Assign to Guest / Seat:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4].map((seat) => (
                <Button
                  key={seat}
                  variant={selectedSeat === seat ? 'contained' : 'outlined'}
                  onClick={() => setSelectedSeat(seat)}
                  sx={{
                    borderRadius: 9999,
                    minWidth: 40,
                    height: 36,
                    fontWeight: 700,
                    backgroundColor: selectedSeat === seat ? '#000000' : 'transparent',
                    color: selectedSeat === seat ? '#FFFFFF' : '#000000',
                    borderColor: '#EEEEEE',
                  }}
                >
                  Guest #{seat}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Stepper Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F6F6F6', p: 1.5, borderRadius: '14px' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#000000' }}>
              Quantity:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={handleDecrease}
                disabled={quantity <= 1}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EEEEEE',
                  color: '#000000',
                  '&:hover': { backgroundColor: '#EEEEEE' },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 800, minWidth: 28, textAlign: 'center', color: '#000000' }}>
                {quantity}
              </Typography>
              <IconButton
                onClick={handleIncrease}
                sx={{
                  backgroundColor: '#06C167',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#049851' },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Select Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[1, 2, 3, 5, 10].map((num) => (
              <Button
                key={num}
                variant={quantity === num ? 'contained' : 'outlined'}
                onClick={() => setQuantity(num)}
                sx={{
                  borderRadius: 9999,
                  minWidth: 38,
                  height: 32,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  backgroundColor: quantity === num ? '#06C167' : 'transparent',
                  color: quantity === num ? '#FFFFFF' : '#000000',
                  borderColor: '#EEEEEE',
                }}
              >
                {num}x
              </Button>
            ))}
          </Box>

          {/* Special Instructions Note */}
          <TextField
            fullWidth
            size="small"
            label="Special Instructions / Kitchen Note"
            placeholder="e.g. Extra spicy, no onions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          startIcon={<ShoppingBagIcon />}
          sx={{
            py: 1.25,
            borderRadius: 9999,
            fontWeight: 800,
            backgroundColor: '#06C167',
            color: '#FFFFFF',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            '&:hover': { backgroundColor: '#049851' },
          }}
        >
          Add {quantity}x to Cart • {formatINR(total)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
