# 🚨 Solución al Error 429 (Too Many Requests)

## ❌ El Problema

Supabase está bloqueando temporalmente las solicitudes de registro porque has intentado registrarte muchas veces en poco tiempo. Esto es una medida de seguridad.

## ✅ Solución: Crear Usuario Manualmente

En lugar de esperar, vamos a crear el usuario directamente en Supabase.

---

## 📋 Pasos Detallados

### Paso 1: Ir a Authentication en Supabase

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/auth/users
2. Haz clic en **"Add user"** (botón verde arriba a la derecha)
3. Selecciona **"Create new user"**

### Paso 2: Crear Usuario Admin

Completa el formulario:
- **Email**: `admin@chacinar.com`
- **Password**: `Admin123456`
- **Auto Confirm User**: ✅ Marcado (importante!)
- Haz clic en **"Create user"**

### Paso 3: Copiar el UUID

1. Después de crear el usuario, verás una lista de usuarios
2. Busca el usuario `admin@chacinar.com`
3. Haz clic en él para ver los detalles
4. **Copia el UUID** (es algo como: `550e8400-e29b-41d4-a716-446655440000`)

### Paso 4: Ejecutar SQL

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new
2. Copia este código (reemplaza `UUID-DEL-USUARIO` con el UUID que copiaste):

```sql
INSERT INTO users (id, email, full_name, role)
VALUES (
  'UUID-DEL-USUARIO',
  'admin@chacinar.com',
  'Administrador Chacinar',
  'admin'
);
```

3. Haz clic en **Run**

### Paso 5: Iniciar Sesión

1. Ve a: http://localhost:3000
2. Haz clic en **"¿Ya tienes cuenta?"** → **"Iniciar Sesión"**
3. Ingresa:
   - **Email**: `admin@chacinar.com`
   - **Password**: `Admin123456`
4. Haz clic en **"Iniciar Sesión"**

---

## 🎯 Crear un Cliente de Prueba (Opcional)

Si quieres probar el panel de cliente:

### 1. Crear Usuario en Authentication
- Email: `cliente@test.com`
- Password: `Cliente123`
- Auto Confirm User: ✅

### 2. Copiar UUID del cliente

### 3. Ejecutar SQL
```sql
-- Insertar usuario
INSERT INTO users (id, email, full_name, role)
VALUES (
  'UUID-DEL-CLIENTE',
  'cliente@test.com',
  'Cliente de Prueba',
  'cliente'
);

-- Crear cuenta corriente
INSERT INTO accounts (user_id, balance)
VALUES (
  'UUID-DEL-CLIENTE',
  0.00
);
```

---

## ⏰ ¿Cuándo Funcionará el Registro Automático?

El error 429 es temporal. Después de **24 horas** sin intentar registrarte, Supabase desbloqueará las solicitudes y el registro automático volverá a funcionar.

Mientras tanto, usa el método manual para crear usuarios.

---

## ✅ Verificar que Funciona

Después de crear el usuario manualmente:

1. ✅ Deberías poder iniciar sesión
2. ✅ Verás el panel de administrador
3. ✅ Podrás gestionar clientes y solicitudes
4. ✅ Todo funcionará normalmente

---

## 🆘 Si Hay Errores

### Error: "duplicate key value"
- El usuario ya existe en la tabla `users`
- Usa un email diferente o elimina el usuario existente

### Error: "violates foreign key constraint"
- El UUID no coincide con el usuario de Authentication
- Verifica que copiaste el UUID correcto

### No puedo iniciar sesión
- Verifica que marcaste "Auto Confirm User" al crear el usuario
- Verifica que el password es correcto
- Verifica que ejecutaste el SQL correctamente

---

**¡Una vez creado el usuario manualmente, podrás usar la aplicación normalmente! 🚀**
