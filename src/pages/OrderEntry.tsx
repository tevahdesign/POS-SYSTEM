import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { MainLayoutTemplate } from '../components/templates/MainLayoutTemplate';
import { SearchInput } from '../components/atoms/SearchInput';
import { CategoryTab } from '../components/atoms/CategoryTab';
import { EmptyState } from '../components/atoms/EmptyState';
import { ProductCard } from '../components/organisms/ProductCard';
import { CartPanel } from '../components/organisms/CartPanel';
import { usePosStore, posStore } from '../store/posStore';
import { Product } from '../types/pos';
import { ModifierModal } from '../components/organisms/Modals/ModifierModal';
import { NotificationToast } from '../components/atoms/NotificationToast';

export const OrderEntry: React.FC = () => {
  const { products, cart } = usePosStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTabMobile, setActiveTabMobile] = useState<'catalog' | 'cart'>('catalog');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddDirect = (product: Product) => {
    posStore.addToCart(product);
    setToastMsg(`Added 1x ${product.name} to order!`);
    setToastOpen(true);
  };

  return (
    <MainLayoutTemplate title="Order Entry">
      {/* Mobile Tab Switcher Toggle */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, gap: 1 }}>
        <Button
          fullWidth
          variant={activeTabMobile === 'catalog' ? 'contained' : 'outlined'}
          onClick={() => setActiveTabMobile('catalog')}
          sx={{ borderRadius: 9999, fontWeight: 700 }}
        >
          Catalog ({filteredProducts.length})
        </Button>
        <Button
          fullWidth
          variant={activeTabMobile === 'cart' ? 'contained' : 'outlined'}
          onClick={() => setActiveTabMobile('cart')}
          startIcon={<ShoppingBagIcon />}
          sx={{ borderRadius: 9999, fontWeight: 700 }}
        >
          Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </Button>
      </Box>

      <Grid container spacing={2.5} sx={{ minHeight: 'calc(100vh - 140px)' }}>
        {/* Left Section: Catalog & Search */}
        <Grid
          size={{ xs: 12, md: 7, lg: 8 }}
          sx={{
            display: { xs: activeTabMobile === 'catalog' ? 'block' : 'none', md: 'block' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search catalog items..."
            />

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

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No catalog items found"
                description={`No menu items match "${searchQuery}" in ${selectedCategory}. Try resetting your search filter.`}
                actionLabel="Reset Search & Filters"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              />
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard
                      product={product}
                      onSelect={handleSelectProduct}
                      onAddDirect={handleAddDirect}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Right Section: Order Cart Panel */}
        <Grid
          size={{ xs: 12, md: 5, lg: 4 }}
          sx={{
            display: { xs: activeTabMobile === 'cart' ? 'block' : 'none', md: 'block' },
            height: '100%',
          }}
        >
          <CartPanel onReturnToCatalog={() => setActiveTabMobile('catalog')} />
        </Grid>
      </Grid>

      {/* Detailed Product Modifier Modal */}
      <ModifierModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
        onAddToCart={(product, selectedModifiers, quantity, notes) => {
          posStore.addToCart(product, selectedModifiers, quantity, notes);
          setToastMsg(`Added ${quantity}x ${product.name} to order!`);
          setToastOpen(true);
        }}
      />

      <NotificationToast
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </MainLayoutTemplate>
  );
};
