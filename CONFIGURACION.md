# 🔧 Configuración de Supabase

## ⚠️ IMPORTANTE: Debes configurar Supabase antes de ejecutar el proyecto

Actualmente el proyecto muestra un error porque **las credenciales de Supabase no están configuradas**.

## Pasos para Configurar

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (2-3 minutos)

### 2. Obtener Credenciales

En tu proyecto de Supabase:

1. Ve a **Settings** (⚙️) → **API**
2. Copia estos valores:
   - **Project URL** (ejemplo: `https://abcdefgh.supabase.co`)
   - **anon public** key (una clave larga que empieza con `eyJ...`)

### 3. Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE**: Usa tus credenciales reales, no los ejemplos de arriba.

### 4. Crear Tablas en la Base de Datos

1. En Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega TODO el contenido del archivo `supabase/schema.sql`
4. Haz clic en **Run** para ejecutar el script

Esto creará:
- ✅ Tabla `users` (usuarios)
- ✅ Tabla `accounts` (cuentas corrientes)
- ✅ Tabla `transactions` (transacciones)
- ✅ Tabla `modification_requests` (solicitudes)
- ✅ Políticas de seguridad (RLS)

### 5. Crear Usuario Administrador

1. En Supabase, ve a **Authentication** → **Users**
2. Clic en **Add user** → **Create new user**
3. Ingresa:
   - Email: `admin@chacinar.com` (o el que prefieras)
   - Password: Una contraseña segura
4. Copia el **UUID** del usuario (ejemplo: `550e8400-e29b-41d4-a716-446655440000`)

5. Ve a **SQL Editor** y ejecuta:

```sql
-- Reemplaza 'uuid-del-usuario' con el UUID que copiaste
INSERT INTO users (id, email, full_name, role)
VALUES ('uuid-del-usuario', 'admin@chacinar.com', 'Administrador Chacinar', 'admin');
```

### 6. Reiniciar el Servidor

1. Detén el servidor (Ctrl+C en la terminal)
2. Ejecuta nuevamente:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000)

### 7. Iniciar Sesión

- **Email**: El que configuraste (ej: `admin@chacinar.com`)
- **Password**: La contraseña que elegiste

## ✅ Verificación

Si todo está bien configurado:
- ✅ No verás errores en la consola
- ✅ Podrás iniciar sesión
- ✅ Verás el panel de administrador

## 🆘 Problemas Comunes

### Error: "Invalid supabaseUrl"
- Verifica que la URL en `.env.local` sea correcta
- Debe empezar con `https://` y terminar con `.supabase.co`

### Error: "Invalid API key"
- Verifica que copiaste la clave **anon public** completa
- No uses la clave **service_role** (es diferente y más peligrosa)

### No puedo iniciar sesión
- Verifica que el usuario existe en **Authentication**
- Verifica que ejecutaste el INSERT en la tabla `users`
- Verifica que el UUID coincida exactamente

## 📞 Necesitas Ayuda?

Si tienes problemas, revisa:
1. La consola del navegador (F12)
2. La terminal donde corre `npm run dev`
3. Los logs en Supabase Dashboard

---

**Una vez configurado, el sistema funcionará perfectamente! 🚀**
