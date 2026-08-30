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
  Avatar,
  Chip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { SearchInput } from '../components/atoms/SearchInput';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { AddEditItemModal } from '../components/organisms/Modals/AddEditItemModal';
import { usePosStore, posStore } from '../store/posStore';
import { Product } from '../types/pos';
import { formatINR } from '../utils/formatters';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { NotificationToast } from '../components/atoms/NotificationToast';
import { EmptyState } from '../components/atoms/EmptyState';

export const MenuManagement: React.FC = () => {
  const { products } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      posStore.deleteProduct(deleteTarget.id);
      setToastMsg(`Deleted "${deleteTarget.name}" from catalog`);
      setToastOpen(true);
      setDeleteTarget(null);
    }
  };

  return (
    <MainLayoutTemplate title="Menu & Catalog Management">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Top Controls Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1, maxWidth: 400 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search catalog items..."
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleAddNew}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.1,
              borderRadius: 9999, // Uber Eats Pill Button
              fontWeight: 800,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: '#06C167',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(6, 193, 103, 0.35)',
              '&:hover': {
                backgroundColor: '#049851',
              },
            }}
          >
            Add New Menu Item
          </Button>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
          {categories.map((cat) => (
            <CategoryTab
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </Box>

        {/* Menu Catalog Table */}
        <Paper elevation={1} sx={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No menu items match criteria"
              description={`No catalog item matches "${searchQuery}" in ${selectedCategory}.`}
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Preparation Time</TableCell>
                    <TableCell>Stock Alert</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={product.image}
                            alt={product.name}
                            variant="rounded"
                            sx={{ width: 44, height: 44, borderRadius: '12px' }}
                          />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {product.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#545454' }}>
                              {product.description || 'No description provided'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ backgroundColor: '#E6F9F0', fontWeight: 700, color: '#06C167', borderRadius: 9999 }}
                        />
                      </TableCell>

                      <TableCell sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {formatINR(product.price)}
                      </TableCell>

                      <TableCell sx={{ color: '#545454' }}>
                        {product.preparationTime || '10'} mins
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.isAvailable !== false ? 'In Stock' : 'Out of Stock'}
                          size="small"
                          sx={{
                            backgroundColor: product.isAvailable !== false ? '#E6F9F0' : '#FED7D7',
                            color: product.isAvailable !== false ? '#06C167' : '#E53E3E',
                            fontWeight: 700,
                            borderRadius: 9999,
                          }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <IconButton size="small" aria-label={`Edit ${product.name}`} onClick={() => handleEdit(product)} sx={{ color: '#545454', '&:hover': { color: '#06C167' } }}>
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" aria-label={`Delete ${product.name}`} onClick={() => setDeleteTarget(product)} sx={{ color: '#E53E3E', '&:hover': { color: '#C53030' } }}>
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <AddEditItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={selectedProduct}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#000000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirm Item Deletion</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#545454' }}>
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong> from your POS catalog?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteTarget(null)} sx={{ borderRadius: 9999, color: '#545454' }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ borderRadius: 9999 }}>
              Delete Item
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <NotificationToast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
    </MainLayoutTemplate>
  );
};
