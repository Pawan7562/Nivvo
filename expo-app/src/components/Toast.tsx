// ============================================================================
// REUSABLE COMPONENT: TOAST NOTIFICATION
// ============================================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const Toast: React.FC = () => {
  const toast = useRiderStore((state) => state.toast);
  const hideToast = useRiderStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  let backgroundColor = '#14281C';
  let borderColor = '#C6F432';
  let iconName: keyof typeof Ionicons.glyphMap = 'information';
  let iconBg = '#C6F432';
  let iconColor = '#14281C';

  if (toast.type === 'success') {
    backgroundColor = '#1F4230';
    borderColor = '#C6F432';
    iconName = 'checkmark';
    iconBg = '#C6F432';
    iconColor = '#14281C';
  } else if (toast.type === 'error') {
    backgroundColor = '#381616';
    borderColor = '#EF4444';
    iconName = 'alert';
    iconBg = '#EF4444';
    iconColor = '#FFFFFF';
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <SafeAreaView pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={hideToast}
          style={[styles.toastCard, { backgroundColor, borderColor }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={13} color={iconColor} />
          </View>
          <Text style={[styles.message, TYPOGRAPHY.subtext]}>
            {toast.text}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 9999,
    alignItems: 'center'
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '96%'
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C6F432',
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    color: '#FFFFFF',
    fontWeight: '700',
    flexShrink: 1
  }
});
