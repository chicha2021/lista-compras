export interface ProductLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ProductContact {
  name: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: string;
  completed: boolean;
  imageUri?: string;
  location?: ProductLocation;
  contact?: ProductContact;
  calendarEventId?: string;
}
