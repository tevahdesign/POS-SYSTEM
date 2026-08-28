import {
  Product,
  TableItem,
  Order,
  KitchenTicket,
  Ingredient,
  StaffMember,
  PaymentTransaction,
  AlertItem,
  RestaurantSettings
} from '../types/pos';

export const INITIAL_SETTINGS: RestaurantSettings = {
  restaurantName: 'Nexora Bistro',
  currency: 'INR (₹)',
  currencySymbol: '₹',
  timezone: '(UTC+05:30) India Standard Time',
  datePattern: 'DD/MM/YYYY',
  timeFormat: '12 Hour',
  language: 'English',
  taxRate: 5.0,
  serviceChargeRate: 5,
  address: 'MG Road, Indiranagar, Bengaluru, Karnataka 560038',
  phone: '+91 98765 43210',
  receiptFooterText: 'Thank you for dining with Nexora Bistro! Please visit us again.',
  isShopOpen: true
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 349,
    cost: 120,
    taxRate: 5.0,
    preparationTime: 15,
    isAvailable: true,
    description: 'Classic pizza with fresh mozzarella, basil leaves, and slow-cooked tomato sauce.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80',
    modifierGroups: [
      {
        id: 'mg1',
        name: 'Size',
        required: true,
        options: [
          { id: 'opt1', name: 'Small (10")', price: 0 },
          { id: 'opt2', name: 'Medium (12")', price: 80 },
          { id: 'opt3', name: 'Large (14")', price: 150 }
        ]
      },
      {
        id: 'mg2',
        name: 'Extras',
        required: false,
        options: [
          { id: 'opt4', name: 'Extra Cheese', price: 50 },
          { id: 'opt5', name: 'Jalapeño', price: 30 },
          { id: 'opt6', name: 'Olives', price: 30 }
        ]
      }
    ]
  },
  {
    id: 'p2',
    name: 'Pepperoni Pizza',
    category: 'Main Course',
    price: 399,
    cost: 150,
    taxRate: 5.0,
    preparationTime: 15,
    isAvailable: true,
    description: 'Crispy spicy pepperoni slices, mozzarella cheese, and rich marinara.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
    modifierGroups: [
      {
        id: 'mg3',
        name: 'Crust Type',
        required: true,
        options: [
          { id: 'opt7', name: 'Thin Crust', price: 0 },
          { id: 'opt8', name: 'Stuffed Crust', price: 70 }
        ]
      }
    ]
  },
  {
    id: 'p3',
    name: 'Alfredo Pasta',
    category: 'Main Course',
    price: 329,
    cost: 110,
    taxRate: 5.0,
    preparationTime: 12,
    isAvailable: true,
    description: 'Fettuccine tossed in a rich, creamy parmesan cream sauce with garlic.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=400&q=80',
    modifierGroups: [
      {
        id: 'mg4',
        name: 'Protein',
        required: false,
        options: [
          { id: 'opt9', name: 'Grilled Chicken', price: 90 },
          { id: 'opt10', name: 'Shrimp', price: 120 }
        ]
      }
    ]
  },
  {
    id: 'p4',
    name: 'Caesar Salad',
    category: 'Starters',
    price: 229,
    cost: 70,
    taxRate: 5.0,
    preparationTime: 8,
    isAvailable: true,
    description: 'Crisp romaine lettuce, house croutons, parmesan shavings, and Caesar dressing.',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p5',
    name: 'BBQ Burger',
    category: 'Main Course',
    price: 279,
    cost: 95,
    taxRate: 5.0,
    preparationTime: 14,
    isAvailable: true,
    description: 'Angus beef patty, smoky BBQ sauce, cheddar cheese, onion rings, and bacon.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p6',
    name: 'Chicken Wings',
    category: 'Starters',
    price: 249,
    cost: 85,
    taxRate: 5.0,
    preparationTime: 10,
    isAvailable: true,
    description: 'Crispy fried wings tossed in buffalo hot sauce, served with blue cheese dip.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p7',
    name: 'Garlic Bread',
    category: 'Starters',
    price: 149,
    cost: 40,
    taxRate: 5.0,
    preparationTime: 6,
    isAvailable: true,
    description: 'Warm toasted baguette with garlic herb butter and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p8',
    name: 'Coke',
    category: 'Beverages',
    price: 60,
    cost: 15,
    taxRate: 5.0,
    preparationTime: 2,
    isAvailable: true,
    description: 'Chilled 330ml can of Coca-Cola Original.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p9',
    name: 'Orange Juice',
    category: 'Beverages',
    price: 90,
    cost: 25,
    taxRate: 5.0,
    preparationTime: 2,
    isAvailable: true,
    description: 'Freshly squeezed 100% natural orange juice with ice.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'p10',
    name: 'Choco Lava Cake',
    category: 'Desserts',
    price: 179,
    cost: 50,
    taxRate: 5.0,
    preparationTime: 8,
    isAvailable: true,
    description: 'Warm chocolate cake with a molten chocolate center and vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80'
  }
];

export const INITIAL_TABLES: TableItem[] = [
  { id: 't1', number: 1, seats: 2, shape: 'square', status: 'Available' },
  { id: 't2', number: 2, seats: 2, shape: 'square', status: 'Available' },
  { id: 't3', number: 3, seats: 4, shape: 'square', status: 'Available' },
  { id: 't4', number: 4, seats: 4, shape: 'sofa', status: 'Available' },
  { id: 't5', number: 5, seats: 4, shape: 'rect', status: 'Occupied', currentOrderId: 'ord-1087', serverName: 'John D.', guestCount: 3, startTime: '12:45 PM', totalAmount: 775 },
  { id: 't6', number: 6, seats: 4, shape: 'rect', status: 'Occupied', currentOrderId: 'ord-1085', serverName: 'Lisa A.', guestCount: 4, startTime: '01:15 PM', totalAmount: 1027 },
  { id: 't7', number: 7, seats: 4, shape: 'square', status: 'Available' },
  { id: 't8', number: 8, seats: 4, shape: 'square', status: 'Available' },
  { id: 't9', number: 9, seats: 4, shape: 'square', status: 'Available' },
  { id: 't10', number: 10, seats: 6, shape: 'rect', status: 'Available' },
  { id: 't11', number: 11, seats: 4, shape: 'square', status: 'Reserved', serverName: 'Emily D.', guestCount: 2, startTime: '02:00 PM' },
  { id: 't12', number: 12, seats: 4, shape: 'square', status: 'Available' }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1087',
    orderNumber: '#1087',
    type: 'Dine In',
    tableId: 't5',
    tableName: 'Table 5',
    customerName: 'Dine-in Guest',
    items: [
      {
        id: 'ci1',
        product: INITIAL_PRODUCTS[0], // Margherita Pizza
        quantity: 1,
        selectedModifiers: [{ id: 'opt4', name: 'Extra Cheese', price: 50 }],
        itemTotal: 399
      },
      {
        id: 'ci2',
        product: INITIAL_PRODUCTS[2], // Alfredo Pasta
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 329
      },
      {
        id: 'ci3',
        product: INITIAL_PRODUCTS[7], // Coke
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 60
      }
    ],
    subtotal: 788,
    tax: 39.40,
    discount: 0,
    total: 827.40,
    status: 'Preparing',
    createdAt: '1:45 PM',
    timestamp: Date.now() - 15 * 60 * 1000,
    staffId: 's1',
    staffName: 'John Doe',
    isPaid: false
  },
  {
    id: 'ord-1086',
    orderNumber: '#1086',
    type: 'Takeaway',
    customerName: 'Sarah Johnson',
    items: [
      {
        id: 'ci4',
        product: INITIAL_PRODUCTS[4], // BBQ Burger
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 279
      },
      {
        id: 'ci5',
        product: INITIAL_PRODUCTS[5], // Chicken Wings
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 249
      }
    ],
    subtotal: 528,
    tax: 26.40,
    discount: 0,
    total: 554.40,
    status: 'Completed',
    createdAt: '1:30 PM',
    timestamp: Date.now() - 30 * 60 * 1000,
    staffId: 's2',
    staffName: 'Sarah Johnson',
    paymentMethod: 'UPI',
    isPaid: true
  },
  {
    id: 'ord-1085',
    orderNumber: '#1085',
    type: 'Dine In',
    tableId: 't6',
    tableName: 'Table 6',
    customerName: 'Table 6 Guest',
    items: [
      {
        id: 'ci6',
        product: INITIAL_PRODUCTS[1], // Pepperoni Pizza
        quantity: 2,
        selectedModifiers: [],
        itemTotal: 798
      },
      {
        id: 'ci7',
        product: INITIAL_PRODUCTS[8], // Orange Juice
        quantity: 2,
        selectedModifiers: [],
        itemTotal: 180
      }
    ],
    subtotal: 978,
    tax: 48.90,
    discount: 0,
    total: 1026.90,
    status: 'Preparing',
    createdAt: '1:15 PM',
    timestamp: Date.now() - 45 * 60 * 1000,
    staffId: 's3',
    staffName: 'Mike Brown',
    isPaid: false
  },
  {
    id: 'ord-1084',
    orderNumber: '#1084',
    type: 'Delivery',
    customerName: 'Swiggy - Alex M.',
    items: [
      {
        id: 'ci8',
        product: INITIAL_PRODUCTS[2], // Alfredo Pasta
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 329
      },
      {
        id: 'ci9',
        product: INITIAL_PRODUCTS[6], // Garlic Bread
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 149
      }
    ],
    subtotal: 478,
    tax: 23.90,
    discount: 0,
    total: 501.90,
    status: 'Ready',
    createdAt: '1:00 PM',
    timestamp: Date.now() - 60 * 60 * 1000,
    staffId: 's2',
    staffName: 'Sarah Johnson',
    paymentMethod: 'Online',
    isPaid: true
  },
  {
    id: 'ord-1083',
    orderNumber: '#1083',
    type: 'Takeaway',
    customerName: 'Robert Smith',
    items: [
      {
        id: 'ci10',
        product: INITIAL_PRODUCTS[0], // Margherita Pizza
        quantity: 1,
        selectedModifiers: [],
        itemTotal: 349
      }
    ],
    subtotal: 349,
    tax: 17.45,
    discount: 0,
    total: 366.45,
    status: 'Completed',
    createdAt: '12:50 PM',
    timestamp: Date.now() - 70 * 60 * 1000,
    staffId: 's1',
    staffName: 'John Doe',
    paymentMethod: 'Cash',
    isPaid: true
  }
];

export const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'kt1',
    orderId: 'ord-1087',
    orderNumber: '#1087',
    type: 'Dine In',
    tableName: 'Table 5',
    createdAt: '1:45 PM',
    timestamp: Date.now() - 5 * 60 * 1000 - 12 * 1000,
    items: [
      { name: 'Margherita Pizza', quantity: 1, modifiers: ['Extra Cheese'] },
      { name: 'Alfredo Pasta', quantity: 1 },
      { name: 'Coke', quantity: 1 }
    ],
    priority: 'Normal',
    status: 'In-Progress'
  },
  {
    id: 'kt2',
    orderId: 'ord-1085',
    orderNumber: '#1085',
    type: 'Dine In',
    tableName: 'Table 6',
    createdAt: '1:15 PM',
    timestamp: Date.now() - 4 * 60 * 1000 - 45 * 1000,
    items: [
      { name: 'BBQ Burger', quantity: 1, notes: 'No Onion' },
      { name: 'French Fries', quantity: 1 },
      { name: 'Orange Juice', quantity: 1 }
    ],
    priority: 'High',
    status: 'In-Progress'
  },
  {
    id: 'kt3',
    orderId: 'ord-1089',
    orderNumber: '#1089',
    type: 'Delivery',
    tableName: 'DoorDash',
    createdAt: '1:47 PM',
    timestamp: Date.now() - 3 * 60 * 1000 - 30 * 1000,
    items: [
      { name: 'Pepperoni Pizza', quantity: 1, modifiers: ['No Onion'] },
      { name: 'Caesar Salad', quantity: 1 },
      { name: 'Coke', quantity: 1 }
    ],
    priority: 'Normal',
    status: 'New'
  },
  {
    id: 'kt4',
    orderId: 'ord-1090',
    orderNumber: '#1090',
    type: 'Dine In',
    tableName: 'Table 2',
    createdAt: '1:44 PM',
    timestamp: Date.now() - 2 * 60 * 1000 - 15 * 1000,
    items: [
      { name: 'Chicken Wings', quantity: 1 },
      { name: 'Garlic Bread', quantity: 1 }
    ],
    priority: 'Normal',
    status: 'New'
  },
  {
    id: 'kt5',
    orderId: 'ord-1084',
    orderNumber: '#1084',
    type: 'Takeaway',
    tableName: 'Walk-In',
    createdAt: '1:20 PM',
    timestamp: Date.now() - 1 * 60 * 1000 - 20 * 1000,
    items: [
      { name: 'Alfredo Pasta', quantity: 1 },
      { name: 'Coke', quantity: 1 }
    ],
    priority: 'Normal',
    status: 'Ready'
  },
  {
    id: 'kt6',
    orderId: 'ord-1092',
    orderNumber: '#1092',
    type: 'Delivery',
    tableName: 'Uber Eats',
    createdAt: '1:00 PM',
    timestamp: Date.now() - 45 * 1000,
    items: [
      { name: 'BBQ Burger', quantity: 1 },
      { name: 'French Fries', quantity: 1 },
      { name: 'Orange Juice', quantity: 1 }
    ],
    priority: 'Normal',
    status: 'Ready'
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'ing1', name: 'Chicken Breast', category: 'Meat', currentStock: 2.5, unit: 'kg', minLevel: 5.0, costPerUnit: 8.50, status: 'Low' },
  { id: 'ing2', name: 'Mozzarella', category: 'Cheese', currentStock: 1.2, unit: 'kg', minLevel: 3.0, costPerUnit: 12.00, status: 'Low' },
  { id: 'ing3', name: 'Tomato', category: 'Vegetable', currentStock: 3.8, unit: 'kg', minLevel: 3.0, costPerUnit: 3.20, status: 'Medium' },
  { id: 'ing4', name: 'Lettuce', category: 'Vegetable', currentStock: 2.1, unit: 'kg', minLevel: 2.0, costPerUnit: 2.50, status: 'Medium' },
  { id: 'ing5', name: 'Flour', category: 'Dry Goods', currentStock: 15.0, unit: 'kg', minLevel: 5.0, costPerUnit: 1.80, status: 'Good' },
  { id: 'ing6', name: 'Olive Oil', category: 'Oils', currentStock: 8.0, unit: 'L', minLevel: 2.0, costPerUnit: 14.00, status: 'Good' },
  { id: 'ing7', name: 'Pepper', category: 'Spices', currentStock: 0.5, unit: 'kg', minLevel: 0.2, costPerUnit: 18.00, status: 'Good' },
  { id: 'ing8', name: 'Salt', category: 'Spices', currentStock: 1.5, unit: 'kg', minLevel: 1.0, costPerUnit: 1.20, status: 'Good' }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 's1',
    name: 'John Doe',
    username: 'john.manager',
    role: 'Manager',
    pin: '1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'Active',
    permissions: {
      dashboard: true,
      orders: true,
      tables: true,
      kitchen: true,
      menu: true,
      inventory: true,
      reports: true,
      staff: true,
      payments: true,
      settings: true,
      waiterAccess: true,
      kitchenAccess: true
    }
  },
  {
    id: 's2',
    name: 'Sarah Johnson',
    username: 'sarah.cashier',
    role: 'Cashier',
    pin: '2345',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    status: 'Active',
    permissions: {
      dashboard: true,
      orders: true,
      tables: true,
      kitchen: false,
      menu: false,
      inventory: false,
      reports: false,
      staff: false,
      payments: true,
      settings: false,
      waiterAccess: true,
      kitchenAccess: false
    }
  },
  {
    id: 's3',
    name: 'Mike Brown',
    username: 'mike.cook',
    role: 'Cook',
    pin: '3456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'Active',
    permissions: {
      dashboard: false,
      orders: false,
      tables: false,
      kitchen: true,
      menu: true,
      inventory: true,
      reports: false,
      staff: false,
      payments: false,
      settings: false,
      waiterAccess: false,
      kitchenAccess: true
    }
  },
  {
    id: 's4',
    name: 'Emily Davis',
    username: 'emily.waiter',
    role: 'Server',
    pin: '4567',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    status: 'Active',
    permissions: {
      dashboard: true,
      orders: true,
      tables: true,
      kitchen: false,
      menu: false,
      inventory: false,
      reports: false,
      staff: false,
      payments: false,
      settings: false,
      waiterAccess: true,
      kitchenAccess: false
    }
  },
  {
    id: 's5',
    name: 'David Wilson',
    username: 'david.dish',
    role: 'Dishwasher',
    pin: '5678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'Inactive',
    permissions: {
      dashboard: false,
      orders: false,
      tables: false,
      kitchen: false,
      menu: false,
      inventory: false,
      reports: false,
      staff: false,
      payments: false,
      settings: false,
      waiterAccess: false,
      kitchenAccess: false
    }
  },
  {
    id: 's6',
    name: 'Lisa Anderson',
    username: 'lisa.waiter',
    role: 'Server',
    pin: '6789',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'Active',
    permissions: {
      dashboard: true,
      orders: true,
      tables: true,
      kitchen: false,
      menu: false,
      inventory: false,
      reports: false,
      staff: false,
      payments: false,
      settings: false,
      waiterAccess: true,
      kitchenAccess: false
    }
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  { id: 'p1087', paymentId: 'PAY1087', orderId: 'ord-1087', method: 'UPI', posAmount: 827.40, bankAmount: 827.40, difference: 0.00, status: 'Matched', date: '15 Jun 2026' },
  { id: 'p1086', paymentId: 'PAY1086', orderId: 'ord-1086', method: 'Cash', posAmount: 554.40, bankAmount: 554.40, difference: 0.00, status: 'Matched', date: '15 Jun 2026' },
  { id: 'p1085', paymentId: 'PAY1085', orderId: 'ord-1085', method: 'Card', posAmount: 1026.90, bankAmount: 1026.90, difference: 0.00, status: 'Matched', date: '15 Jun 2026' },
  { id: 'p1084', paymentId: 'PAY1084', orderId: 'ord-1084', method: 'UPI', posAmount: 501.90, bankAmount: 501.90, difference: 0.00, status: 'Matched', date: '15 Jun 2026' },
  { id: 'p1083', paymentId: 'PAY1083', orderId: 'ord-1083', method: 'Cash', posAmount: 366.45, bankAmount: 366.45, difference: 0.00, status: 'Matched', date: '15 Jun 2026' },
  { id: 'p1082', paymentId: 'PAY1082', orderId: 'ord-1082', method: 'Card', posAmount: 750.00, bankAmount: 500.00, difference: -250.00, status: 'Difference', date: '15 Jun 2026' }
];

export const INITIAL_ALERTS: AlertItem[] = [
  { id: 'a1', type: 'stock', title: 'Low stock: Chicken Breast', subtitle: '2.5 kg left', time: '10m ago', severity: 'high' },
  { id: 'a2', type: 'stock', title: 'Low stock: Mozzarella', subtitle: '1.2 kg left', time: '25m ago', severity: 'high' },
  { id: 'a3', type: 'reservation', title: 'Upcoming Reservation', subtitle: 'Table 7 at 7:30 PM', time: '1h ago', severity: 'medium' }
];
