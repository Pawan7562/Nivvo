// ============================================================================
// SCREEN 3: EARNINGS & INSTANT PAYOUTS
// ============================================================================

import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  SafeAreaView, TextInput 
} from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { StatusPill } from '../components/StatusPill';
import { BottomSheet } from '../components/BottomSheet';
import { Ionicons } from '@expo/vector-icons';

type PeriodTab = 'Today' | 'This week' | 'This month';

export const EarningsScreen: React.FC = () => {
  const {
    partner,
    earningsStats,
    milestones,
    deliveredTrips,
    payouts,
    isDarkMode,
    requestInstantPayout,
    showToast
  } = useRiderStore();

  const colors = isDarkMode ? darkColors : lightColors;

  const [activePeriod, setActivePeriod] = useState<PeriodTab>('Today');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');

  const currentStats = earningsStats[activePeriod];

  // Weekly bar chart data
  const weekBars = [
    { day: 'M', height: '60%', amount: '₹620' },
    { day: 'T', height: '75%', amount: '₹710' },
    { day: 'W', height: '45%', amount: '₹480' },
    { day: 'T', height: '85%', amount: '₹820' },
    { day: 'F', height: '65%', amount: '₹650' },
    { day: 'S', height: '80%', amount: '₹790' },
    { day: 'S', height: '95%', amount: `₹${partner.todayEarnings}`, isToday: true }
  ];

  const handleWithdrawSubmit = () => {
    const amt = parseInt(withdrawAmount, 10);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    const res = requestInstantPayout(amt);
    if (res.success) {
      setShowWithdrawModal(false);
    }
  };

  const handleDownloadStatement = () => {
    showToast('Statement generated! Downloading PDF for Indiranagar Hub records...', 'success');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. Header & Period Tabs ─── */}
        <View style={styles.topSection}>
          <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary }]}>
            Earnings & Payouts
          </Text>
          <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginTop: 1 }]}>
            Transparent hourly & trip breakdown with zero deductions
          </Text>

          <View style={{ marginTop: SPACING.md }}>
            <Tabs
              tabs={[
                { id: 'Today' as const, label: 'Today' },
                { id: 'This week' as const, label: 'This week' },
                { id: 'This month' as const, label: 'This month' }
              ]}
              activeTab={activePeriod}
              onSelectTab={setActivePeriod}
            />
          </View>
        </View>

        {/* ─── 2. Total Earnings Hero Card ─── */}
        <Card variant="forest" style={styles.heroCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={[TYPOGRAPHY.caption, { color: '#B6C8BA' }]}>
                {activePeriod.toUpperCase()} EARNINGS
              </Text>
              <Text style={[TYPOGRAPHY.h1, { color: '#C6F432', fontSize: 32, marginTop: 2 }]}>
                ₹{currentStats.total}
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: '#D4DEC9', marginTop: 2 }]}>
                {currentStats.deltaText} · {currentStats.tripsCount} trips
              </Text>
            </View>

            <StatusPill label="IMPS INSTANT" variant="surge" showDot={false} />
          </View>

          {/* Action Row: Instant Payout Button & Download Statement */}
          <View style={styles.heroActionRow}>
            <TouchableOpacity
              onPress={() => setShowWithdrawModal(true)}
              style={styles.withdrawCtaBtn}
              activeOpacity={0.85}
              accessibilityLabel="Withdraw now"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="flash" size={15} color="#14281C" />
                <Text style={[TYPOGRAPHY.subtext, { fontWeight: '800', color: '#14281C' }]}>
                  Instant Withdraw
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDownloadStatement}
              style={styles.statementBtn}
              activeOpacity={0.8}
              accessibilityLabel="Download statement"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="download-outline" size={15} color="#FFFFFF" />
                <Text style={[TYPOGRAPHY.subtext, { fontWeight: '700', color: '#FFFFFF' }]}>
                  Statement PDF
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ─── 3. Incentive Milestones with Progress Bars ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
            Incentive Milestones
          </Text>

          <View style={{ gap: SPACING.sm }}>
            {milestones.map((ms) => {
              const progressPct = Math.min(100, Math.round((ms.completedTrips / ms.targetTrips) * 100));
              return (
                <Card key={ms.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                        {ms.title}
                      </Text>
                      <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                        {ms.subtitle}
                      </Text>
                    </View>
                    <StatusPill label={`+₹${ms.rewardAmount}`} variant="surge" showDot={false} />
                  </View>

                  {/* Progress Bar */}
                  <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${progressPct}%`, backgroundColor: '#C6F432' }
                      ]} 
                    />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
                      {ms.completedTrips}/{ms.targetTrips} trips completed ({progressPct}%)
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>
                      {ms.expiresText}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>

        {/* ─── 4. Detailed Earnings Breakdown ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
            Pay Breakdown ({activePeriod})
          </Text>

          <Card>
            <View style={styles.breakdownRow}>
              <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>Base Delivery Pay</Text>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>₹{currentStats.basePay}</Text>
            </View>

            <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: colors.divider }]}>
              <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>Peak Demand & Surge Bonus</Text>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.success }]}>+₹{currentStats.surge}</Text>
            </View>

            <View style={[styles.breakdownRow, { borderTopWidth: 1, borderTopColor: colors.divider }]}>
              <View>
                <Text style={[TYPOGRAPHY.body, { color: colors.textSecondary }]}>Customer Doorstep Tips</Text>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>100% passed to you · zero fee</Text>
              </View>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.success }]}>+₹{currentStats.tips}</Text>
            </View>

            <View style={[styles.breakdownRow, styles.totalRow, { borderTopWidth: 1.5, borderTopColor: colors.cardBorder }]}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>Total Credited Amount</Text>
              <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary }]}>₹{currentStats.total}</Text>
            </View>
          </Card>
        </View>

        {/* ─── 5. Weekly Visual Bar Chart (Mon–Sun) ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
            Weekly Activity (Indiranagar Hub)
          </Text>

          <Card>
            <View style={styles.chartContainer}>
              {weekBars.map((item, idx) => (
                <View key={idx} style={styles.barCol}>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted, fontSize: 10 }]}>
                    {item.amount}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceSubtle }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: item.height as any,
                          backgroundColor: item.isToday ? '#C6F432' : isDarkMode ? '#284232' : '#1F4230'
                        }
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      TYPOGRAPHY.caption,
                      {
                        fontWeight: item.isToday ? '800' : '600',
                        color: item.isToday ? colors.primary : colors.textSecondary
                      }
                    ]}
                  >
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* ─── 6. Next Settlement Date & Bank Info ─── */}
        <Card variant="subtle" style={{ marginTop: SPACING.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                Next Auto-Settlement: Wednesday, 28 Oct
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                Scheduled transfer to HDFC Bank · A/c ending in 4821 (or use Instant Withdraw anytime)
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── 7. Recent Trips Ledger ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
            Recent Trip Ledger ({deliveredTrips.length})
          </Text>

          <View style={{ gap: SPACING.sm }}>
            {deliveredTrips.slice(0, 4).map((trip) => (
              <Card key={trip.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                        {trip.orderId}
                      </Text>
                      {trip.isTryOn && (
                        <StatusPill label="Try-on" variant="tryon" showDot={false} />
                      )}
                    </View>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                      {trip.customerName} · {trip.time}
                    </Text>
                  </View>

                  <Text style={[TYPOGRAPHY.bodyBold, { color: colors.success }]}>
                    +₹{trip.amount}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ─── Instant Payout Modal with Presets ─── */}
      <BottomSheet
        visible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Instant IMPS Payout"
        subtitle={`Available balance: ₹${partner.todayEarnings}`}
      >
        <View style={{ gap: 12 }}>
          <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
            Amount will be transferred immediately to: <Text style={{ fontWeight: '700', color: colors.textPrimary }}>aarav@okhdfcbank</Text>
          </Text>

          {/* Amount input */}
          <View style={[styles.amountInputWrap, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>₹</Text>
            <TextInput
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="number-pad"
              style={[styles.amountInput, { color: colors.textPrimary }]}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Amount Presets */}
          <View style={styles.presetsRow}>
            {[
              { label: '₹200', value: '200' },
              { label: '₹500', value: '500' },
              { label: '₹800', value: '800' },
              { label: 'Full Balance', value: `${partner.todayEarnings}` }
            ].map((p) => (
              <TouchableOpacity
                key={p.label}
                onPress={() => setWithdrawAmount(p.value)}
                style={[styles.presetChip, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
                activeOpacity={0.7}
              >
                <Text style={[TYPOGRAPHY.caption, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Payout Button */}
          <TouchableOpacity
            onPress={handleWithdrawSubmit}
            style={[styles.confirmPayoutBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
            activeOpacity={0.85}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
              Confirm & Transfer ₹{withdrawAmount || '0'}
            </Text>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 110
  },
  topSection: {
    marginBottom: SPACING.md
  },
  heroCard: {
    marginBottom: SPACING.sm
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.lg
  },
  withdrawCtaBtn: {
    flex: 1.2,
    backgroundColor: '#C6F432',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET
  },
  statementBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  totalRow: {
    paddingTop: 14,
    marginTop: 4
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    gap: 6
  },
  barTrack: {
    width: 22,
    height: 90,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    borderRadius: 6
  },
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800'
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmPayoutBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET,
    marginTop: 8
  }
});
