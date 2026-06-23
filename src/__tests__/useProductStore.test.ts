import { useProductStore } from '../store/useProductStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

beforeEach(() => {
  useProductStore.setState({ products: [], isLoading: false });
});

describe('useProductStore', () => {
  it('el estado inicial es una lista vacía', () => {
    expect(useProductStore.getState().products).toEqual([]);
  });

  it('addProduct agrega un producto al store', async () => {
    await useProductStore.getState().addProduct({ name: 'Leche', quantity: '1', completed: false });
    const { products } = useProductStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Leche');
    expect(products[0].id).toBeDefined();
  });

  it('deleteProduct elimina el producto correcto', async () => {
    await useProductStore.getState().addProduct({ name: 'Pan', quantity: '2', completed: false });
    await useProductStore.getState().addProduct({ name: 'Arroz', quantity: '1', completed: false });
    const id = useProductStore.getState().products[0].id;

    await useProductStore.getState().deleteProduct(id);

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Arroz');
  });

  it('toggleProduct invierte el estado completed', async () => {
    await useProductStore.getState().addProduct({ name: 'Huevos', quantity: '12', completed: false });
    const id = useProductStore.getState().products[0].id;

    expect(useProductStore.getState().products[0].completed).toBe(false);
    await useProductStore.getState().toggleProduct(id);
    expect(useProductStore.getState().products[0].completed).toBe(true);
    await useProductStore.getState().toggleProduct(id);
    expect(useProductStore.getState().products[0].completed).toBe(false);
  });

  it('updateProduct actualiza campos del producto', async () => {
    await useProductStore.getState().addProduct({ name: 'Café', quantity: '1', completed: false });
    const id = useProductStore.getState().products[0].id;

    await useProductStore.getState().updateProduct(id, { quantity: '3', imageUri: 'file://cafe.jpg' });

    const updated = useProductStore.getState().products[0];
    expect(updated.quantity).toBe('3');
    expect(updated.imageUri).toBe('file://cafe.jpg');
    expect(updated.name).toBe('Café');
  });
});
