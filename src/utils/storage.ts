import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTS_KEY = 'products';

export interface Product {
  id: string;
  name: string;
  quantity: string;
  completed: boolean;
}

export async function getProducts(): Promise<Product[]> {
  const data = await AsyncStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<void> {
  const products = await getProducts();
  products.push({ ...product, id: Date.now().toString() });
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.filter(p => p.id !== id)));
}

export async function toggleProduct(id: string): Promise<void> {
  const products = await getProducts();
  await AsyncStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(products.map(p => (p.id === id ? { ...p, completed: !p.completed } : p)))
  );
}
