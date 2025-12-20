# 🔗 VINCULAR USUARIOS REALES

## El Problema

Los 3 clientes que ves en el panel admin son **falsos** (solo datos de ejemplo en la base de datos, no usuarios reales de Authentication).

## ✅ La Solución

Voy a eliminar esos clientes falsos y vincular **SOLO tus 2 cuentas reales**:
- Tu cuenta de admin
- Tu cuenta de cliente

---

## 📋 Pasos

### 1️⃣ Ejecutar SQL

Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new

1. Abre el archivo **`LIMPIAR-Y-VINCULAR-REALES.sql`**
2. Copia TODO el contenido
3. Pégalo en Supabase SQL Editor
4. Haz clic en **"Run"**

### 2️⃣ Verificar Resultado

Deberías ver:

```
✅ Admin vinculado: admin@tudominio.com (ID: xxx)
✅ Cliente vinculado: cliente@tudominio.com (ID: xxx)

=== USUARIOS VINCULADOS ===
- admin@tudominio.com | Administrador | ✅ Tiene cuenta
- cliente@tudominio.com | Cliente | ✅ Tiene cuenta
```

### 3️⃣ Reiniciar Servidor

```bash
npm run dev
```

### 4️⃣ Probar

1. Ve a http://localhost:3000
2. Inicia sesión como **Admin**
3. Verás SOLO 1 cliente (tu cuenta de cliente real)

---

## 🔗 Cómo Funciona Ahora

### Como Admin:

1. **Cargar saldo** al cliente:
   - Busca al cliente
   - Clic en "Cargar"
   - Ingresa monto (ej: 5000)
   - Confirma

2. **Configurar Mercado Pago**:
   - Clic en el botón 💳
   - Ingresa alias o CVU
   - Guarda

### Como Cliente:

1. **Ver saldo actualizado**:
   - Inicia sesión como cliente
   - Verás el saldo que el admin cargó

2. **Pagar con QR**:
   - Si tienes saldo > 0, verás el QR
   - Escanea con Mercado Pago
   - Paga el monto

3. **Solicitar modificaciones**:
   - Completa el formulario
   - El admin debe aprobar

---

## 🎯 Flujo Completo de Ejemplo

### Escenario: Cliente compra $10,000

1. **Admin carga saldo:**
   - Login como admin
   - Busca al cliente
   - Carga $10,000
   - Descripción: "Compra de productos"

2. **Cliente ve el saldo:**
   - Login como cliente
   - Ve: Saldo actual: $10,000
   - Ve el QR de Mercado Pago

3. **Cliente paga:**
   - Escanea QR
   - Paga $10,000 por Mercado Pago
   - Avisa al admin

4. **Admin confirma pago:**
   - Login como admin
   - Verifica el pago en Mercado Pago
   - Carga -$10,000 (descuenta)
   - Cliente queda en $0

---

## 📊 Agregar Más Clientes

### Opción 1: Desde Authentication

1. Ve a: Authentication → Users → Add user
2. Email: `nuevo@cliente.com`
3. Password: `Cliente123`
4. ✅ Auto Confirm User
5. Ejecuta `LIMPIAR-Y-VINCULAR-REALES.sql` de nuevo

### Opción 2: Desde la App

1. En http://localhost:3000
2. Clic en "Registrarse"
3. Selecciona "Cliente"
4. Completa el formulario
5. Confirma el email
6. ¡Listo!

---

## ⚠️ Importante

- Los clientes falsos serán **eliminados permanentemente**
- Solo quedarán tus 2 cuentas reales
- Están **100% conectadas** a Authentication
- Todos los cambios se sincronizan en tiempo real

---

## 🚀 Después de Esto

Una vez que funcione, implementaré:

- 📊 **Panel admin extendido** con estadísticas completas
- 📈 **Historial global** de todas las transacciones
- 🔤 **Buscador alfabético** A-Z
- 💰 **Promedios y totales** por cliente y general

---

**¡Ejecuta el SQL y prueba el sistema con tus usuarios reales! 🎉**
