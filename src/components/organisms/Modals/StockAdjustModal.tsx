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
  Grid,
} from '@mui/material';
import { Ingredient } from '../../../types/pos';
import { posStore } from '../../../store/posStore';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  ingredient,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Meat');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minLevel, setMinLevel] = useState('3.0');

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setCategory(ingredient.category);
      setStock(ingredient.currentStock.toString());
      setUnit(ingredient.unit);
      setMinLevel(ingredient.minLevel.toString());
    } else {
      setName('');
      setCategory('Vegetable');
      setStock('');
      setUnit('kg');
      setMinLevel('2.0');
    }
  }, [ingredient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock) return;

    const numStock = parseFloat(stock);
    const numMin = parseFloat(minLevel) || 1.0;

    if (ingredient) {
      posStore.updateIngredientStock(ingredient.id, numStock);
    } else {
      const newStatus =
        numStock <= numMin ? 'Low' : numStock <= numMin * 1.5 ? 'Medium' : 'Good';
      const newIng: Ingredient = {
        id: 'ing-' + Date.now(),
        name,
        category,
        currentStock: numStock,
        unit,
        minLevel: numMin,
        costPerUnit: 5.0,
        status: newStatus,
      };
      posStore.addIngredient(newIng);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {ingredient ? `Adjust Stock: ${ingredient.name}` : 'Add New Ingredient'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Ingredient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken Breast"
            />

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="Meat">Meat</MenuItem>
                    <MenuItem value="Cheese">Cheese</MenuItem>
                    <MenuItem value="Vegetable">Vegetable</MenuItem>
                    <MenuItem value="Dry Goods">Dry Goods</MenuItem>
                    <MenuItem value="Oils">Oils</MenuItem>
                    <MenuItem value="Spices">Spices</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={unit}
                    label="Unit"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="packs">packs</MenuItem>
                    <MenuItem value="units">units</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  label="Current Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="5.0"
                />
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  label="Min Reorder Level"
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value)}
                  placeholder="2.0"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Stock
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
