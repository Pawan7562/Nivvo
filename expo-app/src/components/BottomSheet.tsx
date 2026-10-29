// ============================================================================
// REUSABLE COMPONENT: BOTTOM SHEET MODAL
// ============================================================================

import React from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, 
  TouchableWithoutFeedback, SafeAreaView, Dimensions 
} from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TYPOGRAPHY, TOUCH_TARGET } from '../theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children
}) => {
  const isDarkMode = useRiderStore((state) => state.isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View 
              style={[
                styles.sheetContainer,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder 
                }
              ]}
            >
              {/* Top Drag Handle */}
              <View style={styles.handleContainer}>
                <View style={[styles.handleBar, { backgroundColor: isDarkMode ? '#334438' : '#D5DDD0' }]} />
              </View>

              {/* Sheet Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1, paddingRight: SPACING.md }}>
                  <Text style={[TYPOGRAPHY.h3, { color: colors.textPrimary }]}>
                    {title}
                  </Text>
                  {subtitle ? (
                    <Text style={[TYPOGRAPHY.subtext, { color: colors.textSecondary, marginTop: 2 }]}>
                      {subtitle}
                    </Text>
                  ) : null}
                </View>

                {/* Close Button (min 44px) */}
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeButton, { backgroundColor: colors.surfaceSubtle }]}
                  activeOpacity={0.7}
                  accessibilityLabel="Close bottom sheet"
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Sheet Content */}
              <View style={styles.contentWrap}>
                {children}
              </View>

              {/* Safe area padding */}
              <SafeAreaView />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    borderTopLeftRadius: RADIUS.card + 4,
    borderTopRightRadius: RADIUS.card + 4,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: Dimensions.get('window').height * 0.85
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.sm
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: RADIUS.pill
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)'
  },
  closeButton: {
    width: TOUCH_TARGET - 8,
    height: TOUCH_TARGET - 8,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentWrap: {
    paddingTop: SPACING.md
  }
});
