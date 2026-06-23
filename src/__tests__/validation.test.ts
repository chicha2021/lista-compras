import { validateProductForm, formatCoordinates } from '../utils/validation';

describe('validateProductForm', () => {
  it('retorna error cuando el nombre está vacío', () => {
    expect(validateProductForm('', '1')).toBe('Ingresá el nombre del producto.');
    expect(validateProductForm('   ', '1')).toBe('Ingresá el nombre del producto.');
  });

  it('retorna error cuando la cantidad es un texto inválido', () => {
    expect(validateProductForm('Leche', 'abc')).toBe('La cantidad debe ser un número mayor a 0.');
  });

  it('retorna error cuando la cantidad es cero o negativa', () => {
    expect(validateProductForm('Leche', '0')).toBe('La cantidad debe ser un número mayor a 0.');
    expect(validateProductForm('Leche', '-3')).toBe('La cantidad debe ser un número mayor a 0.');
  });

  it('retorna null cuando el formulario es válido con cantidad', () => {
    expect(validateProductForm('Leche', '2')).toBeNull();
  });

  it('retorna null cuando la cantidad está vacía (es opcional)', () => {
    expect(validateProductForm('Pan', '')).toBeNull();
    expect(validateProductForm('Pan', '   ')).toBeNull();
  });
});

describe('formatCoordinates', () => {
  it('formatea coordenadas con 5 decimales', () => {
    expect(formatCoordinates(-34.603722, -58.381592)).toBe('-34.60372, -58.38159');
  });
});
