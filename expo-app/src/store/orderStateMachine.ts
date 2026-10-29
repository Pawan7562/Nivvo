// ============================================================================
// ORDER STAGE STATE MACHINE & TRANSITION RULES
// ============================================================================

import { OrderStage, Order } from '../types';

export interface StageConfig {
  stage: OrderStage;
  stepIndex: number; // 0: Assigned, 1: Picked up, 2: On route, 3: Delivered
  label: string;
  nextStage: OrderStage | null;
  buttonLabel: string;
  buttonSecondaryLabel?: string;
  requiresAllPickupsVerified: boolean;
  requiresTryOnInspection: boolean;
  requiresCustomerPin: boolean;
}

export const ORDER_STAGES: Record<OrderStage, StageConfig> = {
  assigned: {
    stage: 'assigned',
    stepIndex: 0,
    label: 'Order assigned · Proceed to pickup shops',
    nextStage: 'reaching_shop',
    buttonLabel: 'Start trip to shop',
    requiresAllPickupsVerified: false,
    requiresTryOnInspection: false,
    requiresCustomerPin: false
  },
  reaching_shop: {
    stage: 'reaching_shop',
    stepIndex: 0,
    label: 'At dark store / shop · Verify item codes',
    nextStage: 'picked_up',
    buttonLabel: 'Confirm all items picked up',
    requiresAllPickupsVerified: true,
    requiresTryOnInspection: false,
    requiresCustomerPin: false
  },
  picked_up: {
    stage: 'picked_up',
    stepIndex: 1,
    label: 'All items secured · Ready to depart',
    nextStage: 'on_the_way',
    buttonLabel: 'Start delivery route',
    requiresAllPickupsVerified: true,
    requiresTryOnInspection: false,
    requiresCustomerPin: false
  },
  on_the_way: {
    stage: 'on_the_way',
    stepIndex: 2,
    label: 'On the way to customer doorstep',
    nextStage: 'arrived_dropoff',
    buttonLabel: "I've arrived at doorstep",
    requiresAllPickupsVerified: false,
    requiresTryOnInspection: false,
    requiresCustomerPin: false
  },
  arrived_dropoff: {
    stage: 'arrived_dropoff',
    stepIndex: 2,
    label: 'At doorstep · 10-minute try-on active',
    nextStage: 'delivered',
    buttonLabel: 'Confirm delivery with PIN',
    requiresAllPickupsVerified: false,
    requiresTryOnInspection: true, // For try-on orders: checklist must be ticked
    requiresCustomerPin: true      // 4-digit PIN mandatory
  },
  delivered: {
    stage: 'delivered',
    stepIndex: 3,
    label: 'Order delivered successfully',
    nextStage: null,
    buttonLabel: 'View earnings receipt',
    requiresAllPickupsVerified: false,
    requiresTryOnInspection: false,
    requiresCustomerPin: false
  }
};

/**
 * Validates whether an order can transition to the next stage
 */
export function canTransitionToNextStage(
  order: Order, 
  pinInput?: string
): { canTransition: boolean; reason?: string } {
  const currentConfig = ORDER_STAGES[order.stage];

  if (!currentConfig.nextStage) {
    return { canTransition: false, reason: 'Order already completed' };
  }

  // 1. Check pickup items verification
  if (currentConfig.requiresAllPickupsVerified) {
    const unverified = order.pickups.filter(p => p.status !== 'verified');
    if (unverified.length > 0) {
      return { 
        canTransition: false, 
        reason: `Please verify item codes for: ${unverified.map(p => p.shop).join(', ')}` 
      };
    }
  }

  // 2. Check try-on inspection
  if (currentConfig.requiresTryOnInspection && order.tryOnRequired) {
    if (!order.returnPairInspected) {
      return { 
        canTransition: false, 
        reason: 'Please inspect returned size pair and tick the seal confirmation checkbox' 
      };
    }
  }

  // 3. Check customer PIN
  if (currentConfig.requiresCustomerPin) {
    if (!pinInput || pinInput.length !== 4) {
      return { canTransition: false, reason: 'Please enter the 4-digit customer delivery PIN' };
    }
    if (pinInput !== order.customerPin) {
      return { canTransition: false, reason: 'Incorrect PIN. Please re-check with the customer.' };
    }
  }

  return { canTransition: true };
}
