# 📧 Configurar Emails Sin Límite en Supabase

## 🔴 Problema
Supabase tiene un límite de rate limiting para emails que impide enviar más de 4 emails al mismo destinatario en poco tiempo, marcándolos como spam.

## ✅ Solución

### Opción 1: Configuración en Supabase Dashboard (RECOMENDADO)

1. **Ve a tu proyecto en Supabase**
   - [https://supabase.com](https://supabase.com)
   - Selecciona tu proyecto "chacinar"

2. **Abre Authentication Settings**
   - En el menú lateral → **Authentication**
   - Clic en **Settings** (o **Configuration**)

3. **Ajusta Rate Limits**
   - Busca la sección **"Rate Limits"** o **"Email Rate Limiting"**
   - Aumenta el límite o desactívalo temporalmente
   - Opciones típicas:
     - **Email Rate Limit:** Cambiar de 4 a 20 o 50 por hora
     - **SMS Rate Limit:** Similar
     - O desactivar completamente para desarrollo

4. **Guarda los cambios**

---

### Opción 2: Desactivar Confirmación de Email (Solo para Desarrollo)

⚠️ **SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN**

1. **Ve a Authentication → Settings**
2. Busca **"Email Confirmation"**
3. **Desactiva** "Enable email confirmations"
4. Guarda

Esto permite que los usuarios se registren sin necesidad de confirmar el email.

---

### Opción 3: Configurar SMTP Personalizado

Si usas tu propio servidor SMTP (Gmail, SendGrid, etc.), no tendrás límites de Supabase:

1. **Ve a Authentication → Settings**
2. Busca **"SMTP Settings"** o **"Email Provider"**
3. Configura tu servidor SMTP:
   - **Host:** smtp.gmail.com (o tu proveedor)
   - **Port:** 587
   - **Username:** tu email
   - **Password:** contraseña de aplicación
4. Guarda

---

## 🎯 Para Permitir Re-registro de Emails Antiguos

Si un usuario antiguo fue eliminado y quieres que pueda registrarse de nuevo:

### SQL para eliminar usuario de Auth:

```sql
-- Ver usuarios en auth
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'email@ejemplo.com';

-- Eliminar usuario de auth (permite re-registro)
DELETE FROM auth.users
WHERE email = 'email@ejemplo.com';

-- Verificar que se eliminó
SELECT COUNT(*) FROM auth.users WHERE email = 'email@ejemplo.com';
```

⚠️ **IMPORTANTE:** Esto eliminará el usuario de autenticación. Si quieres mantener su historial en la app, NO hagas esto.

---

## 📝 Recomendación

**Para producción:**
- Mantén la confirmación de email activada
- Usa un SMTP personalizado (más confiable)
- Configura rate limits razonables (10-20 por hora)

**Para desarrollo:**
- Desactiva confirmación de email temporalmente
- O aumenta los rate limits a 50-100 por hora
