import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../utils/storage';

type Props = {
  product: Product;
  onDelete: () => void;
  onToggle: () => void;
};

export default function ProductItem({ product, onDelete, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkArea} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.checkbox, product.completed && styles.checked]}>
          {product.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, product.completed && styles.completedText]}>
            {product.name}
          </Text>
          {!!product.quantity && (
            <Text style={styles.quantity}>Cantidad: {product.quantity}</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  checkArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checked: { backgroundColor: '#2e7d32' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  textContainer: { flex: 1 },
  name: { fontSize: 16, color: '#333', fontWeight: '500' },
  completedText: { textDecorationLine: 'line-through', color: '#aaa' },
  quantity: { fontSize: 12, color: '#888', marginTop: 2 },
  deleteButton: { padding: 8 },
  deleteText: { fontSize: 18, color: '#e53935' },
});
