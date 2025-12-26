# 🥩 Chacinar - Sistema de Gestión de Cuentas Corrientes

Sistema completo de gestión de cuentas corrientes para Chacinados y embutidos artesanales Monte Buey.

---

## 📋 Características Principales

### Para Clientes:
- ✅ **Consulta de saldo** en tiempo real
- ✅ **Historial de transacciones** con saldo antes y después de cada movimiento
- ✅ **Solicitudes de pago** con notificación al administrador
- ✅ **Envío de comprobantes** por WhatsApp a Sebastián y Claudia
- ✅ **QR de Mercado Pago** para pagos instantáneos
- ✅ **Notificaciones** de cambios en la cuenta

### Para Administradores:
- ✅ **Panel compartido** - Todos los administradores ven los mismos clientes
- ✅ **Gestión de clientes** - Crear, editar y eliminar clientes
- ✅ **Aprobación de pagos** - Aprobar o rechazar solicitudes de pago
- ✅ **Carga de boletas** - Agregar cargos a las cuentas de clientes
- ✅ **Historial global** - Ver todas las transacciones del sistema
- ✅ **Historial por cliente** - Ver transacciones específicas de cada cliente
- ✅ **Generación de PDFs** - Crear comprobantes y facturas
- ✅ **Configuración de métodos de pago** - Mercado Pago y transferencias bancarias

### Características de Seguridad:
- ✅ **Autenticación con email** y confirmación
- ✅ **Recuperación de contraseña** por email
- ✅ **Roles de usuario** (Admin/Cliente)
- ✅ **Validación de permisos** en cada operación
- ✅ **Logs de auditoría** para todas las transacciones

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase
- Git instalado

### 2. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd chacinar
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 5. Configurar Supabase

Sigue las instrucciones en `CONFIGURACION_SUPABASE.md` para:
- Configurar las plantillas de email
- Configurar la autenticación
- Configurar las políticas de seguridad (RLS)

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📊 Estructura de la Base de Datos

### Tablas Principales:

#### `users`
- `id` (UUID) - Primary Key
- `email` (TEXT) - Único
- `full_name` (TEXT)
- `role` (TEXT) - 'admin' o 'cliente'
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `accounts`
- `id` (UUID) - Primary Key
- `user_id` (UUID) - Foreign Key a users
- `balance` (NUMERIC) - Saldo actual
- `mercadopago_wallet` (TEXT) - Alias de Mercado Pago
- `link_code` (TEXT) - Código para vincular cuenta
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `transactions`
- `id` (UUID) - Primary Key
- `account_id` (UUID) - Foreign Key a accounts
- `type` (TEXT) - 'cargo' o 'pago'
- `amount` (NUMERIC) - Monto de la transacción
- `description` (TEXT) - Descripción opcional
- `status` (TEXT) - 'aprobado', 'pendiente', 'rechazado'
- `created_by` (UUID) - Usuario que creó la transacción
- `approved_by` (UUID) - Usuario que aprobó la transacción
- `balance_before` (NUMERIC) - Saldo antes de la transacción
- `balance_after` (NUMERIC) - Saldo después de la transacción
- `created_at` (TIMESTAMP)
- `approved_at` (TIMESTAMP)

#### `modification_requests`
- `id` (UUID) - Primary Key
- `account_id` (UUID) - Foreign Key a accounts
- `type` (TEXT) - 'cargo' o 'pago'
- `amount` (NUMERIC) - Monto solicitado
- `description` (TEXT) - Descripción opcional
- `status` (TEXT) - 'pendiente', 'aprobado', 'rechazado'
- `requested_by` (UUID) - Usuario que solicitó
- `reviewed_by` (UUID) - Usuario que revisó
- `created_at` (TIMESTAMP)
- `reviewed_at` (TIMESTAMP)

#### `notifications`
- `id` (UUID) - Primary Key
- `user_id` (UUID) - Foreign Key a users
- `title` (TEXT) - Título de la notificación
- `message` (TEXT) - Mensaje
- `type` (TEXT) - 'info', 'success', 'warning', 'error'
- `read` (BOOLEAN) - Si fue leída
- `created_at` (TIMESTAMP)

#### `payment_methods`
- `id` (UUID) - Primary Key
- `admin_id` (UUID) - Foreign Key a users
- `mp_alias` (TEXT) - Alias de Mercado Pago
- `mp_enabled` (BOOLEAN)
- `bank_name` (TEXT) - Nombre del banco
- `bank_account_number` (TEXT) - Número de cuenta
- `bank_cbu` (TEXT) - CBU
- `bank_enabled` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 🔐 Configuración de Seguridad (RLS)

### Políticas de Row Level Security:

#### Para `users`:
```sql
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Los administradores pueden ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Para `accounts`:
```sql
-- Los clientes pueden ver su propia cuenta
CREATE POLICY "Clients can view own account" ON accounts
  FOR SELECT USING (user_id = auth.uid());

-- Los administradores pueden ver todas las cuentas
CREATE POLICY "Admins can view all accounts" ON accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Los administradores pueden modificar todas las cuentas
CREATE POLICY "Admins can update all accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Para `transactions`:
```sql
-- Los clientes pueden ver sus propias transacciones
CREATE POLICY "Clients can view own transactions" ON transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM accounts WHERE user_id = auth.uid()
    )
  );

-- Los administradores pueden ver todas las transacciones
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Los administradores pueden crear transacciones
CREATE POLICY "Admins can create transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🎨 Flujo de Usuario

### Flujo del Cliente:

1. **Registro**
   - Selecciona "Soy Cliente"
   - Completa el formulario
   - Confirma email
   - Inicia sesión

2. **Consulta de Saldo**
   - Ve su saldo actual
   - Ve el historial de transacciones
   - Ve las últimas boletas

3. **Realizar un Pago**
   - Ve las opciones de pago (QR de Mercado Pago)
   - Envía comprobante por WhatsApp a Sebastián o Claudia
   - Notifica el pago realizado
   - Espera aprobación del administrador

4. **Solicitar Cargo**
   - Crea una solicitud de cargo
   - Espera aprobación del administrador

### Flujo del Administrador:

1. **Registro**
   - Selecciona "Soy Administrador"
   - Completa el formulario
   - Confirma email
   - Inicia sesión

2. **Gestión de Clientes**
   - Ve todos los clientes
   - Busca clientes por nombre o email
   - Ve el saldo de cada cliente
   - Accede al historial de cada cliente

3. **Aprobar Solicitudes**
   - Ve solicitudes pendientes
   - Aprueba o rechaza pagos
   - Aprueba o rechaza cargos
   - El saldo se actualiza automáticamente

4. **Cargar Boletas**
   - Selecciona un cliente
   - Ingresa monto y descripción
   - Selecciona fecha
   - Crea la boleta (se suma al saldo)

5. **Configurar Métodos de Pago**
   - Configura alias de Mercado Pago
   - Configura datos bancarios
   - Los clientes ven estos datos

6. **Ver Historial Global**
   - Ve todas las transacciones del sistema
   - Filtra por tipo (cargo/pago)
   - Ve estadísticas generales

---

## 📱 Contacto de WhatsApp

Los clientes pueden enviar comprobantes de pago a:

- **Sebastián**: +54 9 3467 49 4443
- **Claudia**: +54 9 3467 44 1282

Los enlaces de WhatsApp se generan automáticamente con:
- Nombre del cliente
- Saldo actual
- Mensaje predefinido

---

## 🐛 Depuración

### Logs en la Consola del Navegador

El sistema incluye logs detallados para depuración:

1. **Abre la consola** (F12 > Console)
2. **Observa los logs** durante:
   - Login
   - Registro
   - Carga de datos
   - Aprobación de solicitudes

### Logs Importantes:

- `"Admin cargando datos. Admin ID: [id]"` - Verifica qué admin está logueado
- `"Total de clientes cargados: [número]"` - Verifica cuántos clientes se cargan
- `"Usuario autenticado: [nombre], Rol: [rol]"` - Verifica el rol del usuario
- `"Registrando usuario con rol: [rol]"` - Verifica el rol al registrarse

---

## 🚀 Despliegue

### Opción 1: Netlify

```bash
npm run build
netlify deploy --prod
```

### Opción 2: Vercel

```bash
npm run build
vercel --prod
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📄 Licencia

© 2024 Chacinar - Chacinados y embutidos artesanales Monte Buey. Todos los derechos reservados.

---

## 👥 Soporte

Para soporte técnico, contacta a:
- Sebastián: +54 9 3467 49 4443
- Claudia: +54 9 3467 44 1282
