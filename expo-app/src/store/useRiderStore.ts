// ============================================================================
// NIVVO DELIVERY PARTNER - ZUSTAND GLOBAL STATE STORE
// ============================================================================

import { create } from 'zustand';
import { 
  Partner, Vehicle, Hub, JobOffer, Order, 
  EarningBreakdown, Milestone, Payout, Ticket, 
  NotificationItem, RecentTrip 
} from '../types';
import { 
  mockPartner, mockVehicle, mockHub, mockJobOffers, 
  mockActiveOrder, mockDeliveredTrips, mockEarningsStats, 
  mockMilestones, mockPayouts, mockTickets, mockNotifications 
} from '../data/mockData';
import { canTransitionToNextStage, ORDER_STAGES } from './orderStateMachine';

export type NavTab = 'duty' | 'orders' | 'earnings' | 'support' | 'profile';

interface OfflineQueueItem {
  id: string;
  action: string;
  timestamp: number;
  payload: any;
}

interface RiderStoreState {
  // Navigation & Theme
  activeTab: NavTab;
  isDarkMode: boolean;
  toast: { text: string; type?: 'success' | 'info' | 'error' } | null;

  // Domain Entities
  partner: Partner;
  vehicle: Vehicle;
  hub: Hub;
  activeOrder: Order | null;
  jobOffers: JobOffer[];
  deliveredTrips: RecentTrip[];
  earningsStats: Record<'Today' | 'This week' | 'This month', EarningBreakdown>;
  milestones: Milestone[];
  payouts: Payout[];
  tickets: Ticket[];
  notifications: NotificationItem[];
  offlineQueue: OfflineQueueItem[];

  // Modals & UI States
  isPinModalOpen: boolean;
  isDeliverySuccessModalOpen: boolean;
  isDelayModalOpen: boolean;
  isSosModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isNewTicketModalOpen: boolean;
  isOfferDecliningId: string | null;

  // Actions
  setActiveTab: (tab: NavTab) => void;
  toggleDarkMode: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;

  // Duty Actions
  toggleDuty: () => void;
  decrementOfferTimer: () => void;
  acceptJobOffer: (offerId: string) => void;
  declineJobOffer: (offerId: string, reason?: string) => void;

  // Order Flow & State Machine Actions
  advanceOrderStage: () => { success: boolean; error?: string };
  verifyPickupItem: (itemId: string) => void;
  toggleTryOnInspected: () => void;
  completeDeliveryWithPin: (pinInput: string) => { success: boolean; error?: string };
  closeDeliverySuccessModal: () => void;
  reportDelay: (reason: string) => void;
  triggerEmergencySos: (type: '112' | 'dispatch' | 'hub') => void;

  // Earnings & Payout Actions
  requestInstantPayout: (amount: number) => { success: boolean; error?: string };

  // Support Actions
  createSupportTicket: (category: string, subject: string, description: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Modal Controls
  setPinModalOpen: (open: boolean) => void;
  setDelayModalOpen: (open: boolean) => void;
  setSosModalOpen: (open: boolean) => void;
  setWithdrawModalOpen: (open: boolean) => void;
  setNewTicketModalOpen: (open: boolean) => void;
  setIsOfferDecliningId: (id: string | null) => void;

  // Offline Sync
  queueOfflineAction: (action: string, payload: any) => void;
  syncOfflineQueue: () => void;
}

export const useRiderStore = create<RiderStoreState>((set, get) => ({
  activeTab: 'duty',
  isDarkMode: false,
  toast: null,

  partner: mockPartner,
  vehicle: mockVehicle,
  hub: mockHub,
  activeOrder: null,
  jobOffers: [],
  deliveredTrips: mockDeliveredTrips,
  earningsStats: mockEarningsStats,
  milestones: mockMilestones,
  payouts: mockPayouts,
  tickets: mockTickets,
  notifications: mockNotifications,
  offlineQueue: [],

  isPinModalOpen: false,
  isDeliverySuccessModalOpen: false,
  isDelayModalOpen: false,
  isSosModalOpen: false,
  isWithdrawModalOpen: false,
  isNewTicketModalOpen: false,
  isOfferDecliningId: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  showToast: (text, type = 'info') => {
    set({ toast: { text, type } });
  },

  hideToast: () => set({ toast: null }),

  toggleDuty: () => {
    set((state) => {
      const newStatus = !state.partner.isOnline;
      return {
        partner: {
          ...state.partner,
          isOnline: newStatus
        },
        jobOffers: newStatus ? mockJobOffers : [],
        toast: {
          text: newStatus 
            ? 'You are now Online and accepting orders.' 
            : 'Duty paused. You are now Offline.',
          type: newStatus ? 'success' : 'info'
        }
      };
    });
  },

  decrementOfferTimer: () => {
    set((state) => {
      if (!state.partner.isOnline || state.jobOffers.length === 0) return {};
      const updated = state.jobOffers
        .map((offer) => ({
          ...offer,
          secondsRemaining: Math.max(0, offer.secondsRemaining - 1)
        }))
        .filter((offer) => offer.secondsRemaining > 0);

      return { jobOffers: updated };
    });
  },

  acceptJobOffer: (offerId) => {
    const { jobOffers, showToast, setActiveTab } = get();
    const offer = jobOffers.find((o) => o.id === offerId);
    if (!offer) return;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderId: offer.orderId,
      stage: 'assigned',
      statusLabel: 'Order assigned · Proceed to pickup shops',
      pay: offer.payout,
      surge: offer.surgeBonus,
      tip: 0,
      totalPayout: offer.payout + offer.surgeBonus,
      distance: offer.totalDistance,
      etaMinutes: 14,
      window: '14–18 min window',
      customer: {
        name: offer.customer.name,
        phone: '+91 98765 43210',
        maskedPhone: '+91 80 4719 3321 (Ext 1)',
        address: offer.customer.address,
        flat: 'Doorstep Delivery',
        area: offer.customer.area,
        city: 'Bengaluru',
        coordinates: { latitude: 12.9784, longitude: 77.6408 },
        note: 'Ring bell · Doorstep try-on requested.',
        paymentStatus: 'UPI Paid'
      },
      pickups: offer.shops.map((s, idx) => ({
        id: `pick-${idx + 1}`,
        shop: s.name,
        address: 'Indiranagar Hub',
        item: s.item,
        itemCode: `NIV-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'pending',
        time: 'Just now'
      })),
      tryOnRequired: offer.isTryOn,
      tryOnTimeMinutes: 10,
      returnPairInspected: false,
      customerPin: '4829'
    };

    set((state) => ({
      activeOrder: newOrder,
      jobOffers: state.jobOffers.filter((o) => o.id !== offerId)
    }));

    showToast(`Job ${offer.orderId} accepted! ₹${offer.payout + offer.surgeBonus} payout.`, 'success');
    setActiveTab('orders');
  },

  declineJobOffer: (offerId, reason = 'Too far') => {
    set((state) => ({
      jobOffers: state.jobOffers.filter((o) => o.id !== offerId),
      isOfferDecliningId: null
    }));
    get().showToast('Offer declined and reassigned to nearby fleet.');
  },

  verifyPickupItem: (itemId) => {
    set((state) => {
      if (!state.activeOrder) return {};
      const updatedPickups = state.activeOrder.pickups.map((p) =>
        p.id === itemId ? { ...p, status: 'verified' as const } : p
      );
      return {
        activeOrder: {
          ...state.activeOrder,
          pickups: updatedPickups
        }
      };
    });
    get().showToast('Item code verified successfully.', 'success');
  },

  toggleTryOnInspected: () => {
    set((state) => {
      if (!state.activeOrder) return {};
      const newVal = !state.activeOrder.returnPairInspected;
      return {
        activeOrder: {
          ...state.activeOrder,
          returnPairInspected: newVal
        }
      };
    });
  },

  advanceOrderStage: () => {
    const { activeOrder, showToast } = get();
    if (!activeOrder) return { success: false, error: 'No active order' };

    const validation = canTransitionToNextStage(activeOrder);
    if (!validation.canTransition) {
      showToast(validation.reason || 'Cannot advance stage', 'error');
      return { success: false, error: validation.reason };
    }

    const nextStage = ORDER_STAGES[activeOrder.stage].nextStage;
    if (!nextStage) return { success: false, error: 'Order finished' };

    const nextConfig = ORDER_STAGES[nextStage];

    set((state) => ({
      activeOrder: state.activeOrder
        ? {
            ...state.activeOrder,
            stage: nextStage,
            statusLabel: nextConfig.label
          }
        : null
    }));

    showToast(`Stage updated: ${nextConfig.label}`, 'info');
    return { success: true };
  },

  completeDeliveryWithPin: (pinInput) => {
    const { activeOrder, showToast, deliveredTrips, partner, earningsStats, milestones } = get();
    if (!activeOrder) return { success: false, error: 'No active order' };

    const validation = canTransitionToNextStage(activeOrder, pinInput);
    if (!validation.canTransition) {
      showToast(validation.reason || 'Verification failed', 'error');
      return { success: false, error: validation.reason };
    }

    const totalEarned = activeOrder.totalPayout;

    const newTrip: RecentTrip = {
      id: `trip-${Date.now()}`,
      orderId: activeOrder.orderId,
      time: 'Just now',
      customerName: activeOrder.customer.name,
      pickupShop: activeOrder.pickups.map((p) => p.shop).join(' + '),
      amount: totalEarned,
      isTryOn: activeOrder.tryOnRequired,
      status: 'Completed'
    };

    const newTodayEarnings = partner.todayEarnings + totalEarned;
    const newDeliveriesCount = partner.todayDeliveriesCount + 1;

    // Update milestones progress
    const updatedMilestones = milestones.map((m) => {
      if (m.id === 'ms-daily') {
        const completed = m.completedTrips + 1;
        return {
          ...m,
          completedTrips: completed,
          unlocked: completed >= m.targetTrips
        };
      }
      return m;
    });

    // Update today's earnings stats
    const updatedTodayStats: EarningBreakdown = {
      ...earningsStats['Today'],
      total: earningsStats['Today'].total + totalEarned,
      basePay: earningsStats['Today'].basePay + activeOrder.pay,
      surge: earningsStats['Today'].surge + activeOrder.surge,
      tips: earningsStats['Today'].tips + activeOrder.tip,
      tripsCount: earningsStats['Today'].tripsCount + 1
    };

    set({
      activeOrder: null,
      deliveredTrips: [newTrip, ...deliveredTrips],
      isPinModalOpen: false,
      isDeliverySuccessModalOpen: true,
      partner: {
        ...partner,
        todayEarnings: newTodayEarnings,
        todayDeliveriesCount: newDeliveriesCount,
        totalTrips: partner.totalTrips + 1
      },
      earningsStats: {
        ...earningsStats,
        Today: updatedTodayStats
      },
      milestones: updatedMilestones
    });

    showToast(`Order ${activeOrder.orderId} delivered! ₹${totalEarned} credited instantly.`, 'success');
    return { success: true };
  },

  closeDeliverySuccessModal: () => set({ isDeliverySuccessModalOpen: false }),

  reportDelay: (reason) => {
    set({ isDelayModalOpen: false });
    get().showToast(`Delay logged: "${reason}". Dispatch alerted.`, 'info');
  },

  triggerEmergencySos: (type) => {
    set({ isSosModalOpen: false });
    if (type === '112') {
      get().showToast('Emergency 112 dialed with GPS live telemetry.', 'error');
    } else if (type === 'dispatch') {
      get().showToast('High-priority SOS beacon transmitted to dark store controller.', 'error');
    } else {
      get().showToast('Connecting with Dark Store Manager Rajesh Murthy...', 'info');
    }
  },

  requestInstantPayout: (amount) => {
    const { partner, payouts, showToast } = get();
    if (amount <= 0 || amount > partner.todayEarnings) {
      showToast('Invalid payout amount or exceeds available balance', 'error');
      return { success: false, error: 'Invalid amount' };
    }

    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      amount,
      timestamp: 'Just now',
      method: 'IMPS Instant Payout',
      upiId: 'aarav@okhdfcbank',
      status: 'completed',
      refId: `IMPS/${Math.floor(100000000 + Math.random() * 900000000)}/NIVVO`
    };

    set({
      isWithdrawModalOpen: false,
      partner: {
        ...partner,
        todayEarnings: partner.todayEarnings - amount
      },
      payouts: [newPayout, ...payouts]
    });

    showToast(`₹${amount} transferred instantly to aarav@okhdfcbank via IMPS.`, 'success');
    return { success: true };
  },

  createSupportTicket: (category, subject, description) => {
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject,
      description,
      status: 'Open',
      createdAt: 'Just now',
      etaResponse: 'Under 30s response'
    };

    set((state) => ({
      tickets: [newTicket, ...state.tickets],
      isNewTicketModalOpen: false
    }));

    get().showToast(`Ticket ${newTicket.ticketNumber} created! Dispatch will answer in <30s.`, 'success');
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
    get().showToast('All notifications marked as read.');
  },

  setPinModalOpen: (open) => set({ isPinModalOpen: open }),
  setDelayModalOpen: (open) => set({ isDelayModalOpen: open }),
  setSosModalOpen: (open) => set({ isSosModalOpen: open }),
  setWithdrawModalOpen: (open) => set({ isWithdrawModalOpen: open }),
  setNewTicketModalOpen: (open) => set({ isNewTicketModalOpen: open }),
  setIsOfferDecliningId: (id) => set({ isOfferDecliningId: id }),

  queueOfflineAction: (action, payload) => {
    const item: OfflineQueueItem = {
      id: `queue-${Date.now()}`,
      action,
      timestamp: Date.now(),
      payload
    };
    set((state) => ({ offlineQueue: [...state.offlineQueue, item] }));
    get().showToast('Offline: Action queued. Will sync automatically when connected.', 'info');
  },

  syncOfflineQueue: () => {
    const { offlineQueue, showToast } = get();
    if (offlineQueue.length === 0) return;
    set({ offlineQueue: [] });
    showToast(`Synced ${offlineQueue.length} offline actions with dispatch server.`, 'success');
  }
}));
