// ============================================================================
// SCREEN 1: DUTY (HOME)
// ============================================================================

import React, { useEffect, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  Switch, Image, SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';
import { Card } from '../components/Card';
import { StatusPill } from '../components/StatusPill';
import { BottomSheet } from '../components/BottomSheet';
import { mockBusyZones } from '../data/mockData';

export const DutyScreen: React.FC = () => {
  const {
    partner,
    vehicle,
    activeOrder,
    jobOffers,
    isDarkMode,
    toggleDuty,
    decrementOfferTimer,
    acceptJobOffer,
    declineJobOffer,
    setActiveTab,
    showToast,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useRiderStore();

  const colors = isDarkMode ? darkColors : lightColors;
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [declineReasonModalId, setDeclineReasonModalId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 20-second countdown tick for job offers when online
  useEffect(() => {
    if (!partner.isOnline) return;
    const interval = setInterval(() => {
      decrementOfferTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [partner.isOnline, decrementOfferTimer]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. Header ─── */}
        <View style={styles.headerRow}>
          {/* Rider Avatar & Identity */}
          <View style={styles.riderIdentity}>
            <View style={[styles.avatarWrap, { borderColor: colors.cardBorder }]}>
              <Ionicons name="flash" size={18} color="#C6F432" />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                  {partner.name}
                </Text>
                <StatusPill 
                  label={partner.isOnline ? 'ONLINE' : 'OFFLINE'}
                  variant={partner.isOnline ? 'online' : 'offline'}
                />
              </View>
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary }]}>
                {partner.partnerId} · {partner.hubName}
              </Text>
            </View>
          </View>

          {/* Top Actions: Earnings Pill, Notifications Bell, Menu */}
          <View style={styles.headerActions}>
            {/* Tappable "₹ today" earnings pill */}
            <TouchableOpacity
              onPress={() => setActiveTab('earnings')}
              activeOpacity={0.8}
              style={[
                styles.earningsPill,
                { 
                  backgroundColor: isDarkMode ? '#1F2E24' : '#E8F5E9',
                  borderColor: isDarkMode ? '#2B4232' : '#CBE6CD' 
                }
              ]}
              accessibilityLabel="View today's earnings"
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: isDarkMode ? '#C6F432' : '#15803D' }}>
                ₹{partner.todayEarnings}
              </Text>
            </TouchableOpacity>

            {/* Notifications Button */}
            <TouchableOpacity
              onPress={() => setShowNotificationsSheet(true)}
              style={[styles.circleButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={17} color={colors.textPrimary} />
              {unreadCount > 0 && <View style={styles.badgeDot} />}
            </TouchableOpacity>

            {/* Menu Button */}
            <TouchableOpacity
              onPress={() => setShowMenuSheet(true)}
              style={[styles.circleButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              accessibilityLabel="Fleet Menu"
            >
              <Ionicons name="menu" size={19} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── 2. Duty Card (Forest Green & Lime) ─── */}
        <Card variant="forest" style={styles.dutyCard}>
          {/* Top: Online / Offline Switch */}
          <View style={styles.dutyHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[TYPOGRAPHY.h2, { color: '#FFFFFF' }]}>
                {partner.isOnline ? "You're online & ready" : "You're currently offline"}
              </Text>
              <Text style={[TYPOGRAPHY.subtext, { color: '#D4DEC9', marginTop: 2 }]}>
                {partner.isOnline 
                  ? 'Active for 10–18 min Indiranagar drops' 
                  : 'Turn on to receive nearby orders and bonuses'}
              </Text>
            </View>

            {/* Large Tactile Switch */}
            <Switch
              value={partner.isOnline}
              onValueChange={toggleDuty}
              trackColor={{ false: '#3B5445', true: '#C6F432' }}
              thumbColor={partner.isOnline ? '#14281C' : '#FFFFFF'}
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </Card>

        {/* ─── 4. When Online: Job Offers with 20-Second Countdown ─── */}
        {partner.isOnline ? (
          <View style={{ marginTop: SPACING.sm }}>
            <View style={styles.sectionTitleRow}>
              <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                Incoming Job Offers ({jobOffers.length})
              </Text>
              {jobOffers.length > 0 && (
                <StatusPill 
                  label={`Auto-refreshing (${jobOffers[0]?.secondsRemaining || 20}s)`} 
                  variant="tryon"
                />
              )}
            </View>

            {jobOffers.length === 0 ? (
              <Card variant="subtle" style={styles.emptyCard}>
                <View style={{ alignItems: 'center', marginBottom: 6 }}>
                  <Ionicons name="radio-outline" size={28} color={colors.textSecondary} />
                </View>
                <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
                  Scanning Indiranagar Zone...
                </Text>
                <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, textAlign: 'center', marginTop: 2 }]}>
                  Dark store proximity matching active. You will hear an alert sound on new orders.
                </Text>
              </Card>
            ) : (
              jobOffers.map((offer) => (
                <Card key={offer.id} style={styles.offerCard}>
                  {/* Top: Payout, Surge & 20s Countdown */}
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                        <Text style={[TYPOGRAPHY.h1, { color: colors.textPrimary }]}>
                          ₹{offer.payout + offer.surgeBonus}
                        </Text>
                        {offer.surgeBonus > 0 && (
                          <StatusPill label={`+₹${offer.surgeBonus} Surge`} variant="surge" showDot={false} />
                        )}
                      </View>
                      <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                        Order {offer.orderId} · {offer.pickupsCount} pickups · 1 drop
                      </Text>
                    </View>

                    {/* 20-second countdown pill */}
                    <View style={[styles.timerBadge, { backgroundColor: isDarkMode ? '#382216' : '#FEF3C7' }]}>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: '#B45309' }}>
                        {offer.secondsRemaining}s left
                      </Text>
                    </View>
                  </View>

                  {/* Pickups and Customer drop list */}
                  <View style={[styles.routeBox, { backgroundColor: colors.surfaceSubtle }]}>
                    {offer.shops.map((shop, idx) => (
                      <View key={idx} style={styles.shopRow}>
                        <View style={styles.stopNum}>
                          <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                            {shop.name}
                          </Text>
                          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                            {shop.item} · {shop.distance} away
                          </Text>
                        </View>
                      </View>
                    ))}

                    <View style={styles.customerRow}>
                      <View style={[styles.stopNum, { backgroundColor: '#C6F432' }]}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#14281C' }}>D</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                          Drop: {offer.customer.name}
                        </Text>
                        <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                          {offer.customer.area} {offer.isTryOn ? '· 10-min Try-on' : ''}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Route Summary */}
                  <View style={styles.routeSummaryRow}>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                      Total Distance: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{offer.totalDistance}</Text>
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                      Est. Time: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{offer.estTime}</Text>
                    </Text>
                  </View>

                  {/* Action Buttons: Accept / Decline */}
                  <View style={styles.offerButtonRow}>
                    <TouchableOpacity
                      onPress={() => setDeclineReasonModalId(offer.id)}
                      style={[styles.declineButton, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}
                      activeOpacity={0.7}
                    >
                      <Text style={[TYPOGRAPHY.subtext, { fontWeight: '700', color: colors.textSecondary }]}>
                        Decline
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => acceptJobOffer(offer.id)}
                      style={styles.acceptButton}
                      activeOpacity={0.85}
                    >
                      <Text style={[TYPOGRAPHY.bodyBold, { color: '#14281C' }]}>
                        Accept job · ₹{offer.payout + offer.surgeBonus}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              ))
            )}
          </View>
        ) : (
          /* ─── 5. Offline State Card ─── */
          <Card variant="subtle" style={styles.offlineCard}>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="pause-circle-outline" size={36} color={colors.textMuted} />
            </View>
            <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary, textAlign: 'center' }]}>
              You are currently offline
            </Text>
            <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, textAlign: 'center', marginTop: 4, maxWidth: 280, alignSelf: 'center' }]}>
              Switch duty ON to start receiving nearby 10-minute dark store pickups and doorstep try-on jobs in Indiranagar.
            </Text>
            <TouchableOpacity
              onPress={toggleDuty}
              style={[styles.goOnlineBigButton, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
              activeOpacity={0.85}
            >
              <Text style={[TYPOGRAPHY.bodyBold, { color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
                Go online now
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* ─── 6. "Busy Zones Near You" List ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <View style={styles.sectionTitleRow}>
            <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
              Busy Zones Near You
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
              Indiranagar Hub #14
            </Text>
          </View>

          <Card noPadding style={{ marginTop: SPACING.xs }}>
            {mockBusyZones.map((zone, idx) => {
              const isLast = idx === mockBusyZones.length - 1;
              let badgeVariant: 'surge' | 'warning' | 'info' = 'info';
              if (zone.demandLevel === 'High') badgeVariant = 'surge';
              else if (zone.demandLevel === 'Medium') badgeVariant = 'warning';

              return (
                <View
                  key={zone.id}
                  style={[
                    styles.busyZoneRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider }
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                      {zone.name}
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                      {zone.distanceKm} km away · ~{zone.estWaitMinutes} min order wait
                    </Text>
                  </View>
                  <StatusPill 
                    label={`${zone.demandLevel.toUpperCase()} DEMAND · ${zone.surgeMultiplier}`}
                    variant={badgeVariant}
                    showDot={zone.demandLevel === 'High'}
                  />
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>

      {/* ─── Decline Reason BottomSheet Modal ─── */}
      <BottomSheet
        visible={declineReasonModalId !== null}
        onClose={() => setDeclineReasonModalId(null)}
        title="Decline Delivery Offer"
        subtitle="Help dispatch reassign orders effectively"
      >
        <View style={{ gap: 8 }}>
          {[
            'Distance too far / high traffic on CMH Road',
            'EV battery low (< 20%) · heading to swap station',
            'Scheduled shift / lunch break',
            'Inclement weather / heavy rain',
            'Multiple large garment boxes'
          ].map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => {
                if (declineReasonModalId) {
                  declineJobOffer(declineReasonModalId, reason);
                  setDeclineReasonModalId(null);
                }
              }}
              style={[styles.reasonOption, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textPrimary, fontWeight: '600' }]}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* ─── Notifications BottomSheet Modal ─── */}
      <BottomSheet
        visible={showNotificationsSheet}
        onClose={() => setShowNotificationsSheet(false)}
        title="Fleet Broadcasts & Alerts"
        subtitle="Live dispatch alerts for Indiranagar Hub"
      >
        <View style={{ gap: 10 }}>
          <TouchableOpacity 
            onPress={markAllNotificationsRead} 
            style={{ alignSelf: 'flex-end', paddingVertical: 4 }}
          >
            <Text style={[TYPOGRAPHY.caption, { color: colors.primary, fontWeight: '700' }]}>
              Mark all read
            </Text>
          </TouchableOpacity>

          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              onPress={() => markNotificationRead(n.id)}
              style={[
                styles.notifItem,
                {
                  backgroundColor: n.read ? colors.card : colors.surfaceSubtle,
                  borderColor: colors.cardBorder
                }
              ]}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>{n.title}</Text>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>{n.time}</Text>
              </View>
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginTop: 4 }]}>
                {n.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* ─── Fleet Menu BottomSheet Modal ─── */}
      <BottomSheet
        visible={showMenuSheet}
        onClose={() => setShowMenuSheet(false)}
        title="Fleet Options & Menu"
        subtitle="Quick shortcuts and partner settings"
      >
        <View style={{ gap: 10 }}>
          {[
            { label: 'View Today’s Earnings Breakdown', tab: 'earnings' as const, iconName: 'wallet-outline' as const },
            { label: 'View Active & Delivered Orders', tab: 'orders' as const, iconName: 'cube-outline' as const },
            { label: '24/7 Dispatch Help & Helpline', tab: 'support' as const, iconName: 'headset-outline' as const },
            { label: 'EV Scooter Health & KYC Documents', tab: 'profile' as const, iconName: 'bicycle-outline' as const }
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                setShowMenuSheet(false);
                setActiveTab(item.tab);
              }}
              style={[styles.menuOptionRow, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
              activeOpacity={0.8}
            >
              <Ionicons name={item.iconName} size={18} color={colors.textPrimary} />
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary, flex: 1 }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  riderIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1F4230',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  earningsPill: {
    paddingHorizontal: 10,
    height: 34,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  badgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C6F432',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  dutyCard: {
    marginBottom: SPACING.sm
  },
  dutyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  vehicleStrip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  statsRibbon: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingTop: SPACING.md
  },
  statBox: {
    flex: 1,
    alignItems: 'center'
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.12)'
  },
  activeOrderCard: {
    borderWidth: 2,
    marginBottom: SPACING.sm
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs
  },
  resumeButton: {
    marginTop: SPACING.md,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  emptyCard: {
    paddingVertical: 32,
    alignItems: 'center'
  },
  offerCard: {
    marginBottom: SPACING.sm
  },
  timerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill
  },
  routeBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginVertical: SPACING.sm,
    gap: 8
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 8
  },
  stopNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1F4230',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  routeSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: SPACING.md
  },
  offerButtonRow: {
    flexDirection: 'row',
    gap: 10
  },
  declineButton: {
    flex: 1,
    minHeight: TOUCH_TARGET,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  acceptButton: {
    flex: 2.2,
    minHeight: TOUCH_TARGET,
    borderRadius: RADIUS.md,
    backgroundColor: '#C6F432',
    alignItems: 'center',
    justifyContent: 'center'
  },
  offlineCard: {
    paddingVertical: 36,
    alignItems: 'center'
  },
  goOnlineBigButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: RADIUS.pill,
    minHeight: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center'
  },
  busyZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md
  },
  reasonOption: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  notifItem: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1
  }
});
