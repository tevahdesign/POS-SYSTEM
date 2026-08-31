import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
  Avatar,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import { Product, ModifierOption } from '../../../types/pos';
import { formatINR } from '../../../utils/formatters';
import { posStore } from '../../../store/posStore';

interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (
    product: Product,
    selectedModifiers: ModifierOption[],
    quantity: number,
    notes?: string
  ) => void;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<ModifierOption[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes('');
      const defaults: ModifierOption[] = [];
      product.modifierGroups?.forEach((group) => {
        if (group.required && group.options.length > 0) {
          defaults.push(group.options[0]);
        }
      });
      setSelectedModifiers(defaults);
    }
  }, [product]);

  if (!product) return null;

  const toggleOption = (
    groupRequired: boolean,
    groupOptions: ModifierOption[],
    option: ModifierOption
  ) => {
    if (groupRequired) {
      const filtered = selectedModifiers.filter((m) => !groupOptions.some((opt) => opt.id === m.id));
      setSelectedModifiers([...filtered, option]);
    } else {
      const exists = selectedModifiers.some((m) => m.id === option.id);
      if (exists) {
        setSelectedModifiers(selectedModifiers.filter((m) => m.id !== option.id));
      } else {
        setSelectedModifiers([...selectedModifiers, option]);
      }
    }
  };

  const extraTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
  const unitPrice = product.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedModifiers, quantity, notes);
    } else {
      posStore.addToCart(product, selectedModifiers, quantity, notes);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>{product.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* Product Hero */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pb: 2, borderBottom: '1px solid #E2E8F0' }}>
            <Avatar src={product.image} alt={product.name} variant="rounded" sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                {product.description || 'Delicious freshly prepared item.'}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Base Price: {formatINR(product.price)}
              </Typography>
            </Box>
          </Box>

          {/* Modifier Groups */}
          {product.modifierGroups?.map((group) => (
            <Box key={group.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {group.name}
                </Typography>
                {group.required ? (
                  <Chip label="Required" size="small" color="error" sx={{ height: 18, fontSize: '0.625rem', fontWeight: 800 }} />
                ) : (
                  <Chip label="Optional" size="small" sx={{ height: 18, fontSize: '0.625rem', backgroundColor: '#F1F5F9' }} />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {group.options.map((opt) => {
                  const isSelected = selectedModifiers.some((m) => m.id === opt.id);
                  return (
                    <Paper
                      key={opt.id}
                      onClick={() => toggleOption(group.required, group.options, opt)}
                      elevation={0}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : '#E2E8F0',
                        backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: group.required ? '50%' : 1,
                            border: '1px solid',
                            borderColor: isSelected ? 'primary.main' : '#CBD5E1',
                            backgroundColor: isSelected ? 'primary.main' : '#FFFFFF',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isSelected && <CheckIcon sx={{ fontSize: 14 }} />}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {opt.name}
                        </Typography>
                      </Box>
                      {opt.price > 0 && (
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          +{formatINR(opt.price)}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          ))}

          {/* Notes */}
          <TextField
            fullWidth
            label="Special Instructions"
            placeholder="e.g. Extra crisp, sauce on side..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, justifyContent: 'space-between', borderTop: '1px solid #E2E8F0' }}>
        {/* Quantity Controller */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#F1F5F9', p: 0.5, borderRadius: 2 }}>
          <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ backgroundColor: '#FFFFFF' }}>
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, minWidth: 24, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton size="small" onClick={() => setQuantity(quantity + 1)} sx={{ backgroundColor: '#FFFFFF' }}>
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Button variant="contained" color="primary" size="large" onClick={handleAdd} sx={{ borderRadius: 2.5, px: 3, fontWeight: 700 }}>
          Add to Order — {formatINR(totalPrice)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
