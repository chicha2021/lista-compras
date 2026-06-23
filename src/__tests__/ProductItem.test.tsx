import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductItem from '../components/ProductItem';
import { Product } from '../types';

const baseProduct: Product = {
  id: '1',
  name: 'Leche',
  quantity: '2',
  completed: false,
};

describe('ProductItem', () => {
  it('renderiza el nombre y la cantidad del producto', () => {
    const { getByText } = render(
      <ProductItem product={baseProduct} onDelete={jest.fn()} onToggle={jest.fn()} />
    );
    expect(getByText('Leche')).toBeTruthy();
    expect(getByText('Cantidad: 2')).toBeTruthy();
  });

  it('llama a onToggle al presionar el área del checkbox', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <ProductItem product={baseProduct} onDelete={jest.fn()} onToggle={onToggle} />
    );
    fireEvent.press(getByText('Leche'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('llama a onDelete al presionar el botón de eliminar', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <ProductItem product={baseProduct} onDelete={onDelete} onToggle={jest.fn()} />
    );
    fireEvent.press(getByText('✕'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('muestra la imagen thumbnail cuando imageUri está definido', () => {
    const product: Product = { ...baseProduct, imageUri: 'file://photo.jpg' };
    const { getByTestId, UNSAFE_getByType } = render(
      <ProductItem product={product} onDelete={jest.fn()} onToggle={jest.fn()} />
    );
    const { Image } = require('react-native');
    const img = UNSAFE_getByType(Image);
    expect(img.props.source.uri).toBe('file://photo.jpg');
  });

  it('muestra badges de ubicación y contacto cuando están presentes', () => {
    const product: Product = {
      ...baseProduct,
      location: { latitude: -34.6, longitude: -58.4 },
      contact: { name: 'Juan' },
    };
    const { getByText } = render(
      <ProductItem product={product} onDelete={jest.fn()} onToggle={jest.fn()} />
    );
    expect(getByText('📍')).toBeTruthy();
    expect(getByText('👤')).toBeTruthy();
  });
});
