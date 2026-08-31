export type OrderType = 'Dine In' | 'Takeaway' | 'Delivery';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled' | 'Paused';
export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Paused';
export type KitchenStatus = 'New' | 'In-Progress' | 'Ready';
export type StaffRole = 'Owner' | 'Manager' | 'Cashier' | 'Server' | 'Cook' | 'Dishwasher';
export type StockStatus = 'Good' | 'Medium' | 'Low';
export type PaymentStatus = 'Matched' | 'Pending' | 'Difference';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Online';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  isAvailable: boolean;
  preparationTime: number; // in mins
  cost: number;
  taxRate: number;
  modifierGroups?: ModifierGroup[];
}

export interface CartItem {
  id: string; // unique cart line item id
  product: Product;
  quantity: number;
  selectedModifiers: ModifierOption[];
  notes?: string;
  itemTotal: number;
  seatNumber?: number; // Seat / Guest # for multi-customer table support (e.g. 1, 2, 3)
  isSentToKitchen?: boolean; // Flag to lock previously sent round items
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #1087
  type: OrderType;
  tableId?: string;
  tableName?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO or formatted string
  timestamp: number; // ms
  staffId: string;
  staffName: string;
  paymentMethod?: PaymentMethod;
  isPaid: boolean;
  isLockedForWaiterEdit?: boolean;
  isPaused?: boolean;
  pausedAt?: string;
}

export interface TableItem {
  id: string;
  number: number;
  tableName?: string;
  seats: number;
  shape: 'square' | 'rect' | 'sofa' | 'round';
  status: TableStatus;
  currentOrderId?: string;
  serverName?: string;
  guestCount?: number;
  startTime?: string;
  totalAmount?: number;
  isPaused?: boolean;
  pausedAt?: string;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  type: OrderType;
  tableName?: string;
  createdAt: string;
  timestamp: number;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    modifiers?: string[];
  }[];
  priority: 'Normal' | 'High';
  status: KitchenStatus;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string; // 'kg', 'L', 'packs', 'units'
  minLevel: number;
  costPerUnit: number;
  status: StockStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  username?: string;
  role: StaffRole;
  pin: string; // 4-digit PIN
  avatar: string;
  status: 'Active' | 'Inactive';
  permissions: {
    dashboard: boolean;
    orders: boolean;
    tables: boolean;
    kitchen: boolean;
    menu: boolean;
    inventory: boolean;
    reports: boolean;
    staff: boolean;
    payments: boolean;
    settings: boolean;
    waiterAccess?: boolean;
    kitchenAccess?: boolean;
  };
}

export interface PaymentTransaction {
  id: string;
  paymentId: string; // e.g. PAY1087
  orderId: string;
  method: PaymentMethod;
  posAmount: number;
  bankAmount: number;
  difference: number;
  status: PaymentStatus;
  date: string;
}

export interface AlertItem {
  id: string;
  type: 'stock' | 'reservation' | 'maintenance';
  title: string;
  subtitle: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RestaurantSettings {
  restaurantName: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  datePattern: string;
  timeFormat: '12 Hour' | '24 Hour';
  language: string;
  taxRate: number;
  serviceChargeRate: number;
  address: string;
  phone: string;
  receiptFooterText: string;
  isShopOpen: boolean;
}
