import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { addProduct } from '../utils/storage';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

export default function AddProductScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Ingresá el nombre del producto.');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (quantity.trim() !== '' && (isNaN(qty) || qty <= 0)) {
      Alert.alert('Error', 'La cantidad debe ser un número mayor a 0.');
      return;
    }
    await addProduct({
      name: name.trim(),
      quantity: quantity.trim() !== '' ? String(qty) : '1',
      completed: false,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nombre del producto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Leche, Pan, Manzanas..."
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={styles.label}>Cantidad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 2"
          value={quantity}
          onChangeText={text => setQuantity(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
        />

        <CustomButton title="Agregar a la lista" onPress={handleAdd} />
        <CustomButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f1f8e9',
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
});
