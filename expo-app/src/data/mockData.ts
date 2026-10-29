// ============================================================================
// NIVVO DELIVERY PARTNER - MOCK DATA (INDIRANAGAR, BENGALURU)
// ============================================================================

import { 
  Partner, Vehicle, Hub, JobOffer, Order, 
  EarningBreakdown, Milestone, Payout, Ticket, 
  NotificationItem, BusyZone, Compliment, RecentTrip 
} from '../types';

export const mockPartner: Partner = {
  id: 'partner-1082',
  name: 'Aarav Shah',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  partnerId: 'RDR-1082',
  hubId: 'hub-indiranagar-14',
  hubName: 'Indiranagar Hub #14',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  tier: 'Elite Partner',
  rating: 4.96,
  onTimePercent: 98.8,
  acceptancePercent: 96.5,
  totalTrips: 342,
  activeSince: 'Oct 2024',
  isOnline: false,
  todayEarnings: 980,
  dutyHoursToday: 3.5,
  incentivesToday: 180,
  todayDeliveriesCount: 14
};

export const mockVehicle: Vehicle = {
  model: 'Ather 450X Gen 3',
  registrationNumber: 'KA-03-EV-4421',
  batteryPercent: 88,
  rangeKm: 64,
  nearestSwapStation: {
    name: 'Ather Grid · 100 Feet Road',
    distanceKm: 0.3,
    availableBatteries: 8,
    address: 'Opp. Toit Brewpub, Indiranagar, Bengaluru'
  }
};

export const mockHub: Hub = {
  id: 'hub-indiranagar-14',
  name: 'Indiranagar Dark Store Hub #14',
  hubCode: 'IND-14',
  area: 'Indiranagar, Bengaluru',
  address: 'Plot 418, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
  managerName: 'Rajesh Murthy',
  managerPhone: '+91 98450 11234',
  operatingHours: '6:00 AM – 2:00 AM'
};

export const mockJobOffers: JobOffer[] = [
  {
    id: 'job-offer-8492',
    orderId: 'NV-8492',
    payout: 64,
    surgeBonus: 20,
    pickupsCount: 2,
    dropoffsCount: 1,
    shops: [
      { name: 'Sole Street Footwear', item: 'White Leather Court Sneaker (UK 7 & 8)', readyIn: 'Packed & ready', distance: '0.4 km' },
      { name: 'Circuit House Tech', item: 'Braided Type-C Fast Cable (1.2m)', readyIn: 'Ready in 2 min', distance: '0.6 km' }
    ],
    customer: {
      name: 'Pooja Rao',
      area: '8th Main Road, Indiranagar',
      address: 'Flat 204, Green Glen Apts, 8th Main, Indiranagar'
    },
    totalDistance: '1.4 km',
    estTime: '12 min',
    isTryOn: true,
    expiresAt: Date.now() + 20000,
    secondsRemaining: 20
  },
  {
    id: 'job-offer-8495',
    orderId: 'NV-8495',
    payout: 78,
    surgeBonus: 25,
    pickupsCount: 1,
    dropoffsCount: 1,
    shops: [
      { name: 'The Linen Club', item: 'Oatmeal Band Collar Shirt (M & L)', readyIn: 'Packed', distance: '0.8 km' }
    ],
    customer: {
      name: 'Karthik Nambiar',
      area: 'Defence Colony, Indiranagar',
      address: 'House #12, 4th Cross, Defence Colony'
    },
    totalDistance: '1.8 km',
    estTime: '15 min',
    isTryOn: true,
    expiresAt: Date.now() + 20000,
    secondsRemaining: 20
  }
];

export const mockActiveOrder: Order = {
  id: 'order-1048',
  orderId: 'NV-1048',
  stage: 'on_the_way',
  statusLabel: 'On the way to customer doorstep',
  pay: 64,
  surge: 20,
  tip: 15,
  totalPayout: 99,
  distance: '1.3 km',
  etaMinutes: 8,
  window: '2:54–3:02 pm',
  customer: {
    name: 'Meera & Aarav Shah',
    phone: '+91 98765 43210',
    maskedPhone: '+91 80 4719 3321 (Ext 4)',
    address: 'A-302, Maple Court, 12th Main Road',
    flat: 'A-302 (3rd Floor, Lift A)',
    area: 'Indiranagar',
    city: 'Bengaluru 560038',
    coordinates: {
      latitude: 12.9784,
      longitude: 77.6408
    },
    note: 'Please ring the doorbell. Trying 2 shoe sizes (UK 7 & 8). Returning 1 pair into seal bag.',
    paymentStatus: 'UPI Paid'
  },
  pickups: [
    {
      id: 'pick-1',
      shop: 'Sole Street',
      address: '100ft Road, Indiranagar',
      item: 'Everyday Court Sneaker (White, Sizes UK 7 & UK 8)',
      itemCode: 'SOL-CRT-WHT-0708',
      status: 'verified',
      time: '2:39 pm',
      shelfLocation: 'Shelf B-3'
    },
    {
      id: 'pick-2',
      shop: 'Circuit House',
      address: '12th Main Road, Indiranagar',
      item: '65W GaN Charger + Braided USB-C Cable',
      itemCode: 'CIR-GAN-65W-BLK',
      status: 'verified',
      time: '2:44 pm',
      shelfLocation: 'Bay 1'
    }
  ],
  tryOnRequired: true,
  tryOnTimeMinutes: 10,
  returnPairInspected: false,
  customerPin: '4829'
};

export const mockDeliveredTrips: RecentTrip[] = [
  {
    id: 'trip-1044',
    orderId: 'NV-1044',
    time: '1:45 pm',
    customerName: 'Ananya S.',
    pickupShop: 'Urban Suede + Circuit House',
    amount: 72,
    isTryOn: true,
    status: 'Completed'
  },
  {
    id: 'trip-1041',
    orderId: 'NV-1041',
    time: '1:10 pm',
    customerName: 'Devang Varma',
    pickupShop: 'Kicks Bengaluru',
    amount: 58,
    isTryOn: false,
    status: 'Completed'
  },
  {
    id: 'trip-1038',
    orderId: 'NV-1038',
    time: '12:35 pm',
    customerName: 'Rhea Kurian',
    pickupShop: 'The Cotton Edit',
    amount: 85,
    isTryOn: true,
    status: 'Returned Try-on'
  },
  {
    id: 'trip-1032',
    orderId: 'NV-1032',
    time: '11:50 am',
    customerName: 'Sunil Rao',
    pickupShop: 'Sole Street',
    amount: 64,
    isTryOn: false,
    status: 'Completed'
  }
];

export const mockEarningsStats: Record<'Today' | 'This week' | 'This month', EarningBreakdown> = {
  Today: {
    period: 'Today',
    total: 980,
    deltaText: '+₹148 vs yesterday',
    basePay: 740,
    surge: 180,
    tips: 60,
    tripsCount: 14
  },
  'This week': {
    period: 'This week',
    total: 4620,
    deltaText: '+₹640 vs last week',
    basePay: 3920,
    surge: 450,
    tips: 250,
    tripsCount: 72
  },
  'This month': {
    period: 'This month',
    total: 18740,
    deltaText: 'Top 5% Partner in Bengaluru',
    basePay: 15840,
    surge: 1750,
    tips: 1150,
    tripsCount: 296
  }
};

export const mockMilestones: Milestone[] = [
  {
    id: 'ms-daily',
    title: 'Daily Peak Surge Target',
    subtitle: 'Complete 15 deliveries today to unlock cash bonus',
    targetTrips: 15,
    completedTrips: 14,
    rewardAmount: 150,
    unlocked: false,
    expiresText: 'Expires tonight at 11:59 pm'
  },
  {
    id: 'ms-weekly',
    title: 'Weekly Super Partner Tier',
    subtitle: 'Complete 80 deliveries this week',
    targetTrips: 80,
    completedTrips: 72,
    rewardAmount: 800,
    unlocked: false,
    expiresText: '3 days left'
  }
];

export const mockBusyZones: BusyZone[] = [
  {
    id: 'zone-1',
    name: 'Indiranagar 100ft Road',
    demandLevel: 'High',
    surgeMultiplier: '1.4x Surge',
    distanceKm: 0.4,
    estWaitMinutes: 2
  },
  {
    id: 'zone-2',
    name: 'Defence Colony & CMH Road',
    demandLevel: 'Medium',
    surgeMultiplier: '1.2x Surge',
    distanceKm: 1.1,
    estWaitMinutes: 5
  },
  {
    id: 'zone-3',
    name: 'HAL 2nd Stage & Kodihalli',
    demandLevel: 'Low',
    surgeMultiplier: '1.0x Base',
    distanceKm: 2.3,
    estWaitMinutes: 8
  }
];

export const mockCompliments: Compliment[] = [
  { id: 'comp-1', text: 'Super fast arrival', count: 148, icon: 'flash' },
  { id: 'comp-2', text: 'Very polite & courteous', count: 112, icon: 'thumbs-up' },
  { id: 'comp-3', text: 'Patient with doorstep try-on', count: 86, icon: 'time' },
  { id: 'comp-4', text: 'Clean EV scooter & bags', count: 64, icon: 'shield-checkmark' }
];

export const mockTickets: Ticket[] = [
  {
    id: 't-1',
    ticketNumber: 'TKT-8910',
    category: 'Order & Drop-off',
    subject: 'Customer doorstep gate locked at Maple Court',
    description: 'Dispatch auto-dialed customer intercom and resolved in 2 mins.',
    status: 'Resolved',
    createdAt: 'Today, 1:15 pm',
    etaResponse: 'Resolved'
  },
  {
    id: 't-2',
    ticketNumber: 'TKT-8842',
    category: 'EV & Swap Station',
    subject: 'Battery swap bay #3 card reader slow',
    description: 'Ather support notified. Swap bay #1 & #2 functioning normally.',
    status: 'Resolved',
    createdAt: 'Yesterday, 4:20 pm',
    etaResponse: 'Resolved'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: '₹20 Tip Received',
    text: 'Customer Pooja Rao added a ₹20 tip for quick try-on service. 100% credited to your UPI.',
    time: '12 min ago',
    read: false,
    type: 'tip'
  },
  {
    id: 'n-2',
    title: 'Surge Alert: Indiranagar 100ft Rd',
    text: 'High order volume around 100ft Road shops. 1.4x surge active for the next 2 hours.',
    time: '45 min ago',
    read: false,
    type: 'surge'
  },
  {
    id: 'n-3',
    title: 'Safety Reminder · Helmet Protocol',
    text: '10-minute delivery is powered by store proximity, never speeding. Obey traffic signals.',
    time: '2h ago',
    read: true,
    type: 'safety'
  }
];

export const mockPayouts: Payout[] = [
  {
    id: 'pay-1',
    amount: 1250,
    timestamp: 'Yesterday, 8:40 pm',
    method: 'IMPS Instant Payout',
    upiId: 'aarav@okhdfcbank',
    status: 'completed',
    refId: 'IMPS/610283910/NIVVO'
  },
  {
    id: 'pay-2',
    amount: 2400,
    timestamp: '22 Oct 2026, 9:15 pm',
    method: 'Weekly Auto Settlement',
    upiId: 'aarav@okhdfcbank',
    status: 'completed',
    refId: 'IMPS/609182374/NIVVO'
  }
];
