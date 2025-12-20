# 🔧 Actualizar Base de Datos de Supabase

## ⚠️ IMPORTANTE: Debes actualizar las políticas RLS

El error 401 que viste se debe a que las políticas de seguridad no permiten insertar nuevos usuarios durante el registro.

## 📋 Pasos para Actualizar

### 1. Ir a Supabase SQL Editor

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new
2. Copia y pega el siguiente código SQL:

```sql
-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can create their own account" ON accounts;
DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;

-- Crear nuevas políticas para users
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Crear nuevas políticas para accounts
CREATE POLICY "Users can create their own account" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

3. Haz clic en **Run** (o presiona Ctrl+Enter)

### 2. Verificar que se Aplicaron

Deberías ver un mensaje de éxito. Si hay errores, es posible que las políticas ya existan.

## 🚫 Error 429 (Too Many Requests)

Este error significa que Supabase está limitando las solicitudes de registro porque:
- Has intentado registrarte muchas veces en poco tiempo
- Supabase tiene límites de rate limiting en el plan gratuito

### Soluciones:

1. **Espera 5-10 minutos** antes de intentar registrarte nuevamente
2. **Usa el navegador en modo incógnito** para limpiar cookies
3. **Limpia la caché del navegador** (Ctrl+Shift+Delete)

## ✅ Después de Actualizar

1. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

2. **Espera unos minutos** si tuviste el error 429

3. **Intenta registrarte** nuevamente:
   - Ve a http://localhost:3000
   - Clic en "Registrarse"
   - Selecciona "Administrador" o "Cliente"
   - Completa el formulario

## 🎯 Verificar que Funciona

Si todo está bien:
- ✅ No verás error 401
- ✅ El registro se completará exitosamente
- ✅ Serás redirigido al panel correspondiente

## 🆘 Si Sigue Sin Funcionar

1. Verifica que ejecutaste el SQL correctamente
2. Verifica que esperaste suficiente tiempo (error 429)
3. Revisa la consola del navegador (F12) para ver errores específicos
4. Verifica que las variables de entorno estén configuradas

---

**Una vez actualizado, el registro funcionará perfectamente! 🚀**
