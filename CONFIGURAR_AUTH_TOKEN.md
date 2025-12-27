# 🔐 Configurar Auth Token de Twilio

## ⚠️ Acción Requerida

Necesitas editar manualmente el archivo `.env.local` y reemplazar `[AuthToken]` con tu Auth Token real de Twilio.

---

## 📝 Pasos:

### 1. Abrir el archivo `.env.local`

Ubicación: `c:\Users\sebas\OneDrive\Escritorio\chacinar\.env.local`

### 2. Buscar esta línea:

```env
TWILIO_AUTH_TOKEN=[AuthToken]
```

### 3. Reemplazar con tu Auth Token real

Del código que compartiste, tu Auth Token es el valor que pusiste aquí:

```javascript
const authToken = '[AuthToken]';  // ← Este valor
```

Debería quedar algo así:

```env
TWILIO_AUTH_TOKEN=tu_auth_token_real_aqui
```

**Ejemplo** (NO uses este, usa el tuyo):
```env
TWILIO_AUTH_TOKEN=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## ✅ Archivo `.env.local` Completo

Debería verse así:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng

# Twilio Configuration for WhatsApp
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_real_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 🔍 Dónde Encontrar tu Auth Token

1. Ir a: https://console.twilio.com/
2. En el Dashboard principal, buscar **"Auth Token"**
3. Hacer clic en **"Show"** o el ícono del ojo
4. Copiar el valor completo

---

## 🚀 Después de Configurar

1. **Guardar** el archivo `.env.local`
2. **Reiniciar** el servidor de desarrollo:
   ```bash
   # Detener el servidor (Ctrl+C)
   # Iniciar de nuevo
   npm run dev
   ```

3. **Probar** enviando un mensaje:
   - Ir al panel de admin
   - Cargar saldo a un cliente con teléfono configurado
   - Verificar que llegue el WhatsApp

---

## ⚠️ Seguridad

- **NUNCA** compartas tu Auth Token públicamente
- **NO** lo subas a GitHub (el archivo `.env.local` ya está en `.gitignore`)
- Si lo compartes accidentalmente, **regenera** el token en Twilio

---

## ✅ Verificar que Funciona

Después de configurar y reiniciar, en la consola del navegador (F12) deberías ver:

✅ `Mensaje de WhatsApp enviado: SMxxxx`

Si ves:
❌ `Twilio no está configurado` → El Auth Token no está bien configurado
❌ `Error 401` → El Auth Token es incorrecto
