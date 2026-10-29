// ============================================================================
// SCREEN 4: UNIFIED CHAT SUPPORT & DISPATCH ASSISTANCE
// ============================================================================

import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  SafeAreaView, TextInput, Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';
import { Card } from '../components/Card';
import { BottomSheet } from '../components/BottomSheet';

const TOPIC_PRESETS = [
  'Customer unreachable at door',
  'Wrong delivery address / Gate locked',
  'EV battery low / Swap hub',
  'Earnings and payouts',
  'Safety and insurance'
];

interface ChatMessage {
  id: string;
  sender: 'rider' | 'support' | 'system';
  text: string;
  time: string;
  showCallbackPrompt?: boolean;
  topic?: string;
}

export const SupportScreen: React.FC = () => {
  const {
    partner,
    isDarkMode,
    createSupportTicket,
    showToast
  } = useRiderStore();

  const colors = isDarkMode ? darkColors : lightColors;

  // Chat Support does not open automatically; opens only when rider starts chat
  const [isChatActive, setIsChatActive] = useState(false);
  const [showCallbackSheet, setShowCallbackSheet] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [callbackPhone, setCallbackPhone] = useState(partner.phone || '+91 98765 43210');
  const [callbackTopic, setCallbackTopic] = useState('Customer unreachable at door');
  const [activeCallback, setActiveCallback] = useState<{ id: string; phone: string; topic: string; waitTime: string } | null>(null);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'support',
      text: `Hi ${partner.name}! 👋 I am your Nivvo Dispatch Assistant for ${partner.hubName}. Please describe your specific problem or issue here. If we cannot resolve it in chat, you can submit an immediate call request so our team can contact you directly.`,
      time: 'Just now'
    }
  ]);

  const handleStartChat = (initialTopic?: string) => {
    setIsChatActive(true);
    if (initialTopic) {
      handleSendChatMessage(initialTopic, initialTopic);
    }
  };

  const handleSendChatMessage = (textToSend?: string, category = 'General') => {
    const text = (textToSend || chatInputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'rider',
      text,
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText('');

    // Contextual bot reply with call request escalation option
    setTimeout(() => {
      let reply = '';
      const lower = (text + ' ' + category).toLowerCase();

      if (lower.includes('unreachable') || lower.includes('door') || lower.includes('not answering') || lower.includes('customer')) {
        reply = 'For customer not responding at the door:\n1. Ring bell and place 2 calls via the in-app Call button.\n2. You automatically earn +₹20 waiting pay for the 10-minute trial period.\n3. If 10 mins expire without contact, tap "Mark Unreachable" to return items to the hub.';
      } else if (lower.includes('address') || lower.includes('gate') || lower.includes('location') || lower.includes('wrong')) {
        reply = 'Location help:\n• Verify building number and show your digital partner ID at security gates.\n• If customer is uncontactable, our dispatch team can contact them directly.';
      } else if (lower.includes('battery') || lower.includes('ev') || lower.includes('swap') || lower.includes('charge')) {
        reply = 'EV battery support:\n• Indiranagar Hub #14 has 8 fully charged Ather battery packs available.\n• Swap takes under 60 seconds.';
      } else if (lower.includes('payout') || lower.includes('earnings') || lower.includes('tip') || lower.includes('money')) {
        reply = 'Payout information:\n• 100% of customer tips and trip fees are deposited instantly upon delivery.\n• Withdraw 24/7 to bank or UPI via the Earnings tab.';
      } else {
        reply = `Logged note regarding "${text}". If this guidance does not fully resolve your issue, tap "Request a Call" below and dispatch will call you immediately.`;
      }

      const botMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        sender: 'support',
        text: reply,
        time: 'Just now',
        showCallbackPrompt: true,
        topic: category || text
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleConfirmCallback = () => {
    if (!callbackPhone.trim()) {
      showToast('Please enter your phone number', 'error');
      return;
    }

    const callbackObj = {
      id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: callbackPhone.trim(),
      topic: callbackTopic,
      waitTime: '< 2 mins'
    };

    setActiveCallback(callbackObj);
    setShowCallbackSheet(false);

    // Append system message to chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `📞 Callback request submitted. Dispatch controller is calling ${callbackPhone.trim()} in ~2 minutes.`,
        time: 'Just now'
      }
    ]);

    // Also create tracked support ticket
    createSupportTicket(`Callback: ${callbackTopic}`, `Call Request · ${callbackPhone.trim()}`, `Rider requested immediate call support.`);
    showToast(`Callback requested! Our company is calling ${callbackPhone.trim()} shortly.`, 'success');
  };

  const handleCancelCallback = () => {
    setActiveCallback(null);
    showToast('Callback request cancelled');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      
      {/* ─── Top Dispatch Header ─── */}
      <View style={[styles.headerRow, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          {isChatActive && (
            <TouchableOpacity 
              onPress={() => setIsChatActive(false)}
              style={{ padding: 4 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}

          <View style={[styles.agentAvatar, { backgroundColor: isDarkMode ? '#2B4232' : '#1F4230' }]}>
            <Ionicons name="headset" size={18} color="#C6F432" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
              {isChatActive ? 'Dispatch Chat Support' : 'Rider Support Desk'}
            </Text>
            <Text style={[TYPOGRAPHY.caption, { color: colors.success, fontWeight: '700' }]}>
              ● Online · {partner.hubName}
            </Text>
          </View>
        </View>

        {/* Direct Call Request Button */}
        <TouchableOpacity
          onPress={() => setShowCallbackSheet(true)}
          style={styles.requestCallTopBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={12} color="#14281C" />
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#14281C' }}>
            Request Call
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Callback Alert Banner (When Queued) */}
        {activeCallback && (
          <View style={[styles.activeCallbackBanner, { backgroundColor: isDarkMode ? '#133E2B' : '#ECFDF5', borderColor: '#10B981' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <View style={styles.callbackPulseCircle}>
                <Ionicons name="call" size={14} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: isDarkMode ? '#C6F432' : '#065F46' }}>
                  Dispatch Calling You ({activeCallback.waitTime})
                </Text>
                <Text style={{ fontSize: 10, color: isDarkMode ? '#A7F3D0' : '#047857' }}>
                  {activeCallback.phone} · {activeCallback.topic}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {!isChatActive && (
                <TouchableOpacity onPress={() => setIsChatActive(true)} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.success }}>
                    Open Chat
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleCancelCallback} style={{ padding: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#EF4444' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── STATE A: DESK OVERVIEW (Chat is NOT opened automatically) ─── */}
        {!isChatActive && (
          <View style={{ gap: 14 }}>
            {/* Hero Card: Start Chat Support */}
            <View style={[styles.heroCard, { backgroundColor: isDarkMode ? '#1B3525' : '#1F4230' }]}>
              <View style={styles.heroBadge}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#C6F432' }} />
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#C6F432' }}>
                  LIVE DISPATCH CHAT
                </Text>
              </View>

              <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 }}>
                Need Help on Your Route?
              </Text>
              <Text style={{ fontSize: 12, color: '#D1D5DB', lineHeight: 18, marginBottom: 16 }}>
                Describe your specific delivery issue to our dispatch team in the chat. If your problem cannot be resolved through chat, you can submit an instant call request directly inside.
              </Text>

              <TouchableOpacity
                onPress={() => handleStartChat()}
                style={styles.startChatPrimaryBtn}
                activeOpacity={0.85}
              >
                <Ionicons name="chatbubbles" size={16} color="#14281C" />
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#14281C' }}>
                  Start Chat Support
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tap an issue to start chat */}
            <View>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginBottom: 8, fontWeight: '800' }]}>
                OR TAP AN ISSUE TO START CHAT:
              </Text>

              <View style={{ gap: 8 }}>
                {[
                  { title: 'Customer not answering door', desc: 'Wait time & doorstep try-on guidance', icon: 'time-outline' as const },
                  { title: 'Wrong delivery address / Gate locked', desc: 'Navigation assistance & gate clearance', icon: 'location-outline' as const },
                  { title: 'EV battery swap station', desc: 'Indiranagar Hub #14 swap bays', icon: 'battery-charging-outline' as const },
                  { title: 'Payout or trip fee discrepancy', desc: 'Instant withdrawal & earnings inquiry', icon: 'cash-outline' as const },
                  { title: 'Damaged item or return rejected', desc: 'Condition inspection & return pouch SOP', icon: 'cube-outline' as const }
                ].map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleStartChat(item.title)}
                    style={[styles.topicStarterCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                      <View style={[styles.topicStarterIconBox, { backgroundColor: isDarkMode ? '#233829' : '#F4F5EE' }]}>
                        <Ionicons name={item.icon} size={18} color={isDarkMode ? '#C6F432' : '#1F4230'} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary }}>
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Prefer a Phone Call Card */}
            <Card style={styles.phoneCallCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                <View style={[styles.topicStarterIconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="call" size={18} color="#15803D" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                    Prefer a Phone Call?
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    Live controller calls you in &lt; 2 minutes
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowCallbackSheet(true)}
                style={[styles.requestCallSecondaryBtn, { borderColor: colors.cardBorder }]}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>
                  Request Call
                </Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* ─── STATE B: ACTIVE CHAT CONVERSATION ─── */}
        {isChatActive && (
          <>
            {/* Quick Topic Prompts */}
            <View style={{ marginBottom: 4 }}>
              <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginBottom: 4 }]}>
                QUICK PROMPTS:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {[
                  { label: 'Customer not answering door', cat: 'Customer' },
                  { label: 'Wrong delivery address', cat: 'Address' },
                  { label: 'EV battery swap station', cat: 'EV Battery' },
                  { label: 'Payout / Fee query', cat: 'Payout' },
                  { label: '📞 Request a Call', cat: 'Call', isCall: true }
                ].map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      if (chip.isCall) {
                        setShowCallbackSheet(true);
                      } else {
                        handleSendChatMessage(chip.label, chip.cat);
                      }
                    }}
                    style={[styles.quickChip, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[TYPOGRAPHY.caption, { fontWeight: '700', color: colors.textPrimary }]}>
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Message Stream */}
            <Card style={styles.chatFeedCard}>
              {chatMessages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <View key={msg.id} style={[styles.systemMsgBox, { backgroundColor: isDarkMode ? '#1F3E2F' : '#ECFDF5' }]}>
                      <Text style={{ fontSize: 11, color: isDarkMode ? '#C6F432' : '#065F46', textAlign: 'center', fontWeight: '600' }}>
                        {msg.text}
                      </Text>
                    </View>
                  );
                }

                const isRider = msg.sender === 'rider';

                return (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.msgRow, 
                      { alignItems: isRider ? 'flex-end' : 'flex-start' }
                    ]}
                  >
                    <View
                      style={[
                        styles.msgBubble,
                        isRider
                          ? [styles.riderBubble, { backgroundColor: '#1F4230' }]
                          : [styles.supportBubble, { backgroundColor: colors.surfaceSubtle, borderColor: colors.cardBorder }]
                      ]}
                    >
                      <Text style={{ 
                        fontSize: 13, 
                        lineHeight: 18, 
                        color: isRider ? '#FFFFFF' : colors.textPrimary 
                      }}>
                        {msg.text}
                      </Text>

                      {/* In-Chat Resolution & Call Request Option */}
                      {msg.showCallbackPrompt && (
                        <View style={[styles.resolutionBox, { borderTopColor: colors.cardBorder }]}>
                          {resolvedIds.includes(msg.id) ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                              <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>
                                Issue marked resolved. Safe trip!
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 6 }}>
                                Was your issue resolved?
                              </Text>
                              <View style={{ flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    setResolvedIds((prev) => [...prev, msg.id]);
                                    showToast('Issue marked as resolved', 'success');
                                  }}
                                  style={[styles.resBtn, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}
                                >
                                  <Ionicons name="checkmark" size={12} color="#15803D" />
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#15803D' }}>
                                    Yes, Resolved
                                  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    setCallbackTopic(msg.topic || 'Unresolved Support Chat');
                                    setShowCallbackSheet(true);
                                  }}
                                  style={[styles.resBtn, { backgroundColor: '#1F4230', borderColor: '#1F4230' }]}
                                >
                                  <Ionicons name="call" size={12} color="#C6F432" />
                                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#C6F432' }}>
                                    No, Request Call
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, marginHorizontal: 4 }}>
                      {msg.time}
                    </Text>
                  </View>
                );
              })}
            </Card>
          </>
        )}
      </ScrollView>

      {/* ─── Pinned Bottom Input Bar (Only visible when chat is active) ─── */}
      {isChatActive && (
        <View style={[styles.chatInputRow, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
          <TextInput
            placeholder="Describe your issue or problem..."
            placeholderTextColor={colors.textMuted}
            value={chatInputText}
            onChangeText={setChatInputText}
            onSubmitEditing={() => handleSendChatMessage()}
            style={[styles.chatTextInput, { backgroundColor: colors.surfaceSubtle, color: colors.textPrimary }]}
          />

          <TouchableOpacity
            onPress={() => setShowCallbackSheet(true)}
            style={[styles.callIconBtn, { backgroundColor: colors.surfaceSubtle }]}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={16} color="#1F4230" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSendChatMessage()}
            disabled={!chatInputText.trim()}
            style={[
              styles.sendBtn,
              { backgroundColor: chatInputText.trim() ? '#1F4230' : colors.surfaceSubtle }
            ]}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="send" 
              size={15} 
              color={chatInputText.trim() ? '#C6F432' : colors.textMuted} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* ─── Request Call Bottom Sheet ─── */}
      <BottomSheet
        visible={showCallbackSheet}
        onClose={() => setShowCallbackSheet(false)}
        title="Request Dispatch Callback"
      >
        <View style={{ gap: SPACING.md, paddingVertical: SPACING.sm }}>
          <View>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginBottom: 4, fontWeight: '700' }]}>
              PHONE NUMBER TO CALL
            </Text>
            <TextInput
              value={callbackPhone}
              onChangeText={setCallbackPhone}
              keyboardType="phone-pad"
              style={[styles.inputBox, { borderColor: '#1F4230', backgroundColor: colors.card, color: colors.textPrimary }]}
            />
          </View>

          <View>
            <Text style={[TYPOGRAPHY.caption, { color: colors.textSecondary, marginBottom: 4, fontWeight: '700' }]}>
              SELECT TOPIC
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {TOPIC_PRESETS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setCallbackTopic(t)}
                  style={[
                    styles.topicChip,
                    {
                      backgroundColor: callbackTopic === t ? (isDarkMode ? '#243C2E' : '#E8F5E9') : colors.card,
                      borderColor: callbackTopic === t ? '#10B981' : colors.cardBorder
                    }
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[TYPOGRAPHY.caption, { 
                    fontWeight: '700', 
                    color: callbackTopic === t ? '#10B981' : colors.textPrimary 
                  }]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.queueNoticeBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Ionicons name="time" size={16} color="#10B981" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>
              Active dispatch queue · Estimated call wait &lt; 2 minutes
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleConfirmCallback}
            style={[styles.submitTicketBtn, { backgroundColor: '#1F4230' }]}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="call" size={16} color="#C6F432" />
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>
                Confirm & Call Me Now
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  agentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  requestCallTopBtn: {
    backgroundColor: '#C6F432',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill
  },
  scrollContent: {
    padding: SPACING.md,
    gap: 12,
    paddingBottom: 24
  },
  activeCallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    gap: 8
  },
  callbackPulseCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroCard: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(198, 244, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(198, 244, 50, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  startChatPrimaryBtn: {
    backgroundColor: '#C6F432',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12
  },
  topicStarterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1
  },
  topicStarterIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  phoneCallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14
  },
  requestCallSecondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1
  },
  chatFeedCard: {
    padding: 14,
    minHeight: 360,
    gap: 12,
    marginTop: 6
  },
  systemMsgBox: {
    padding: 10,
    borderRadius: RADIUS.sm,
    marginVertical: 4
  },
  msgRow: {
    width: '100%'
  },
  msgBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: RADIUS.md
  },
  riderBubble: {
    borderBottomRightRadius: 2
  },
  supportBubble: {
    borderBottomLeftRadius: 2,
    borderWidth: 1
  },
  resolutionBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1
  },
  resBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8
  },
  chatTextInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    borderRadius: RADIUS.pill
  },
  callIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    minHeight: TOUCH_TARGET - 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: TOUCH_TARGET
  },
  queueNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: RADIUS.sm
  },
  submitTicketBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET,
    marginTop: 6
  }
});
