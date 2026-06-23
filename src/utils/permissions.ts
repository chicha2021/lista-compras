import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar fotos. Habilitalo desde Ajustes.');
    return false;
  }
  return true;
}

export async function requestGalleryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar fotos. Habilitalo desde Ajustes.');
    return false;
  }
  return true;
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para guardar el comercio. Habilitalo desde Ajustes.');
    return false;
  }
  return true;
}

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso a los contactos para asociar un proveedor. Habilitalo desde Ajustes.');
    return false;
  }
  return true;
}

export async function requestCalendarPermission(): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Se necesita acceso al calendario para crear recordatorios. Habilitalo desde Ajustes.');
    return false;
  }
  return true;
}
