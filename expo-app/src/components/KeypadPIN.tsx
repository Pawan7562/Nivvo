// ============================================================================
// REUSABLE COMPONENT: KEYPAD PIN (4-Digit Doorstep Delivery Verification)
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';
import { lightColors, darkColors, RADIUS, SPACING, TOUCH_TARGET, TYPOGRAPHY } from '../theme';

interface KeypadPINProps {
  onComplete: (pin: string) => void;
  expectedPinHint?: string;
  errorMessage?: string;
}

export const KeypadPIN: React.FC<KeypadPINProps> = ({
  onComplete,
  expectedPinHint,
  errorMessage
}) => {
  const isDarkMode = useRiderStore((state) => state.isDarkMode);
  const colors = isDarkMode ? darkColors : lightColors;
  const [digits, setDigits] = useState<string>('');

  const handlePressNumber = (num: string) => {
    if (digits.length < 4) {
      const next = digits + num;
      setDigits(next);
      if (next.length === 4) {
        onComplete(next);
      }
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDigits('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  return (
    <View style={styles.container}>
      {/* PIN Digit Indicators */}
      <View style={styles.pinCirclesRow}>
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = digits.length > idx;
          return (
            <View
              key={idx}
              style={[
                styles.pinBox,
                {
                  backgroundColor: isFilled
                    ? isDarkMode ? '#C6F432' : '#1F4230'
                    : isDarkMode ? '#1F2E24' : '#EAEFE5',
                  borderColor: isFilled
                    ? isDarkMode ? '#C6F432' : '#1F4230'
                    : colors.cardBorder
                }
              ]}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: isFilled
                    ? isDarkMode ? '#14281C' : '#FFFFFF'
                    : 'transparent'
                }}
              >
                {digits[idx] || '•'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Error / Hint Messages */}
      {errorMessage ? (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {errorMessage}
        </Text>
      ) : expectedPinHint ? (
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          Ask the customer for their 4-digit code (Hint: {expectedPinHint})
        </Text>
      ) : null}

      {/* 3x4 Tactile Keypad */}
      <View style={styles.grid}>
        {keys.map((key) => {
          const isAction = key === 'C' || key === '⌫';
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                if (key === 'C') handleClear();
                else if (key === '⌫') handleBackspace();
                else handlePressNumber(key);
              }}
              activeOpacity={0.7}
              style={[
                styles.keyButton,
                {
                  backgroundColor: isAction
                    ? isDarkMode ? '#233429' : '#ECEFE6'
                    : isDarkMode ? '#1C2921' : '#F6F9F2',
                  borderColor: colors.cardBorder
                }
              ]}
              accessibilityLabel={`Key ${key}`}
            >
              <Text
                style={[
                  TYPOGRAPHY.h2,
                  {
                    color: isAction
                      ? colors.textSecondary
                      : colors.textPrimary,
                    fontWeight: isAction ? '600' : '800'
                  }
                ]}
              >
                {key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.md
  },
  pinCirclesRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: SPACING.md
  },
  pinBox: {
    width: 52,
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hintText: {
    ...TYPOGRAPHY.subtext,
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  errorText: {
    ...TYPOGRAPHY.subtext,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 280,
    gap: 12
  },
  keyButton: {
    width: 82,
    height: 54,
    minHeight: TOUCH_TARGET,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
