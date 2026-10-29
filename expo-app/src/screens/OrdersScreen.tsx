// ============================================================================
// SCREEN 2: ORDERS (LIVE TRIP EXECUTION & DELIVERED TRIP HISTORY)
// ============================================================================

import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  SafeAreaView, Linking, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { StatusPill } from '../components/StatusPill';
import { ProgressSteps } from '../components/ProgressSteps';
import { BottomSheet } from '../components/BottomSheet';
import { KeypadPIN } from '../components/KeypadPIN';
import { ORDER_STAGES, canTransitionToNextStage } from '../store/orderStateMachine';

export const OrdersScreen: React.FC = () => {
  const {
    activeOrder,
    deliveredTrips,
    isDarkMode,
    advanceOrderStage,
    verifyPickupItem,
    toggleTryOnInspected,
    completeDeliveryWithPin,
    isDeliverySuccessModalOpen,
    closeDeliverySuccessModal,
    reportDelay,
    triggerEmergencySos,
    setActiveTab,
    showToast
  } = useRiderStore();

  const colors = isDarkMode ? darkColors : lightColors;

  const [activeSubTab, setActiveSubTab] = useState<'live' | 'delivered'>('live');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinErrorMessage, setPinErrorMessage] = useState('');
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showMapDirections, setShowMapDirections] = useState(false);

  // Handle stage action button
  const handlePrimaryStageAction = () => {
    if (!activeOrder) return;

    if (activeOrder.stage === 'arrived_dropoff') {
      // Must check try-on inspection first
      if (activeOrder.tryOnRequired && !activeOrder.returnPairInspected) {
        showToast('Please inspect the returned size pair and tick the seal confirmation checkbox', 'error');
        return;
      }
      setPinErrorMessage('');
      setShowPinModal(true);
      return;
    }

    const res = advanceOrderStage();
    if (!res.success && res.error) {
      // Error handled by store toast
    }
  };

  // Handle customer masked call
  const handleCallCustomer = () => {
    showToast('Calling customer through masked fleet bridge (+91 80 4719 3321)...');
    Linking.openURL('tel:+918047193321').catch(() => {
      showToast('Phone dialer not supported on device simulation');
    });
  };

  // Handle navigation in external maps fallback
  const handleOpenExternalMaps = () => {
    if (!activeOrder) return;
    const { latitude, longitude } = activeOrder.customer.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      showToast('Maps application not available');
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Tab Bar: Live Trip / Delivered */}
      <View style={styles.topTabsWrapper}>
        <Tabs
          tabs={[
            { id: 'live' as const, label: 'Live trip', badge: activeOrder ? '1' : undefined },
            { id: 'delivered' as const, label: 'Delivered trips', badge: deliveredTrips.length }
          ]}
          activeTab={activeSubTab}
          onSelectTab={setActiveSubTab}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSubTab === 'live' ? (
          activeOrder ? (
            <View style={{ gap: SPACING.md }}>
              {/* ─── 1. Trip Header Card ─── */}
              <Card style={{ borderColor: colors.cardBorder }}>
                <View style={styles.tripHeaderRow}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary }]}>
                        Order {activeOrder.orderId}
                      </Text>
                      {activeOrder.tryOnRequired && (
                        <StatusPill label="10-min Try-on" variant="tryon" />
                      )}
                    </View>
                    <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginTop: 2 }]}>
                      {activeOrder.pickups.length} pickups · 1 drop · ₹{activeOrder.totalPayout} Guaranteed Pay
                    </Text>
                  </View>

                  {/* Actions: Delay & SOS buttons */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setShowDelayModal(true)}
                      style={[styles.smallActionBtn, { backgroundColor: colors.surfaceSubtle }]}
                      activeOpacity={0.7}
                      accessibilityLabel="Report delay"
                    >
                      <Ionicons name="time-outline" size={13} color={colors.textPrimary} style={{ marginRight: 3 }} />
                      <Text style={[TYPOGRAPHY.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
                        Delay
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowSosModal(true)}
                      style={[styles.smallActionBtn, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 }]}
                      activeOpacity={0.7}
                      accessibilityLabel="Emergency SOS"
                    >
                      <Ionicons name="shield-outline" size={13} color="#DC2626" style={{ marginRight: 3 }} />
                      <Text style={[TYPOGRAPHY.caption, { color: '#DC2626', fontWeight: '800' }]}>
                        SOS
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Progress Stepper: Assigned → Picked up → On route → Delivered */}
                <View style={{ marginTop: SPACING.md }}>
                  <ProgressSteps currentStage={activeOrder.stage} />
                </View>
              </Card>

              {/* ─── 2. Interactive In-App Route Map & ETA ─── */}
              <Card style={{ padding: 0 }}>
                {/* Simulated In-App Map Canvas */}
                <View style={[styles.mapCanvas, { backgroundColor: isDarkMode ? '#19281F' : '#E6EDE0' }]}>
                  {/* Street grid pattern simulation */}
                  <View style={styles.mapGridPattern}>
                    <Text style={[TYPOGRAPHY.caption, { color: isDarkMode ? '#2F4536' : '#C1CEC0', position: 'absolute', top: 20, left: 16 }]}>
                      100 FT ROAD
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: isDarkMode ? '#2F4536' : '#C1CEC0', position: 'absolute', bottom: 30, right: 30 }]}>
                      12TH MAIN ROAD
                    </Text>
                  </View>

                  {/* Route Line & Pin Nodes */}
                  <View style={styles.mapNodesContainer}>
                    {/* Dark Store Pickup Node */}
                    <View style={styles.mapNode}>
                      <View style={[styles.mapPin, { backgroundColor: '#1F4230' }]}>
                        <Ionicons name="storefront" size={11} color="#FFFFFF" />
                      </View>
                      <Text style={[styles.mapLabel, { color: colors.textPrimary }]}>Sole Street</Text>
                    </View>

                    {/* Rider Scooter Live Position */}
                    <View style={styles.riderLiveNode}>
                      <View style={styles.scooterHalo} />
                      <View style={styles.scooterPin}>
                        <Ionicons name="bicycle" size={14} color="#14281C" />
                      </View>
                      <Text style={[styles.mapLabel, { color: '#C6F432', backgroundColor: '#1F4230', paddingHorizontal: 4, borderRadius: 4 }]}>
                        {activeOrder.etaMinutes} min away
                      </Text>
                    </View>

                    {/* Customer Dropoff Node */}
                    <View style={styles.mapNode}>
                      <View style={[styles.mapPin, { backgroundColor: '#C6F432' }]}>
                        <Ionicons name="location" size={11} color="#14281C" />
                      </View>
                      <Text style={[styles.mapLabel, { color: colors.textPrimary }]}>{activeOrder.customer.name}</Text>
                    </View>
                  </View>
                </View>

                {/* Map Bottom Bar: ETA + In-App / External Navigation */}
                <View style={styles.mapBottomBar}>
                  <View>
                    <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                      {activeOrder.etaMinutes} min ({activeOrder.distance})
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                      Window: {activeOrder.window} · Traffic clear on 100ft Rd
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleOpenExternalMaps}
                    style={[styles.navigateBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
                    activeOpacity={0.85}
                  >
                    <Text style={[TYPOGRAPHY.caption, { fontWeight: '800', color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
                      Navigate ↗
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* ─── 3. Drop-off Customer Card ─── */}
              <Card>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                    Drop-off Details
                  </Text>
                  {/* Strict UPI Paid Badge */}
                  <StatusPill 
                    label="UPI PAID · DO NOT COLLECT CASH" 
                    variant="verified" 
                    showDot={false} 
                  />
                </View>

                <View style={{ marginTop: SPACING.sm, gap: 4 }}>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                    {activeOrder.customer.name}
                  </Text>
                  <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>
                    {activeOrder.customer.flat}, {activeOrder.customer.address}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>
                    {activeOrder.customer.city}
                  </Text>
                </View>

                {/* Customer Gate / Delivery Note */}
                {activeOrder.customer.note ? (
                  <View style={[styles.noteContainer, { backgroundColor: colors.surfaceSubtle }]}>
                    <Ionicons name="document-text-outline" size={13} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[TYPOGRAPHY.subtext, { color: colors.textPrimary, flex: 1 }]}>
                      <Text style={{ fontWeight: '700' }}>Customer note: </Text>
                      {activeOrder.customer.note}
                    </Text>
                  </View>
                ) : null}

                {/* Masked Call & Message Buttons */}
                <View style={styles.contactRow}>
                  <TouchableOpacity
                    onPress={handleCallCustomer}
                    style={[styles.contactBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call-outline" size={15} color={colors.textPrimary} style={{ marginRight: 4 }} />
                    <Text style={[TYPOGRAPHY.subtext, { fontWeight: '700', color: colors.textPrimary }]}>
                      Call (Masked)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => showToast('Opening masked dispatch message thread with customer...')}
                    style={[styles.contactBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.textPrimary} style={{ marginRight: 4 }} />
                    <Text style={[TYPOGRAPHY.subtext, { fontWeight: '700', color: colors.textPrimary }]}>
                      Message
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* ─── 4. Doorstep Try-On 10-Minute Card (Mandatory for Try-On Orders) ─── */}
              {activeOrder.tryOnRequired && (
                <Card style={{ borderColor: '#C6F432', borderWidth: 1.5 }}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="footsteps-outline" size={16} color={colors.primary} />
                      <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                        Doorstep Try-On Active (10 min)
                      </Text>
                    </View>
                    <StatusPill label="+₹20 TRY-ON FEE" variant="surge" showDot={false} />
                  </View>

                  <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginTop: 4, lineHeight: 18 }]}>
                    The customer is trying on 2 sizes (UK 7 and UK 8). Wait up to 10 minutes at the doorstep. The customer retains 1 pair and returns 1 pair to you.
                  </Text>

                  {/* Mandatory Checkbox: Returned pair inspected & sealed */}
                  <TouchableOpacity
                    onPress={toggleTryOnInspected}
                    activeOpacity={0.8}
                    style={[
                      styles.tryOnCheckRow,
                      {
                        backgroundColor: activeOrder.returnPairInspected 
                          ? isDarkMode ? '#1F3424' : '#E8F5E9' 
                          : colors.surfaceSubtle,
                        borderColor: activeOrder.returnPairInspected ? '#16A34A' : colors.cardBorder
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.checkboxSquare,
                        {
                          backgroundColor: activeOrder.returnPairInspected ? '#1F4230' : 'transparent',
                          borderColor: activeOrder.returnPairInspected ? '#1F4230' : colors.textMuted
                        }
                      ]}
                    >
                      {activeOrder.returnPairInspected && (
                        <Ionicons name="checkmark" size={12} color="#C6F432" />
                      )}
                    </View>
                    <Text style={[TYPOGRAPHY.subtext, { color: colors.textPrimary, flex: 1, fontWeight: '700' }]}>
                      Returned pair inspected and sealed in dark store return pouch
                    </Text>
                  </TouchableOpacity>
                </Card>
              )}

              {/* ─── 5. Hub Pickup Checklist Card ─── */}
              <Card>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                    Hub Pickup Checklist
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                    {activeOrder.pickups.filter(p => p.status === 'verified').length}/{activeOrder.pickups.length} Verified
                  </Text>
                </View>

                <View style={{ marginTop: SPACING.sm, gap: 10 }}>
                  {activeOrder.pickups.map((pickup) => (
                    <View
                      key={pickup.id}
                      style={[
                        styles.pickupCheckItem,
                        {
                          backgroundColor: pickup.status === 'verified'
                            ? isDarkMode ? '#1B2C20' : '#F6FAF4'
                            : colors.surfaceSubtle,
                          borderColor: colors.cardBorder
                        }
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                          {pickup.shop}
                        </Text>
                        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                          {pickup.item}
                        </Text>
                        <Text style={[TYPOGRAPHY.mono, { color: colors.primary, fontSize: 11, marginTop: 2 }]}>
                          Code: {pickup.itemCode} · {pickup.shelfLocation || 'Main Hub'}
                        </Text>
                      </View>

                      {pickup.status === 'verified' ? (
                        <StatusPill label="VERIFIED" variant="verified" />
                      ) : (
                        <TouchableOpacity
                          onPress={() => verifyPickupItem(pickup.id)}
                          style={[styles.verifyItemBtn, { backgroundColor: '#C6F432' }]}
                          activeOpacity={0.8}
                        >
                          <Text style={[TYPOGRAPHY.caption, { color: '#14281C', fontWeight: '800' }]}>
                            Mark Verified
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </Card>

              {/* ─── 6. Sticky Stage Transition Button ─── */}
              <View style={[styles.stickyButtonContainer, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
                <TouchableOpacity
                  onPress={handlePrimaryStageAction}
                  style={[
                    styles.primaryStageButton,
                    {
                      backgroundColor: activeOrder.stage === 'arrived_dropoff' 
                        ? '#C6F432' 
                        : isDarkMode ? '#C6F432' : '#1F4230'
                    }
                  ]}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      TYPOGRAPHY.bodyBold,
                      {
                        color: activeOrder.stage === 'arrived_dropoff' 
                          ? '#14281C' 
                          : isDarkMode ? '#14281C' : '#FFFFFF'
                      }
                    ]}
                  >
                    {ORDER_STAGES[activeOrder.stage]?.buttonLabel || 'Next stage'} →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* No active order in flight */
            <Card variant="subtle" style={styles.noOrderCard}>
              <View style={{ alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="cube-outline" size={32} color={colors.textMuted} />
              </View>
              <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary, textAlign: 'center' }]}>
                No Live Trip In Progress
              </Text>
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, textAlign: 'center', marginTop: 4, maxWidth: 260 }]}>
                You don't have any ongoing deliveries right now. Check the Duty tab to accept new incoming offers.
              </Text>
              <TouchableOpacity
                onPress={() => setActiveTab('duty')}
                style={[styles.goDutyBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
                activeOpacity={0.85}
              >
                <Text style={[TYPOGRAPHY.bodyBold, { color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
                  View Job Offers in Duty
                </Text>
              </TouchableOpacity>
            </Card>
          )
        ) : (
          /* ─── Delivered Trips History List ─── */
          <View style={{ gap: SPACING.sm }}>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, paddingHorizontal: 4 }]}>
              {deliveredTrips.length} completed orders logged today
            </Text>

            {deliveredTrips.map((trip) => (
              <Card key={trip.id} style={{ borderColor: colors.cardBorder }}>
                <View style={styles.tripHeaderRow}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                        {trip.orderId}
                      </Text>
                      {trip.isTryOn && <StatusPill label="Try-on" variant="tryon" showDot={false} />}
                    </View>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                      {trip.customerName} · {trip.time}
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted, marginTop: 1 }]}>
                      Pickups: {trip.pickupShop}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[TYPOGRAPHY.h3, { color: colors.success }]}>
                      +₹{trip.amount}
                    </Text>
                    <StatusPill label="DELIVERED" variant="verified" />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ─── Customer PIN Entry BottomSheet ─── */}
      <BottomSheet
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        title="Enter Customer Delivery PIN"
        subtitle="Ask customer for their 4-digit verification code"
      >
        <KeypadPIN
          expectedPinHint={activeOrder?.customerPin}
          errorMessage={pinErrorMessage}
          onComplete={(enteredPin) => {
            const res = completeDeliveryWithPin(enteredPin);
            if (!res.success) {
              setPinErrorMessage(res.error || 'Incorrect PIN');
            } else {
              setShowPinModal(false);
            }
          }}
        />
      </BottomSheet>

      {/* ─── Delivery Success / Earnings Celebration Modal ─── */}
      <BottomSheet
        visible={isDeliverySuccessModalOpen}
        onClose={closeDeliverySuccessModal}
        title="Delivery Completed"
        subtitle="10-minute doorstep try-on verified"
      >
        <View style={styles.successModalContent}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={40} color="#15803D" />
          </View>

          <Text style={[TYPOGRAPHY.h1, { color: colors.textPrimary, textAlign: 'center', marginTop: 12 }]}>
            +₹84 Credited
          </Text>
          <Text style={[TYPOGRAPHY.subtext, { color: colors.success, textAlign: 'center', fontWeight: '700', marginTop: 2 }]}>
            ₹64 Base + ₹20 Try-On Waiting Bonus
          </Text>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>
            Payout added to your wallet · 100% of tips are yours with zero deductions.
          </Text>

          <TouchableOpacity
            onPress={() => {
              closeDeliverySuccessModal();
              setActiveTab('earnings');
            }}
            style={[styles.successDoneBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
            activeOpacity={0.85}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
              View Updated Earnings & Wallet →
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* ─── Delay Reasons BottomSheet ─── */}
      <BottomSheet
        visible={showDelayModal}
        onClose={() => setShowDelayModal(false)}
        title="Report Delivery Delay"
        subtitle="Inform dispatch controller to update customer ETA"
      >
        <View style={{ gap: 8 }}>
          {[
            'High traffic jam on 100ft Road / CMH Road',
            'Heavy rain / waterlogged underpass',
            'Dark store shop packing delayed',
            'Customer apartment gate security delay',
            'EV battery low (<15%) · swapping battery'
          ].map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => reportDelay(reason)}
              style={[styles.modalOptionRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textPrimary, fontWeight: '600' }]}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* ─── Emergency SOS BottomSheet ─── */}
      <BottomSheet
        visible={showSosModal}
        onClose={() => setShowSosModal(false)}
        title="Emergency SOS & Safety"
        subtitle="Immediate safety assistance and dispatch escalation"
      >
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={() => triggerEmergencySos('112')}
            style={[styles.sosCallBtn, { backgroundColor: '#DC2626' }]}
            activeOpacity={0.85}
          >
            <Ionicons name="shield-outline" size={18} color="#FFFFFF" />
            <View style={{ flex: 1 }}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: '#FFFFFF' }]}>
                Dial Police / Ambulance (112)
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: '#FEE2E2' }]}>
                Transmits real-time GPS telemetry to Bengaluru Police
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => triggerEmergencySos('dispatch')}
            style={[styles.sosOptionRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="radio-outline" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                Trigger Silent Dispatch SOS
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                Dark store manager alerts nearby riders and sends assistance
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => triggerEmergencySos('hub')}
            style={[styles.sosOptionRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={18} color={colors.textPrimary} />
            <View style={{ flex: 1 }}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                Call Hub Manager (Rajesh Murthy)
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                Direct line: +91 98450 11234
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  topTabsWrapper: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 110
  },
  tripHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  smallActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET - 10
  },
  mapCanvas: {
    height: 180,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center'
  },
  mapGridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mapNodesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.md
  },
  mapNode: {
    alignItems: 'center'
  },
  riderLiveNode: {
    alignItems: 'center'
  },
  mapPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scooterPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1F4230',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C6F432'
  },
  scooterHalo: {
    position: 'absolute',
    top: -4,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(198, 244, 50, 0.3)'
  },
  mapLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginTop: 4
  },
  mapBottomBar: {
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navigateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    minHeight: TOUCH_TARGET
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm
  },
  contactRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.md
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minHeight: TOUCH_TARGET
  },
  tryOnCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    marginTop: SPACING.md
  },
  checkboxSquare: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickupCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  verifyItemBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    minHeight: TOUCH_TARGET - 10
  },
  stickyButtonContainer: {
    marginTop: SPACING.xs
  },
  primaryStageButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET + 6
  },
  noOrderCard: {
    paddingVertical: 48,
    alignItems: 'center'
  },
  goDutyBtn: {
    marginTop: SPACING.lg,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.pill,
    minHeight: TOUCH_TARGET
  },
  successModalContent: {
    alignItems: 'center',
    paddingVertical: SPACING.md
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successDoneBtn: {
    marginTop: SPACING.xl,
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET
  },
  modalOptionRow: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  sosCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
    borderRadius: RADIUS.md
  },
  sosOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1
  }
});
