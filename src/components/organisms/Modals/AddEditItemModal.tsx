import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { Product } from '../../../types/pos';
import { posStore, usePosStore } from '../../../store/posStore';

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

export const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { products } = usePosStore();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Pizzas');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setImage(productToEdit.image);
      setDescription(productToEdit.description || '');
      setIsAvailable(productToEdit.isAvailable);
    } else {
      setName('');
      setCategory(categories[0] || 'Pizzas');
      setPrice('');
      setImage(
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'
      );
      setDescription('');
      setIsAvailable(true);
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const numPrice = parseFloat(price) || 0;

    if (productToEdit) {
      posStore.updateProduct({
        ...productToEdit,
        name,
        category,
        price: numPrice,
        image:
          image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
        description,
        isAvailable,
      });
    } else {
      const newProduct: Product = {
        id: 'p-' + Date.now(),
        name,
        category,
        price: numPrice,
        image:
          image ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
        description,
        isAvailable,
        preparationTime: 15,
        cost: Number((numPrice * 0.4).toFixed(2)),
        taxRate: 5,
      };
      posStore.addProduct(newProduct);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {productToEdit ? `Edit Menu Item: ${productToEdit.name}` : 'Add New Menu Item'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Garlic Breadstick"
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat: string) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  slotProps={{ htmlInput: { step: '0.01' } }}
                  label="Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Item Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Freshly baked with oregano, garlic butter and cheese..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  color="primary"
                />
              }
              label="In Stock / Available for Ordering"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
