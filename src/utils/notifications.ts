import { Alert } from 'react-native';

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleShoppingReminder(_seconds: number = 1): Promise<void> {
  Alert.alert(
    'Recordatorio',
    'Las notificaciones push no están disponibles en Expo Go. Usá un build de desarrollo para esta funcionalidad.'
  );
}
