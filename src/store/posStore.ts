import { useState, useEffect } from 'react';
import {
  Product,
  TableItem,
  Order,
  KitchenTicket,
  Ingredient,
  StaffMember,
  PaymentTransaction,
  AlertItem,
  RestaurantSettings,
  CartItem,
  OrderType,
  OrderStatus,
  TableStatus,
  KitchenStatus,
  ModifierOption,
  PaymentMethod
} from '../types/pos';
import {
  INITIAL_SETTINGS,
  INITIAL_PRODUCTS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
  INITIAL_KITCHEN_TICKETS,
  INITIAL_INGREDIENTS,
  INITIAL_STAFF,
  INITIAL_PAYMENTS,
  INITIAL_ALERTS
} from '../data/seedData';

const LOCAL_STORAGE_KEY = 'NEXORA_POS_STATE_V1';

interface AppState {
  currentUser: StaffMember;
  activeOrderType: OrderType;
  selectedTableId?: string;
  selectedTableName?: string;
  selectedSeatNumber?: number;
  customerName?: string;
  cart: CartItem[];
  heldOrders: Order[];
  orders: Order[];
  tables: TableItem[];
  kitchenTickets: KitchenTicket[];
  products: Product[];
  ingredients: Ingredient[];
  staff: StaffMember[];
  payments: PaymentTransaction[];
  alerts: AlertItem[];
  settings: RestaurantSettings;
}

const getInitialState = (): AppState => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved POS state:', e);
    }
  }

  return {
    currentUser: INITIAL_STAFF[0],
    activeOrderType: 'Dine In',
    selectedTableId: 't5',
    selectedTableName: 'Table 5',
    selectedSeatNumber: 1,
    customerName: 'Dine-in Guest',
    cart: [
      {
        id: 'c1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedModifiers: [{ id: 'opt4', name: 'Extra Cheese', price: 2.00 }],
        itemTotal: 14.99,
        seatNumber: 1
      },
      {
        id: 'c2',
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 13.99,
        seatNumber: 2
      },
      {
        id: 'c3',
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 2.49,
        seatNumber: 1
      }
    ],
    heldOrders: [],
    orders: INITIAL_ORDERS,
    tables: INITIAL_TABLES,
    kitchenTickets: INITIAL_KITCHEN_TICKETS,
    products: INITIAL_PRODUCTS,
    ingredients: INITIAL_INGREDIENTS,
    staff: INITIAL_STAFF,
    payments: INITIAL_PAYMENTS,
    alerts: INITIAL_ALERTS,
    settings: INITIAL_SETTINGS
  };
};

let currentState: AppState = getInitialState();
const listeners = new Set<() => void>();

const saveState = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
  listeners.forEach(listener => listener());
};

export const posStore = {
  getState: () => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Auth Actions
  setCurrentUser: (user: StaffMember) => {
    currentState.currentUser = user;
    saveState();
  },

  // Cart / Order Entry Actions
  setOrderType: (type: OrderType) => {
    currentState.activeOrderType = type;
    if (type !== 'Dine In') {
      currentState.selectedTableId = undefined;
      currentState.selectedTableName = undefined;
      currentState.selectedSeatNumber = undefined;
    }
    saveState();
  },

  setSelectedTable: (tableId?: string, tableName?: string) => {
    currentState.selectedTableId = tableId;
    currentState.selectedTableName = tableName;
    if (!tableId) {
      currentState.selectedSeatNumber = undefined;
    }
    saveState();
  },

  setSelectedSeat: (seatNumber?: number) => {
    currentState.selectedSeatNumber = seatNumber;
    saveState();
  },

  addToCart: (
    product: Product,
    selectedModifiers: ModifierOption[] = [],
    quantity: number = 1,
    notes?: string,
    seatNumber?: number
  ) => {
    const modTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
    const unitPrice = product.price + modTotal;
    const itemTotal = Number((unitPrice * quantity).toFixed(2));

    const newItem: CartItem = {
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      product,
      quantity,
      selectedModifiers,
      notes,
      itemTotal,
      seatNumber,
      isSentToKitchen: false
    };

    currentState.cart = [...currentState.cart, newItem];
    saveState();
  },

  updateCartQuantity: (cartItemId: string, delta: number) => {
    currentState.cart = currentState.cart
      .map(item => {
        if (item.id === cartItemId) {
          if (item.isSentToKitchen) return item; // Locked if already dispatched to kitchen
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const unitPrice = item.product.price + item.selectedModifiers.reduce((sum, m) => sum + m.price, 0);
          return {
            ...item,
            quantity: newQty,
            itemTotal: Number((unitPrice * newQty).toFixed(2))
          };
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
    saveState();
  },

  removeFromCart: (cartItemId: string) => {
    currentState.cart = currentState.cart.filter(item => item.id !== cartItemId || item.isSentToKitchen);
    saveState();
  },

  clearCart: () => {
    currentState.cart = [];
    saveState();
  },

  holdCurrentOrder: () => {
    if (currentState.cart.length === 0) return;

    const subtotal = currentState.cart.reduce((sum, i) => sum + i.itemTotal, 0);
    const tax = Number((subtotal * (currentState.settings.taxRate / 100)).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: '#' + (1088 + currentState.orders.length),
      type: currentState.activeOrderType,
      tableId: currentState.selectedTableId,
      tableName: currentState.selectedTableName,
      customerName: currentState.customerName || 'Guest',
      items: [...currentState.cart],
      subtotal,
      tax,
      discount: 0,
      total,
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      staffId: currentState.currentUser.id,
      staffName: currentState.currentUser.name,
      isPaid: false
    };

    currentState.heldOrders = [newOrder, ...currentState.heldOrders];
    currentState.cart = [];
    saveState();
  },

  restoreHeldOrder: (orderId: string) => {
    const target = currentState.heldOrders.find(o => o.id === orderId);
    if (!target) return;

    currentState.cart = [...target.items];
    currentState.activeOrderType = target.type;
    currentState.selectedTableId = target.tableId;
    currentState.selectedTableName = target.tableName;
    currentState.customerName = target.customerName;

    currentState.heldOrders = currentState.heldOrders.filter(o => o.id !== orderId);
    saveState();
  },

  sendToKitchen: (): Order | null => {
    if (currentState.cart.length === 0) return null;

    // Separate new unsent round items vs previously sent items
    const unsentItems = currentState.cart.filter(i => !i.isSentToKitchen);
    const hasPreviousSent = currentState.cart.some(i => i.isSentToKitchen);

    // Lock all items as sent to kitchen
    const updatedCart = currentState.cart.map(i => ({ ...i, isSentToKitchen: true }));
    currentState.cart = updatedCart;

    const subtotal = updatedCart.reduce((sum, i) => sum + i.itemTotal, 0);
    const tax = Number((subtotal * (currentState.settings.taxRate / 100)).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    let targetOrder: Order;
    const existingOrderIndex = currentState.selectedTableId
      ? currentState.orders.findIndex(o => o.tableId === currentState.selectedTableId && !o.isPaid)
      : -1;

    if (existingOrderIndex !== -1) {
      const existing = currentState.orders[existingOrderIndex];
      targetOrder = {
        ...existing,
        items: [...updatedCart],
        subtotal,
        tax,
        total,
        status: 'Preparing',
        isPaused: false
      };
      currentState.orders[existingOrderIndex] = targetOrder;
    } else {
      const orderNum = '#' + (1088 + currentState.orders.length);
      const orderId = 'ord-' + Date.now();
      targetOrder = {
        id: orderId,
        orderNumber: orderNum,
        type: currentState.activeOrderType,
        tableId: currentState.selectedTableId,
        tableName: currentState.selectedTableName || (currentState.activeOrderType === 'Takeaway' ? 'Takeaway' : 'Delivery'),
        customerName: currentState.customerName || 'Customer',
        items: [...updatedCart],
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'Preparing',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        staffId: currentState.currentUser.id,
        staffName: currentState.currentUser.name,
        isPaid: false,
        isPaused: false
      };
      currentState.orders = [targetOrder, ...currentState.orders];
    }

    // Create Kitchen Ticket ONLY for unsent items (or all if first time)
    const ticketItems = (unsentItems.length > 0 ? unsentItems : updatedCart).map(item => ({
      name: item.product.name + (item.seatNumber ? ` [Guest #${item.seatNumber}]` : ''),
      quantity: item.quantity,
      notes: item.notes,
      modifiers: item.selectedModifiers.map(m => m.name)
    }));

    const newTicket: KitchenTicket = {
      id: 'kt-' + Date.now(),
      orderId: targetOrder.id,
      orderNumber: targetOrder.orderNumber,
      type: currentState.activeOrderType,
      tableName: targetOrder.tableName + (hasPreviousSent && unsentItems.length > 0 ? ' (Round 2 Add-On)' : ''),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      items: ticketItems,
      priority: 'Normal',
      status: 'New'
    };

    currentState.kitchenTickets = [newTicket, ...currentState.kitchenTickets];

    if (currentState.selectedTableId) {
      currentState.tables = currentState.tables.map(t => {
        if (t.id === currentState.selectedTableId) {
          return {
            ...t,
            status: 'Occupied',
            currentOrderId: targetOrder.id,
            totalAmount: targetOrder.total,
            startTime: t.startTime || targetOrder.createdAt,
            isPaused: false
          };
        }
        return t;
      });
    }

    saveState();
    return targetOrder;
  },

  pauseTableOrder: (tableId?: string) => {
    const targetTableId = tableId || currentState.selectedTableId;
    if (!targetTableId) {
      posStore.holdCurrentOrder();
      return;
    }

    if (currentState.cart.length === 0) return;

    const subtotal = currentState.cart.reduce((sum, i) => sum + i.itemTotal, 0);
    const tax = Number((subtotal * (currentState.settings.taxRate / 100)).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const table = currentState.tables.find(t => t.id === targetTableId);
    const existingOrderIndex = currentState.orders.findIndex(
      o => (o.id === table?.currentOrderId || o.tableId === targetTableId) && !o.isPaid
    );

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (existingOrderIndex !== -1) {
      const existing = currentState.orders[existingOrderIndex];
      const updatedOrder: Order = {
        ...existing,
        items: [...currentState.cart],
        subtotal,
        tax,
        total,
        status: 'Paused',
        isPaused: true,
        pausedAt: nowStr
      };
      currentState.orders[existingOrderIndex] = updatedOrder;
    } else {
      const newOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: '#' + (1088 + currentState.orders.length),
        type: 'Dine In',
        tableId: targetTableId,
        tableName: currentState.selectedTableName || (table ? `Table ${table.number}` : 'Table'),
        customerName: currentState.customerName || 'Dine-in Guest',
        items: [...currentState.cart],
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'Paused',
        createdAt: nowStr,
        timestamp: Date.now(),
        staffId: currentState.currentUser.id,
        staffName: currentState.currentUser.name,
        isPaid: false,
        isPaused: true,
        pausedAt: nowStr
      };
      currentState.orders = [newOrder, ...currentState.orders];
    }

    currentState.tables = currentState.tables.map(t => {
      if (t.id === targetTableId) {
        return {
          ...t,
          status: 'Paused',
          isPaused: true,
          pausedAt: nowStr,
          totalAmount: total
        };
      }
      return t;
    });

    currentState.cart = [];
    currentState.selectedTableId = undefined;
    currentState.selectedTableName = undefined;
    saveState();
  },

  reopenTableOrder: (tableId: string) => {
    const table = currentState.tables.find(t => t.id === tableId);
    if (!table) return null;

    const linkedOrder = currentState.orders.find(
      o => (o.id === table.currentOrderId || o.tableId === tableId) && !o.isPaid
    );

    if (!linkedOrder) return null;

    currentState.selectedTableId = tableId;
    currentState.selectedTableName = table.tableName || `Table ${table.number}`;
    currentState.activeOrderType = 'Dine In';
    currentState.customerName = linkedOrder.customerName || 'Dine-in Guest';
    currentState.cart = [...linkedOrder.items];

    linkedOrder.status = 'Preparing';
    linkedOrder.isPaused = false;

    currentState.tables = currentState.tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'Occupied',
          isPaused: false
        };
      }
      return t;
    });

    saveState();
    return linkedOrder;
  },

  deleteStaff: (staffId: string) => {
    currentState.staff = currentState.staff.filter(s => s.id !== staffId);
    saveState();
  },

  payOrder: (orderId: string, method: PaymentMethod) => {
    currentState.orders = currentState.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          isPaid: true,
          paymentMethod: method,
          status: 'Completed'
        };
      }
      return o;
    });

    // Auto-deduct inventory
    const targetOrder = currentState.orders.find(o => o.id === orderId);
    if (targetOrder) {
      // Auto decrement stock levels slightly to demonstrate inventory automation
      currentState.ingredients = currentState.ingredients.map(ing => {
        if (ing.name.toLowerCase().includes('mozzarella') || ing.name.toLowerCase().includes('chicken')) {
          const newStock = Math.max(0, Number((ing.currentStock - 0.2).toFixed(1)));
          return {
            ...ing,
            currentStock: newStock,
            status: newStock <= ing.minLevel ? 'Low' : newStock <= ing.minLevel * 1.5 ? 'Medium' : 'Good'
          };
        }
        return ing;
      });

      // Free table if associated
      if (targetOrder.tableId) {
        currentState.tables = currentState.tables.map(t => {
          if (t.id === targetOrder.tableId) {
            return {
              ...t,
              status: 'Available',
              currentOrderId: undefined,
              totalAmount: undefined
            };
          }
          return t;
        });
      }

      // Add payment transaction
      const newPayment: PaymentTransaction = {
        id: 'p-' + Date.now(),
        paymentId: 'PAY' + targetOrder.orderNumber.replace('#', ''),
        orderId: targetOrder.id,
        method,
        posAmount: targetOrder.total,
        bankAmount: targetOrder.total,
        difference: 0,
        status: 'Matched',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      currentState.payments = [newPayment, ...currentState.payments];
    }

    // Clear active cart if matching this table order
    if (targetOrder && targetOrder.tableId === currentState.selectedTableId) {
      currentState.cart = [];
      currentState.selectedTableId = undefined;
      currentState.selectedTableName = undefined;
      currentState.selectedSeatNumber = undefined;
    }

    saveState();
  },

  updateOrderPreBill: (orderId: string, updatedItems: CartItem[], discount: number = 0) => {
    const subtotal = updatedItems.reduce((sum, i) => sum + i.itemTotal, 0);
    const tax = Number((subtotal * (currentState.settings.taxRate / 100)).toFixed(2));
    const total = Math.max(0, Number((subtotal + tax - discount).toFixed(2)));

    currentState.orders = currentState.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          items: updatedItems,
          subtotal,
          tax,
          discount,
          total
        };
      }
      return o;
    });

    // Also sync active cart if current table matches
    const targetOrder = currentState.orders.find(o => o.id === orderId);
    if (targetOrder && targetOrder.tableId && targetOrder.tableId === currentState.selectedTableId) {
      currentState.cart = updatedItems;
    }

    saveState();
  },

  completeAndPrintOrder: (orderId: string, method: PaymentMethod) => {
    posStore.payOrder(orderId, method);
  },

  // Table Management Actions
  updateTableStatus: (tableId: string, status: TableStatus, serverName?: string, guestCount?: number) => {
    currentState.tables = currentState.tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          isPaused: status === 'Paused',
          serverName: serverName || t.serverName,
          guestCount: guestCount !== undefined ? guestCount : t.guestCount,
          currentOrderId: status === 'Available' ? undefined : t.currentOrderId
        };
      }
      return t;
    });
    saveState();
  },

  // Kitchen Ticket Actions
  updateTicketStatus: (ticketId: string, status: KitchenStatus) => {
    currentState.kitchenTickets = currentState.kitchenTickets.map(kt => {
      if (kt.id === ticketId) {
        return { ...kt, status };
      }
      return kt;
    });
    saveState();
  },

  // Menu Management Actions
  addProduct: (product: Product) => {
    currentState.products = [product, ...currentState.products];
    saveState();
  },

  updateProduct: (product: Product) => {
    currentState.products = currentState.products.map(p => p.id === product.id ? product : p);
    saveState();
  },

  deleteProduct: (productId: string) => {
    currentState.products = currentState.products.filter(p => p.id !== productId);
    saveState();
  },

  toggleProductAvailability: (productId: string) => {
    currentState.products = currentState.products.map(p => {
      if (p.id === productId) {
        return { ...p, isAvailable: !p.isAvailable };
      }
      return p;
    });
    saveState();
  },

  // Inventory Actions
  updateIngredientStock: (ingredientId: string, newStock: number) => {
    currentState.ingredients = currentState.ingredients.map(ing => {
      if (ing.id === ingredientId) {
        const status = newStock <= ing.minLevel ? 'Low' : newStock <= ing.minLevel * 1.5 ? 'Medium' : 'Good';
        return { ...ing, currentStock: newStock, status };
      }
      return ing;
    });
    saveState();
  },

  addIngredient: (ingredient: Ingredient) => {
    currentState.ingredients = [ingredient, ...currentState.ingredients];
    saveState();
  },

  // Staff Actions
  addStaff: (member: StaffMember) => {
    currentState.staff = [member, ...currentState.staff];
    saveState();
  },

  updateStaff: (member: StaffMember) => {
    currentState.staff = currentState.staff.map(s => s.id === member.id ? member : s);
    saveState();
  },

  resetStaffPin: (staffId: string, newPin: string) => {
    currentState.staff = currentState.staff.map(s => {
      if (s.id === staffId) return { ...s, pin: newPin };
      return s;
    });
    saveState();
  },

  toggleStaffStatus: (staffId: string) => {
    currentState.staff = currentState.staff.map(s => {
      if (s.id === staffId) {
        return { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return s;
    });
    saveState();
  },

  // Settings & Shop Actions
  updateSettings: (newSettings: Partial<RestaurantSettings>) => {
    currentState.settings = { ...currentState.settings, ...newSettings };
    saveState();
  },

  toggleShopStatus: (isOpen: boolean) => {
    currentState.settings = {
      ...currentState.settings,
      isShopOpen: isOpen
    };
    saveState();
  },

  sendLowStockAlert: (ingredientId: string, customNote?: string) => {
    const ing = currentState.ingredients.find(i => i.id === ingredientId);
    if (!ing) return;

    const newAlert: AlertItem = {
      id: 'a-' + Date.now(),
      type: 'stock',
      title: `Low stock: ${ing.name}`,
      subtitle: customNote || `Kitchen reported low stock: ${ing.currentStock} ${ing.unit} remaining (Min: ${ing.minLevel} ${ing.unit})`,
      time: 'Just now',
      severity: 'high'
    };

    // Ensure status is marked as Low
    currentState.ingredients = currentState.ingredients.map(i => 
      i.id === ingredientId ? { ...i, status: 'Low' } : i
    );

    currentState.alerts = [newAlert, ...currentState.alerts];
    saveState();
  },

  resetAllState: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    currentState = getInitialState();
    listeners.forEach(l => l());
  }
};

// React Hook to consume store in components smoothly
export function usePosStore(): AppState {
  const [state, setState] = useState<AppState>(posStore.getState());

  useEffect(() => {
    const unsubscribe = posStore.subscribe(() => {
      setState({ ...posStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
