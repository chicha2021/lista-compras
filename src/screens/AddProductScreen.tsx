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
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useProductStore } from '../store/useProductStore';
import {
  requestCameraPermission,
  requestGalleryPermission,
  requestLocationPermission,
  requestContactsPermission,
  requestCalendarPermission,
} from '../utils/permissions';
import { validateProductForm, formatCoordinates } from '../utils/validation';
import { ProductContact, ProductLocation } from '../types';
import CustomButton from '../components/CustomButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

async function getWritableCalendarId(): Promise<string | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find(c => c.allowsModifications);
  if (writable) return writable.id;

  // Crear calendario local si no existe ninguno
  const newId = await Calendar.createCalendarAsync({
    title: 'Lista de Compras',
    color: '#2e7d32',
    entityType: Calendar.EntityTypes.EVENT,
    sourceDetails: { isLocalAccount: true, name: 'Lista de Compras', type: Calendar.SourceType.LOCAL },
    source: { isLocalAccount: true, name: 'Lista de Compras', type: Calendar.SourceType.LOCAL },
    name: 'listacompras',
    ownerAccount: 'local',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  return newId;
}

export default function AddProductScreen({ navigation }: Props) {
  const { addProduct } = useProductStore();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [location, setLocation] = useState<ProductLocation | undefined>();
  const [contact, setContact] = useState<ProductContact | undefined>();
  const [addToCalendar, setAddToCalendar] = useState(false);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactList, setContactList] = useState<Contacts.Contact[]>([]);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  // ── Foto ──────────────────────────────────────────────────────────────
  const handleCamera = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Habilitá el acceso a la galería desde Ajustes del dispositivo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // ── Ubicación ─────────────────────────────────────────────────────────
  const handleLocation = async () => {
    const ok = await requestLocationPermission();
    if (!ok) return;
    setLoadingLocation(true);
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      let address: string | undefined;
      try {
        const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geo) {
          address = [geo.name, geo.street, geo.district, geo.city, geo.region, geo.country]
            .filter(Boolean)
            .join(', ');
        }
      } catch (_) {}
      setLocation({ latitude, longitude, address });
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación. Verificá que el GPS esté activo.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // ── Contactos ─────────────────────────────────────────────────────────
  const handlePickContact = async () => {
    const ok = await requestContactsPermission();
    if (!ok) return;
    setLoadingContacts(true);
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });
      const withName = data.filter(c => c.name);
      setContactList(withName.slice(0, 50));
      setContactModalVisible(true);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los contactos.');
    } finally {
      setLoadingContacts(false);
    }
  };

  const selectContact = (c: Contacts.Contact) => {
    setContact({
      name: c.name ?? '',
      phone: c.phoneNumbers?.[0]?.number,
    });
    setContactModalVisible(false);
  };

  // ── Calendario ────────────────────────────────────────────────────────
  const createCalendarEvent = async (productName: string): Promise<string | undefined> => {
    const ok = await requestCalendarPermission();
    if (!ok) return undefined;

    const calendarId = await getWritableCalendarId();
    if (!calendarId) {
      Alert.alert('Error', 'No se encontró un calendario disponible en el dispositivo.');
      return undefined;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `Comprar: ${productName}`,
      startDate: tomorrow,
      endDate: endTime,
      notes: `Recordatorio para comprar ${productName}`,
      alarms: [{ relativeOffset: -30 }],
    });
    return eventId;
  };

  // ── Guardar ───────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const error = validateProductForm(name, quantity);
    if (error) {
      Alert.alert('Error', error);
      return;
    }

    let calendarEventId: string | undefined;
    if (addToCalendar) {
      calendarEventId = await createCalendarEvent(name.trim());
    }

    await addProduct({
      name: name.trim(),
      quantity: quantity.trim() !== '' ? String(parseInt(quantity, 10)) : '1',
      completed: false,
      imageUri,
      location,
      contact,
      calendarEventId,
    });

    if (calendarEventId) {
      Alert.alert('Listo', 'Producto agregado y recordatorio creado para mañana a las 10:00 hs.');
    }

    navigation.goBack();
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          {/* ── Nombre y cantidad ── */}
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

          {/* ── Foto ── */}
          <Text style={styles.sectionTitle}>📷 Foto del producto</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.iconButton} onPress={handleCamera}>
              <Text style={styles.iconButtonText}>📷 Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleGallery}>
              <Text style={styles.iconButtonText}>🖼 Galería</Text>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => setImageUri(undefined)} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>✕ Quitar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Ubicación ── */}
          <Text style={styles.sectionTitle}>📍 Ubicación del comercio</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handleLocation} disabled={loadingLocation}>
            {loadingLocation
              ? <ActivityIndicator color="#2e7d32" />
              : <Text style={styles.iconButtonText}>📍 Obtener ubicación actual</Text>
            }
          </TouchableOpacity>
          {location && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {location.address ?? formatCoordinates(location.latitude, location.longitude)}
              </Text>
              <Text style={styles.infoSubText}>
                {formatCoordinates(location.latitude, location.longitude)}
              </Text>
              <TouchableOpacity onPress={() => setLocation(undefined)}>
                <Text style={styles.removeBtnText}>✕ Quitar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Contacto ── */}
          <Text style={styles.sectionTitle}>👤 Contacto (proveedor)</Text>
          <TouchableOpacity style={styles.iconButton} onPress={handlePickContact} disabled={loadingContacts}>
            {loadingContacts
              ? <ActivityIndicator color="#2e7d32" />
              : <Text style={styles.iconButtonText}>👤 Seleccionar contacto</Text>
            }
          </TouchableOpacity>
          {contact && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{contact.name}</Text>
              {contact.phone && <Text style={styles.infoSubText}>{contact.phone}</Text>}
              <TouchableOpacity onPress={() => setContact(undefined)}>
                <Text style={styles.removeBtnText}>✕ Quitar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Calendario ── */}
          <Text style={styles.sectionTitle}>📅 Recordatorio en calendario</Text>
          <TouchableOpacity
            style={[styles.iconButton, addToCalendar && styles.iconButtonActive]}
            onPress={() => setAddToCalendar(v => !v)}
          >
            <Text style={[styles.iconButtonText, addToCalendar && styles.iconButtonTextActive]}>
              {addToCalendar ? '✅ Recordatorio activado' : '📅 Agregar al calendario'}
            </Text>
          </TouchableOpacity>
          {addToCalendar && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Se creará un evento para mañana a las 10:00 hs</Text>
            </View>
          )}

          {/* ── Acciones ── */}
          <View style={{ marginTop: 8 }}>
            <CustomButton title="Agregar a la lista" onPress={handleAdd} />
            <CustomButton title="Cancelar" onPress={() => navigation.goBack()} variant="secondary" />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal de contactos ── */}
      <Modal visible={contactModalVisible} animationType="slide" onRequestClose={() => setContactModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar contacto</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(false)}>
              <Text style={styles.modalClose}>✕ Cerrar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={contactList}
            keyExtractor={item => item.id ?? item.name ?? Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.contactItem} onPress={() => selectContact(item)}>
                <Text style={styles.contactName}>{item.name}</Text>
                {item.phoneNumbers?.[0] && (
                  <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.emptyContacts}>No se encontraron contactos.</Text>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f1f8e9', flexGrow: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2e7d32', marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  row: { flexDirection: 'row', gap: 10 },
  iconButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  iconButtonActive: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  iconButtonText: { color: '#2e7d32', fontSize: 14, fontWeight: '600' },
  iconButtonTextActive: { color: '#1b5e20' },
  imageContainer: { marginTop: 10, alignItems: 'center' },
  previewImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 6 },
  removeBtn: { marginTop: 4 },
  removeBtnText: { color: '#e53935', fontSize: 13 },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  infoText: { fontSize: 14, color: '#333', fontWeight: '500' },
  infoSubText: { fontSize: 12, color: '#777', marginTop: 2 },
  // Modal
  modalContainer: { flex: 1, backgroundColor: '#f1f8e9' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2e7d32',
  },
  modalTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  modalClose: { color: '#fff', fontSize: 14 },
  contactItem: { padding: 16, backgroundColor: '#fff' },
  contactName: { fontSize: 15, color: '#333', fontWeight: '500' },
  contactPhone: { fontSize: 13, color: '#777', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#e8f5e9' },
  emptyContacts: { textAlign: 'center', marginTop: 40, color: '#999' },
});
