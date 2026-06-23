import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useProductStore } from '../store/useProductStore';
import { logout } from '../utils/auth';
import { requestNotificationPermissions, scheduleShoppingReminder } from '../utils/notifications';
import ProductItem from '../components/ProductItem';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { products, loadProducts, deleteProduct, toggleProduct } = useProductStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar producto', '¿Querés eliminar este producto de la lista?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteProduct(id) },
    ]);
  };

  const handleReminder = async () => {
    await scheduleShoppingReminder(1);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const pending = products.filter(p => !p.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counter}>
          {pending} pendiente{pending !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onDelete={() => handleDelete(item.id)}
            onToggle={() => toggleProduct(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tu lista está vacía.</Text>
            <Text style={styles.emptyHint}>Tocá "Agregar" para sumar productos.</Text>
          </View>
        }
        contentContainerStyle={products.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.reminderButton} onPress={handleReminder}>
          <Text style={styles.reminderText}>🔔 Recordatorio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f8e9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e9',
  },
  counter: { fontSize: 14, color: '#555' },
  logoutText: { fontSize: 14, color: '#e53935', fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#999', marginBottom: 6 },
  emptyHint: { fontSize: 13, color: '#bbb' },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8f5e9',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reminderButton: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e7d32',
  },
  reminderText: { color: '#2e7d32', fontSize: 15, fontWeight: '600' },
});
