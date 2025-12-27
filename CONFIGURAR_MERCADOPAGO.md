# 💳 Configuración de MercadoPago - Guía Completa

## 📋 ¿Qué es y para qué sirve?

MercadoPago permite que tus clientes te paguen fácilmente usando:
- **CVU** (Clave Virtual Uniforme)
- **Alias** (nombre personalizado como `chacinar.mp`)
- **QR** generado automáticamente

---

## 🚀 Configuración Rápida (3 pasos)

### Paso 1: Obtener tu Alias o CVU de MercadoPago

1. **Abrir la app de MercadoPago** en tu celular
2. Ir a **"Perfil"** → **"Datos de tu cuenta"**
3. Buscar:
   - **Alias**: Ejemplo: `chacinar.mp` o `sebastian.mp`
   - **CVU**: Ejemplo: `0000003100012345678901`

**Importante**: Puedes usar **alias** (más fácil de recordar) o **CVU** (número largo).

---

### Paso 2: Configurar en el Panel de Admin

1. **Iniciar sesión** como administrador
2. Ir al **Panel de Administrador**
3. Hacer clic en el botón **🪙** (Wallet) de cualquier cliente
4. Ingresar tu **alias** o **CVU** de MercadoPago
5. Hacer clic en **"Guardar"**

**Nota**: Puedes configurar un alias/CVU diferente para cada cliente si quieres, pero normalmente usarás el mismo para todos.

---

### Paso 3: ¡Listo! Ya funciona

Ahora cuando un cliente vea su panel, verá:
- ✅ **Link de pago** con el monto exacto de su deuda
- ✅ **QR** para escanear y pagar
- ✅ **Botón para copiar** el alias y el monto

---

## 📱 ¿Cómo lo ve el cliente?

Cuando el cliente entre a su panel, verá algo así:

```
┌─────────────────────────────────────┐
│  💳 Pagar con MercadoPago           │
├─────────────────────────────────────┤
│                                     │
│  [QR CODE]                          │
│                                     │
│  Alias: chacinar.mp                 │
│  Monto: $5,000.00                   │
│                                     │
│  [Copiar Alias] [Copiar Monto]      │
│  [Abrir MercadoPago]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 Configuración Avanzada (Opcional)

### Usar diferentes alias para diferentes clientes

Si quieres que cada cliente pague a un alias diferente:

1. En el panel de admin, hacer clic en **🪙** del cliente específico
2. Ingresar el alias único para ese cliente
3. Guardar

### Cambiar el alias global

Si quieres cambiar el alias para todos los clientes nuevos:

1. Configurar el alias en el primer cliente
2. Los siguientes clientes heredarán ese alias por defecto
3. Puedes cambiarlo individualmente si es necesario

---

## 💡 Consejos

### ✅ Usa Alias en lugar de CVU
- **Alias**: `chacinar.mp` (fácil de recordar)
- **CVU**: `0000003100012345678901` (difícil de recordar)

### ✅ Personaliza tu Alias
1. Abrir MercadoPago
2. Ir a **"Perfil"** → **"Datos de tu cuenta"**
3. Tocar en **"Alias"**
4. Cambiar a algo como: `chacinar.mp`, `sebastian.mp`, etc.

### ✅ Verifica que funcione
1. Pedir a un cliente que escanee el QR
2. Verificar que el monto sea correcto
3. Confirmar que el pago llegue a tu cuenta

---

## 🎯 Flujo Completo de Pago

### Para el Cliente:

1. **Ver su deuda** en el panel de cliente
2. **Escanear QR** o copiar alias y monto
3. **Pagar** desde la app de MercadoPago
4. **Notificar el pago** usando el botón "Notificar Pago"
5. **Esperar aprobación** del administrador

### Para el Administrador:

1. **Recibir el pago** en MercadoPago
2. **Ver la solicitud** en "Solicitudes Pendientes"
3. **Aprobar el pago** con un clic
4. **El saldo se actualiza** automáticamente

---

## 📊 Ventajas de MercadoPago

- ✅ **Gratis** - Sin comisiones entre cuentas argentinas
- ✅ **Instantáneo** - El dinero llega al instante
- ✅ **Seguro** - Respaldado por Mercado Libre
- ✅ **Fácil** - Solo necesitas alias o CVU
- ✅ **QR automático** - El sistema lo genera por ti

---

## ❓ Preguntas Frecuentes

### ¿Necesito una cuenta de MercadoPago?
Sí, necesitas una cuenta personal o comercial de MercadoPago.

### ¿Tiene costo?
No, las transferencias entre cuentas argentinas son gratuitas.

### ¿Puedo usar mi CVU bancario?
Sí, también puedes usar tu CVU bancario en lugar del de MercadoPago.

### ¿El QR funciona?
Sí, el QR se genera automáticamente con tu alias y el monto de la deuda del cliente.

### ¿Cómo sé si un cliente pagó?
El cliente debe usar el botón "Notificar Pago" en su panel. Luego verás la solicitud en "Solicitudes Pendientes".

### ¿Puedo cambiar el alias después?
Sí, puedes cambiar el alias en cualquier momento desde el panel de admin.

---

## 🔍 Verificar Configuración

### En el Panel de Admin:
1. Hacer clic en **🪙** de un cliente
2. Verificar que el alias esté configurado
3. Si está vacío, agregar tu alias de MercadoPago

### En el Panel del Cliente:
1. Iniciar sesión como cliente
2. Verificar que aparezca la sección "Pagar con MercadoPago"
3. Verificar que el QR y el alias sean correctos

---

## 🎉 ¡Eso es todo!

Con esto ya tienes MercadoPago configurado y funcionando. Tus clientes podrán pagarte fácilmente y tú podrás gestionar todo desde el panel de administrador.

**¿Necesitas ayuda?** Revisa que:
- ✅ Tu alias de MercadoPago esté activo
- ✅ El alias esté configurado en el panel de admin
- ✅ El cliente tenga saldo pendiente para ver las opciones de pago
