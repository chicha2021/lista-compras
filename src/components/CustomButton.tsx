import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function CustomButton({ title, onPress, variant = 'primary', style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' ? styles.secondary : styles.primary, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  primary: { backgroundColor: '#2e7d32' },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryText: { color: '#2e7d32' },
});
