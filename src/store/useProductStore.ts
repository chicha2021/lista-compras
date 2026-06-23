import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const PRODUCTS_KEY = 'products';

const persist = (products: Product[]) =>
  AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,

  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem(PRODUCTS_KEY);
      set({ products: data ? JSON.parse(data) : [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    const newProduct: Product = { ...product, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
    const updated = [...get().products, newProduct];
    set({ products: updated });
    await persist(updated);
    return newProduct;
  },

  deleteProduct: async (id) => {
    const updated = get().products.filter(p => p.id !== id);
    set({ products: updated });
    await persist(updated);
  },

  toggleProduct: async (id) => {
    const updated = get().products.map(p =>
      p.id === id ? { ...p, completed: !p.completed } : p
    );
    set({ products: updated });
    await persist(updated);
  },

  updateProduct: async (id, updates) => {
    const updated = get().products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    set({ products: updated });
    await persist(updated);
  },
}));
