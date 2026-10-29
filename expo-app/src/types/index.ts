// ============================================================================
// NIVVO DELIVERY PARTNER (RIDER) - TYPESCRIPT DATA MODELS
// ============================================================================

export type OrderStage = 
  | 'assigned' 
  | 'reaching_shop' 
  | 'picked_up' 
  | 'on_the_way' 
  | 'arrived_dropoff' 
  | 'delivered';

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  partnerId: string;
  hubId: string;
  hubName: string;
  phone: string;
  bloodGroup: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Elite Partner';
  rating: number;
  onTimePercent: number;
  acceptancePercent: number;
  totalTrips: number;
  activeSince: string;
  isOnline: boolean;
  todayEarnings: number;
  dutyHoursToday: number;
  incentivesToday: number;
  todayDeliveriesCount: number;
}

export interface Vehicle {
  model: string;
  registrationNumber: string;
  batteryPercent: number;
  rangeKm: number;
  nearestSwapStation: {
    name: string;
    distanceKm: number;
    availableBatteries: number;
    address: string;
  };
}

export interface Hub {
  id: string;
  name: string;
  hubCode: string;
  area: string;
  address: string;
  managerName: string;
  managerPhone: string;
  operatingHours: string;
}

export interface PickupItem {
  id: string;
  shop: string;
  address: string;
  item: string;
  itemCode: string;
  status: 'pending' | 'verified';
  time: string;
  pin?: string;
  shelfLocation?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  maskedPhone: string;
  address: string;
  flat: string;
  area: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  note?: string;
  paymentStatus: 'UPI Paid' | 'Online Prepaid' | 'Cash on Delivery';
}

export interface JobOffer {
  id: string;
  orderId: string;
  payout: number;
  surgeBonus: number;
  pickupsCount: number;
  dropoffsCount: number;
  shops: Array<{
    name: string;
    item: string;
    readyIn: string;
    distance: string;
  }>;
  customer: {
    name: string;
    area: string;
    address: string;
  };
  totalDistance: string;
  estTime: string;
  isTryOn: boolean;
  expiresAt: number; // Unix timestamp
  secondsRemaining: number;
}

export interface Order {
  id: string;
  orderId: string;
  stage: OrderStage;
  statusLabel: string;
  pay: number;
  surge: number;
  tip: number;
  totalPayout: number;
  distance: string;
  etaMinutes: number;
  window: string;
  customer: CustomerInfo;
  pickups: PickupItem[];
  tryOnRequired: boolean;
  tryOnTimeMinutes: number;
  returnPairInspected: boolean;
  customerPin: string;
  deliveredAt?: string;
}

export interface EarningBreakdown {
  period: 'Today' | 'This week' | 'This month';
  total: number;
  deltaText: string;
  basePay: number;
  surge: number;
  tips: number;
  tripsCount: number;
}

export interface RecentTrip {
  id: string;
  orderId: string;
  time: string;
  customerName: string;
  pickupShop: string;
  amount: number;
  isTryOn: boolean;
  status: 'Completed' | 'Returned Try-on';
}

export interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  targetTrips: number;
  completedTrips: number;
  rewardAmount: number;
  unlocked: boolean;
  expiresText: string;
}

export interface Payout {
  id: string;
  amount: number;
  timestamp: string;
  method: string;
  upiId: string;
  status: 'completed' | 'processing';
  refId: string;
}

export interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  etaResponse: string;
  ticketNumber: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
  type: 'alert' | 'surge' | 'safety' | 'tip';
}

export interface BusyZone {
  id: string;
  name: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  surgeMultiplier: string;
  distanceKm: number;
  estWaitMinutes: number;
}

export interface Compliment {
  id: string;
  text: string;
  count: number;
  icon: string;
}
