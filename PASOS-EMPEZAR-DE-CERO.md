# 🔄 EMPEZAR DE CERO - GUÍA COMPLETA

## 🎯 Objetivo

Borrar TODO y empezar limpio para que:
- **2-3 cuentas de administrador** (tú y los dueños)
- **Resto de cuentas como clientes** (para ver su saldo)

---

## 📋 PASO 1: Ejecutar SQL en Supabase

### 1.1 Abrir SQL Editor

Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new

### 1.2 Copiar y Ejecutar

Abre el archivo **`EMPEZAR-DE-CERO-LIMPIO.sql`** y copia TODO el contenido.

Pégalo en el SQL Editor y haz clic en **"Run"**.

**Resultado esperado:**
```
✅ TABLAS ELIMINADAS
✅ TABLAS CREADAS
✅ RLS DESHABILITADO
total_usuarios: 0
admins: 0
clientes: 0
```

---

## 📋 PASO 2: Eliminar Usuarios de Authentication

### 2.1 Ir a Authentication

Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/auth/users

### 2.2 Eliminar TODOS los usuarios

1. **Selecciona todos los usuarios** (checkbox arriba)
2. **Haz clic en "Delete users"**
3. **Confirma la eliminación**

**Resultado esperado:**
```
No users found
```

---

## 📋 PASO 3: Reiniciar Servidor

### 3.1 Detener el servidor

En la terminal, presiona **Ctrl + C**

### 3.2 Iniciar de nuevo

```bash
npm run dev
```

**Resultado esperado:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 📋 PASO 4: Limpiar Navegador

### 4.1 Abrir Consola

Presiona **F12**

### 4.2 Limpiar Local Storage

1. Ve a: **Application → Local Storage → http://localhost:3000**
2. **Haz clic derecho → Clear**
3. **Cierra la consola**

### 4.3 Recargar

Presiona **F5**

---

## 📋 PASO 5: Crear Primera Cuenta (ADMIN)

### 5.1 Ir a la App

Ve a: http://localhost:3000

### 5.2 Crear Cuenta

1. **Clic en "Crear cuenta"**
2. **Selecciona "ADMINISTRADOR"** ⚠️ MUY IMPORTANTE
3. **Completa:**
   - Nombre: Tu nombre
   - Email: tu-email@ejemplo.com
   - Contraseña: (mínimo 6 caracteres)
4. **Clic en "Crear Cuenta"**

### 5.3 Confirmar Email

1. **Ve a tu bandeja de entrada**
2. **Busca el email de Supabase**
3. **Haz clic en "Confirm your email"**

### 5.4 Iniciar Sesión

1. **Vuelve a http://localhost:3000**
2. **Clic en "Soy Administrador"**
3. **Ingresa tu email y contraseña**
4. **Clic en "Iniciar Sesión"**

**Resultado esperado:**
```
✅ Deberías ver el PANEL DE ADMINISTRADOR
✅ Con estadísticas, clientes, etc.
```

---

## 📋 PASO 6: Crear Más Admins (Opcional)

Si necesitas 2 o 3 admins más:

1. **Cierra sesión**
2. **Clic en "Crear cuenta"**
3. **Selecciona "ADMINISTRADOR"**
4. **Completa los datos**
5. **Confirma el email**
6. **Inicia sesión**

---

## 📋 PASO 7: Crear Clientes

Para crear cuentas de clientes:

1. **Cierra sesión**
2. **Clic en "Crear cuenta"**
3. **Selecciona "CLIENTE"** ⚠️ IMPORTANTE
4. **Completa los datos**
5. **Confirma el email**
6. **Inicia sesión**

**Resultado esperado:**
```
✅ Deberías ver el PANEL DE CLIENTE
✅ Con saldo, boletas, QR de pago, etc.
```

---

## 🔍 Verificar en Base de Datos

### Ver Usuarios

```sql
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at;
```

**Resultado esperado:**
```
email                 | full_name | role
admin@ejemplo.com     | Admin 1   | admin
admin2@ejemplo.com    | Admin 2   | admin
cliente1@ejemplo.com  | Cliente 1 | cliente
cliente2@ejemplo.com  | Cliente 2 | cliente
```

---

## ✅ Cómo Funciona el Sistema

### Administradores (2-3 cuentas)

- ✅ Ven TODOS los clientes
- ✅ Pueden crear boletas
- ✅ Pueden generar PDFs
- ✅ Configuran Mercado Pago
- ✅ Aprueban/rechazan solicitudes
- ✅ Ven estadísticas completas

### Clientes (mayoría de usuarios)

- ✅ Ven solo SU saldo
- ✅ Ven sus boletas
- ✅ Pueden pagar con QR
- ✅ Pueden solicitar modificaciones
- ✅ NO ven otros clientes

---

## 🆘 Solución de Problemas

### Problema: Sigo viendo panel de cliente siendo admin

**Solución:**
1. Verifica tu rol en la base de datos:
   ```sql
   SELECT email, role FROM users WHERE email = 'tu-email@ejemplo.com';
   ```
2. Si dice 'cliente', cámbialo:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
   ```
3. Limpia Local Storage (F12 → Application → Clear)
4. Cierra sesión y vuelve a entrar

### Problema: No recibo el email de confirmación

**Solución:**
1. Revisa spam/correo no deseado
2. Espera 5 minutos
3. En Supabase, ve a Authentication → Users
4. Busca tu usuario y márcalo como "Email confirmed"

### Problema: Error al crear cuenta

**Solución:**
1. Verifica que ejecutaste el SQL de PASO 1
2. Verifica que eliminaste los usuarios de Authentication
3. Reinicia el servidor
4. Limpia Local Storage
5. Intenta de nuevo

---

## 📊 Resumen

```
┌─────────────────────────────────────┐
│  ESTRUCTURA FINAL                   │
├─────────────────────────────────────┤
│                                     │
│  👑 Admin 1 (Dueño 1)              │
│  👑 Admin 2 (Dueño 2)              │
│  👑 Admin 3 (Empleado) [Opcional]  │
│                                     │
│  👤 Cliente 1                       │
│  👤 Cliente 2                       │
│  👤 Cliente 3                       │
│  👤 Cliente 4                       │
│  👤 ... (todos los demás)          │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎉 ¡Listo!

Ahora tienes un sistema limpio donde:
- ✅ Los admins ven TODO
- ✅ Los clientes ven solo su cuenta
- ✅ El registro funciona correctamente
- ✅ No hay cuentas mezcladas

**¡Sigue los pasos en orden y todo funcionará perfecto! 🚀**
