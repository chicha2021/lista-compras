export function validateProductForm(name: string, quantity: string): string | null {
  if (!name.trim()) return 'Ingresá el nombre del producto.';
  const qty = parseInt(quantity, 10);
  if (quantity.trim() !== '' && (isNaN(qty) || qty <= 0)) {
    return 'La cantidad debe ser un número mayor a 0.';
  }
  return null;
}

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
