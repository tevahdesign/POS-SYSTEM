import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { SearchInput } from '../components/atoms/SearchInput';
import { StatusChip } from '../components/atoms/StatusChip';
import { StockAdjustModal } from '../components/organisms/Modals/StockAdjustModal';
import { usePosStore } from '../store/posStore';
import { Ingredient } from '../types/pos';

import { EmptyState } from '../components/atoms/EmptyState';

export const Inventory: React.FC = () => {
  const { ingredients } = usePosStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = ingredients.filter(
    (ing) =>
      ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStock = (ing: Ingredient) => {
    setSelectedIngredient(ing);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedIngredient(null);
    setIsModalOpen(true);
  };

  return (
    <MainLayoutTemplate title="Inventory">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Action Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search ingredients..."
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.1,
              borderRadius: 9999, // Yoko Pill Button
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            Add Ingredient
          </Button>
        </Box>

        {/* Ingredients Data Table */}
        <Paper elevation={1} sx={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
          {filteredIngredients.length === 0 ? (
            <EmptyState
              title="No ingredients found"
              description={`No inventory item matches "${searchQuery}". Adjust search query or add a new ingredient.`}
              actionLabel="Clear Search"
              onAction={() => setSearchQuery('')}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ingredient</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Min Level</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIngredients.map((ing) => {
                    const isLow = ing.status === 'Low' || ing.currentStock <= ing.minLevel;
                    return (
                      <TableRow
                        key={ing.id}
                        hover
                        sx={{
                          backgroundColor: isLow ? '#FEE2E2' : 'transparent',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: isLow ? '#B91C1C' : '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {ing.name}
                        </TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{ing.category}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: isLow ? '#B91C1C' : '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {ing.currentStock} {ing.unit}
                        </TableCell>
                        <TableCell sx={{ color: '#64748B' }}>{ing.unit}</TableCell>
                        <TableCell sx={{ color: '#64748B' }}>
                          {ing.minLevel} {ing.unit}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={ing.status} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" aria-label={`Adjust stock for ${ing.name}`} onClick={() => handleEditStock(ing)} sx={{ color: '#64748B', '&:hover': { color: '#6366F1' } }}>
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <StockAdjustModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ingredient={selectedIngredient}
        />
      </Box>
    </MainLayoutTemplate>
  );
};
