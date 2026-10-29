// ============================================================================
// SCREEN 5: PROFILE & VEHICLE HUB
// ============================================================================

import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  SafeAreaView, Alert, Linking, Switch 
} from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { StatusPill } from '../components/StatusPill';
import { BottomSheet } from '../components/BottomSheet';
import { mockCompliments } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

type ProfileTab = 'scorecard' | 'ev' | 'kyc';

export const ProfileScreen: React.FC = () => {
  const {
    partner,
    vehicle,
    hub,
    isDarkMode,
    toggleDarkMode,
    showToast,
    toggleDuty
  } = useRiderStore();

  const colors = isDarkMode ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<ProfileTab>('scorecard');
  const [showSignoutWarning, setShowSignoutWarning] = useState(false);

  const handleSignOutPress = () => {
    if (partner.isOnline) {
      setShowSignoutWarning(true);
    } else {
      showToast('Logged out of fleet partner session safely.');
    }
  };

  const handleCallManager = () => {
    showToast(`Calling Hub Manager ${hub.managerName} (${hub.managerPhone})...`);
    Linking.openURL(`tel:${hub.managerPhone}`).catch(() => {
      showToast('Dialer simulation');
    });
  };

  const handleSwitchToCustomerMode = () => {
    showToast('Switching to Nivvo Customer Shopping Mode...', 'success');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. Rider Header Card (Identity, Tier, Phone, Blood Group) ─── */}
        <Card variant="forest" style={styles.riderHeroCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.largeAvatar}>
              <Ionicons name="person" size={26} color="#C6F432" />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[TYPOGRAPHY.h2, { color: '#FFFFFF' }]}>
                  {partner.name}
                </Text>
                <StatusPill label={partner.tier} variant="surge" showDot={false} />
              </View>

              <Text style={[TYPOGRAPHY.subtext, { color: '#D4DEC9', marginTop: 2 }]}>
                {partner.partnerId} · Active since {partner.activeSince}
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: '#B6C8BA', marginTop: 2 }]}>
                Phone: {partner.phone} · Blood Group: <Text style={{ color: '#C6F432', fontWeight: '800' }}>{partner.bloodGroup}</Text>
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── 2. 4 Performance KPIs Grid ─── */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiBox}>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>TOTAL TRIPS</Text>
            <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary, marginTop: 2 }]}>
              {partner.totalTrips}
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.success, fontWeight: '700' }]}>
              Indiranagar
            </Text>
          </Card>

          <Card style={styles.kpiBox}>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>RATING</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={[TYPOGRAPHY.h2, { color: colors.primary }]}>
                {partner.rating}
              </Text>
            </View>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>
              Top 5% Partner
            </Text>
          </Card>

          <Card style={styles.kpiBox}>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>ON-TIME %</Text>
            <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary, marginTop: 2 }]}>
              {partner.onTimePercent}%
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.success, fontWeight: '700' }]}>
              Under 14 min
            </Text>
          </Card>

          <Card style={styles.kpiBox}>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>ACCEPTANCE</Text>
            <Text style={[TYPOGRAPHY.h2, { color: colors.textPrimary, marginTop: 2 }]}>
              {partner.acceptancePercent}%
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>
              High priority
            </Text>
          </Card>
        </View>

        {/* ─── 3. Sub-Tabs: Scorecard / EV Scooter / KYC & Bank ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Tabs
            tabs={[
              { id: 'scorecard' as const, label: 'Scorecard' },
              { id: 'ev' as const, label: 'EV scooter' },
              { id: 'kyc' as const, label: 'KYC & bank' }
            ]}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </View>

        {/* Tab 1: Scorecard & Customer Compliments */}
        {activeTab === 'scorecard' && (
          <View style={{ marginTop: SPACING.sm, gap: SPACING.sm }}>
            <Card>
              <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
                Customer Compliments & Badges ({partner.totalTrips} Trips)
              </Text>
              <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginBottom: SPACING.md }]}>
                Feedback given by doorstep footwear try-on and garment customers:
              </Text>

              <View style={styles.complimentsGrid}>
                {mockCompliments.map((comp) => (
                  <View 
                    key={comp.id} 
                    style={[styles.compCard, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}
                  >
                    <Ionicons 
                      name={
                        comp.id === 'comp-1' ? 'flash-outline' :
                        comp.id === 'comp-2' ? 'thumbs-up-outline' :
                        comp.id === 'comp-3' ? 'time-outline' :
                        'shield-checkmark-outline'
                      } 
                      size={22} 
                      color={colors.primary} 
                    />
                    <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginTop: 4 }]}>
                      {comp.count}
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, textAlign: 'center', marginTop: 1 }]}>
                      {comp.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* Tab 2: EV Scooter & Battery Swap Station */}
        {activeTab === 'ev' && (
          <View style={{ marginTop: SPACING.sm, gap: SPACING.sm }}>
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                    {vehicle.model}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                    Reg: {vehicle.registrationNumber} · Zero Emission Fleet
                  </Text>
                </View>
                <StatusPill label={`${vehicle.batteryPercent}% BATTERY`} variant="verified" />
              </View>

              <View style={[styles.batteryBarTrack, { backgroundColor: colors.surfaceSubtle }]}>
                <View style={[styles.batteryBarFill, { width: `${vehicle.batteryPercent}%`, backgroundColor: '#C6F432' }]} />
              </View>

              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 6 }]}>
                Estimated range remaining: <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{vehicle.rangeKm} km</Text> (Sufficient for ~18 more drops)
              </Text>
            </Card>

            {/* Nearest Swap Station Card */}
            <Card variant="subtle">
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <Ionicons name="battery-charging-outline" size={22} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                    Nearest Swap: {vehicle.nearestSwapStation.name}
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                    {vehicle.nearestSwapStation.address} · {vehicle.nearestSwapStation.distanceKm} km away
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.success, fontWeight: '800', marginTop: 4 }]}>
                    {vehicle.nearestSwapStation.availableBatteries} charged batteries available now
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Tab 3: KYC Documents & Bank Account */}
        {activeTab === 'kyc' && (
          <View style={{ marginTop: SPACING.sm, gap: SPACING.sm }}>
            <Card>
              <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.sm }]}>
                Verified Fleet Credentials
              </Text>

              {[
                { title: 'Driving License', subtitle: 'DL-04202100892 · Commercial 2W', status: 'VERIFIED' },
                { title: 'Aadhaar Identity Card', subtitle: 'XXXX-XXXX-4819 · UIDAI Linked', status: 'VERIFIED' },
                { title: 'EV Commercial Insurance', subtitle: 'Ather Energy Comprehensive Policy · Valid 2027', status: 'VERIFIED' },
                { title: 'Police Background Verification', subtitle: 'BGC-BLR-8921 · Cleared & Active', status: 'VERIFIED' }
              ].map((doc, idx) => (
                <View
                  key={doc.title}
                  style={[
                    styles.kycRow,
                    idx > 0 && { borderTopWidth: 1, borderTopColor: colors.divider }
                  ]}
                >
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                      {doc.title}
                    </Text>
                    <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                      {doc.subtitle}
                    </Text>
                  </View>
                  <StatusPill label="VERIFIED" variant="verified" />
                </View>
              ))}
            </Card>

            <Card>
              <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
                Payout Bank & UPI Account
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginBottom: SPACING.sm }]}>
                Instant IMPS withdrawals are routed to this account:
              </Text>

              <View style={[styles.bankCard, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons name="business-outline" size={22} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                    HDFC Bank · Indiranagar Branch
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 1 }]}>
                    A/c: ****4821 · IFSC: HDFC0000184
                  </Text>
                  <Text style={[TYPOGRAPHY.caption, { color: colors.primary, fontWeight: '700', marginTop: 2 }]}>
                    UPI VPA: aarav@okhdfcbank
                  </Text>
                </View>
                <StatusPill label="PRIMARY" variant="surge" showDot={false} />
              </View>
            </Card>
          </View>
        )}

        {/* ─── 4. Assigned Dark Store Hub Card with Manager Contact ─── */}
        <View style={{ marginTop: SPACING.md }}>
          <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary, marginBottom: SPACING.xs }]}>
            Assigned Dark Store Hub
          </Text>

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                  {hub.name} ({hub.hubCode})
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginTop: 2 }]}>
                  {hub.address}
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted, marginTop: 2 }]}>
                  Operating hours: {hub.operatingHours}
                </Text>
              </View>
              <StatusPill label="ACTIVE HUB" variant="verified" />
            </View>

            <View style={[styles.managerBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]}>
              <View style={{ flex: 1 }}>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textMuted }]}>HUB MANAGER</Text>
                <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary, marginTop: 1 }]}>
                  {hub.managerName}
                </Text>
                <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                  {hub.managerPhone}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCallManager}
                style={[styles.managerCallBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
                activeOpacity={0.85}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="call" size={13} color={isDarkMode ? '#14281C' : '#FFFFFF'} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: isDarkMode ? '#14281C' : '#FFFFFF' }}>
                    Call Manager
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* ─── 5. App Settings & Mode Actions ─── */}
        <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
          {/* Dark Mode Toggle */}
          <Card style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary }]}>
                Dark Interface Mode
              </Text>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary }]}>
                Optimized for night duty and battery preservation
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#3B5445', true: '#C6F432' }}
              thumbColor={isDarkMode ? '#14281C' : '#FFFFFF'}
            />
          </Card>

          {/* Switch to Customer Shopping Mode */}
          <TouchableOpacity
            onPress={handleSwitchToCustomerMode}
            style={[styles.customerModeBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="bag-handle-outline" size={18} color={colors.primary} />
            <Text style={[TYPOGRAPHY.bodyBold, { color: colors.textPrimary, flex: 1 }]}>
              Switch to Customer Mode
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOutPress}
            style={[styles.signOutBtn, { borderColor: '#FCA5A5', backgroundColor: colors.card }]}
            activeOpacity={0.8}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: '#DC2626' }]}>
              Sign out of partner session
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── Sign Out Warning BottomSheet (if still online) ─── */}
      <BottomSheet
        visible={showSignoutWarning}
        onClose={() => setShowSignoutWarning(false)}
        title="Duty Is Currently Online"
        subtitle="Please pause your duty before signing out"
      >
        <View style={{ gap: 12 }}>
          <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, lineHeight: 18 }]}>
            You are currently marked <Text style={{ fontWeight: '800', color: colors.textPrimary }}>ONLINE</Text> in the Indiranagar dispatch queue. Signing out without pausing will reject incoming orders and negatively impact your acceptance score.
          </Text>

          <TouchableOpacity
            onPress={() => {
              toggleDuty(); // Turns duty offline
              setShowSignoutWarning(false);
              showToast('Duty set to offline. You may now sign out safely.', 'success');
            }}
            style={[styles.pauseAndSignOutBtn, { backgroundColor: isDarkMode ? '#C6F432' : '#1F4230' }]}
            activeOpacity={0.85}
          >
            <Text style={[TYPOGRAPHY.bodyBold, { color: isDarkMode ? '#14281C' : '#FFFFFF' }]}>
              Pause Duty First & Sign Out
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
  riderHeroCard: {
    marginBottom: SPACING.sm
  },
  largeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#14281C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C6F432'
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SPACING.xs
  },
  kpiBox: {
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
    paddingVertical: 12
  },
  complimentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  compCard: {
    flex: 1,
    minWidth: '46%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  },
  batteryBarTrack: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden'
  },
  batteryBarFill: {
    height: '100%',
    borderRadius: 4
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIUS.md
  },
  managerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.md
  },
  managerCallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    minHeight: TOUCH_TARGET - 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  customerModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    minHeight: TOUCH_TARGET
  },
  signOutBtn: {
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET
  },
  pauseAndSignOutBtn: {
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET,
    marginTop: 4
  }
});
