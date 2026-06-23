# Lista de Compras Inteligente

Parcial 2 - Aplicaciones Móviles | ISTEA 2026

## Opción elegida

**Lista de compras inteligente** – Gestión de productos con autenticación local, persistencia, acceso a recursos del dispositivo y estado global con Zustand.

## Usuario de prueba

| Campo | Valor |
|-------|-------|
| Usuario | `test` |
| Contraseña | `1234` |

---

## Cómo ejecutar la app

### Requisitos previos
- Node.js 18+
- Expo Go instalado en el dispositivo (iOS o Android)

### Pasos

```bash
# 1. Instalar dependencias
npm install --registry https://registry.yarnpkg.com --legacy-peer-deps

# 2. Iniciar el servidor de desarrollo
npm start

# 3. Escanear el QR con Expo Go (Android) o con la cámara (iOS)
```

## Cómo correr los tests

```bash
npm test
```

Los tests se ejecutan con Jest + jest-expo. No requiere dispositivo ni simulador.

---

## Funcionalidades implementadas

### Parcial 1
- Registro e inicio de sesión con persistencia en AsyncStorage
- Lista de compras: agregar, marcar como comprado, eliminar
- Notificaciones push locales
- Stack Navigation con 4 pantallas

### Parcial 2 – Nuevas funcionalidades

#### 1. Permisos y acceso a recursos del dispositivo
- Solicitud de permisos antes de usar cada recurso (cámara, galería, ubicación, contactos, calendario)
- Manejo de estados: concedido, denegado, pendiente
- Mensaje claro al usuario cuando un permiso es rechazado

#### 2. Cámara y Galería (`expo-image-picker`)
- Tomar foto con la cámara o seleccionar desde la galería al agregar un producto
- La imagen queda asociada al producto
- Se muestra como thumbnail en la lista de productos

#### 3. Ubicación GPS (`expo-location`)
- Obtención de la ubicación actual del dispositivo al agregar un producto
- Geocodificación inversa para mostrar la dirección aproximada del comercio
- Se muestran coordenadas y dirección en la pantalla de agregar

#### 4. Contactos y Calendario (`expo-contacts` + `expo-calendar`)
- Selección de un contacto de la agenda del dispositivo (proveedor) con buscador visual
- Creación de un evento recordatorio en el calendario del dispositivo (mañana 10:00 hs)
- El evento incluye alerta 30 minutos antes

#### 5. Estado global con Zustand
- La lista de productos es manejada completamente por un store Zustand
- Acciones: `addProduct`, `deleteProduct`, `toggleProduct`, `updateProduct`, `loadProducts`
- Persistencia automática en AsyncStorage tras cada mutación
- Los componentes leen y escriben estado solo a través del store (sin prop drilling)

#### 6. Testing con Jest + React Native Testing Library
- **Test de componente** (`ProductItem.test.tsx`): verifica renderizado de nombre, cantidad, imagen, badges y respuesta a interacciones (toggle, delete) — 5 tests
- **Test de lógica de negocio** (`validation.test.ts`): verifica validación del formulario y formateo de coordenadas — 6 tests
- **Test del store global** (`useProductStore.test.ts`): verifica las acciones addProduct, deleteProduct, toggleProduct, updateProduct — 5 tests

**Total: 16 tests, 0 fallos**

---

## Punto extra: IA aplicada al desarrollo

Este parcial fue desarrollado con asistencia de **Claude Code (Anthropic)** como herramienta de IA.

### Herramientas utilizadas
- **Claude Code** (claude-sonnet-4-6) — generación y refactorización de código

### Ejemplos de prompts aplicados

**Prompt para el store de Zustand:**
> "Creá un store de Zustand para una lista de productos React Native. El store debe manejar estado en memoria y persistir automáticamente en AsyncStorage después de cada mutación (add, delete, toggle, update). Que sea testeable sin re-leer AsyncStorage en cada operación."

**Prompt para los tests:**
> "Escribí tests con React Native Testing Library para el componente ProductItem que incluya: render del nombre/cantidad, respuesta al press de toggle y delete, visualización de imagen thumbnail y badges de ubicación/contacto."

**Prompt para la pantalla de agregar producto:**
> "Extendé AddProductScreen para que permita: (1) tomar foto o elegir de galería con expo-image-picker, (2) obtener GPS con expo-location y geocodificación inversa, (3) seleccionar contacto de la agenda con un Modal de FlatList, (4) crear evento en el calendario nativo con expo-calendar para mañana a las 10am."

### Comparación código generado vs código final
- El código generado por IA proporcionó la estructura base completa y funcional
- Se ajustaron los manejadores de errores para casos edge (calendarios sin permiso de escritura, contactos vacíos)
- Se agregaron validaciones de UX (loading states, mensajes de feedback)
- Los tests generados fueron iterados para resolver conflictos de versiones entre jest@29 y jest-expo@54

---

## Arquitectura del proyecto

```
src/
├── types/
│   └── index.ts           # Interfaz Product con campos opcionales (imagen, ubicación, contacto, calendario)
├── store/
│   └── useProductStore.ts # Store Zustand con persistencia AsyncStorage
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx     # Usa store Zustand
│   └── AddProductScreen.tsx  # Cámara, GPS, Contactos, Calendario
├── components/
│   ├── CustomButton.tsx
│   └── ProductItem.tsx    # Muestra thumbnail + badges
├── utils/
│   ├── auth.ts
│   ├── notifications.ts
│   ├── permissions.ts     # Helpers para solicitar permisos
│   └── validation.ts      # Lógica de validación testeable
└── __tests__/
    ├── ProductItem.test.tsx
    ├── validation.test.ts
    └── useProductStore.test.ts
```

## Videos demo

- **Parcial 1:** [Ver en YouTube](https://www.youtube.com/watch?v=2JRtUga6tBY)
- **Parcial 2:** [Ver en YouTube](https://youtu.be/75N5NWzP-kc)

---

Ezequiel Hernandez | ISTEA 2026
