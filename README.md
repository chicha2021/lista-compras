# Lista de Compras Inteligente

Parcial 1 - Aplicaciones Móviles | ISTEA

## Opción elegida

**Lista de compras inteligente** - Gestión de productos con autenticación local, persistencia y notificaciones.

## Usuario de prueba

Para acceder sin registrarse usar las siguientes credenciales:

| Campo | Valor |
|-------|-------|
| Usuario | `test` |
| Contraseña | `1234` |

## Cómo ejecutar la app

### Requisitos previos
- Node.js 18+
- Expo Go instalado en el dispositivo (iOS o Android)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm start

# 3. Escanear el QR con Expo Go (Android) o con la cámara (iOS)
```

## Funcionalidades implementadas

### Autenticación
- Registro de usuario con nombre de usuario y contraseña
- Inicio de sesión con validación contra datos guardados en AsyncStorage
- La app no permite acceso sin sesión iniciada

### Lista de compras
- Agregar productos con nombre y cantidad
- Marcar productos como comprados (tachado visual)
- Eliminar productos de la lista
- Los datos persisten al cerrar la app (AsyncStorage)

### Notificaciones locales
- Botón "Recordatorio" que programa una notificación local en 10 segundos
- Solicita permisos al usuario antes de programar

### Navegación
- Stack Navigation con 4 pantallas: Login, Registro, Home, Agregar producto

## Componentes reutilizables
- `CustomButton` - Botón con variantes primary/secondary
- `ProductItem` - Ítem de lista con checkbox, texto y botón de eliminar

## Video demo

[Ver demo en YouTube](https://www.youtube.com/watch?v=2JRtUga6tBY)

---

Ezequiel Hernandez | ISTEA 2026
