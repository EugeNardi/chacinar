# 📧 Configurar Emails para que NO lleguen a SPAM

## 🔴 Problema
Los emails de Supabase están llegando a la carpeta de spam en lugar de la bandeja principal.

## ✅ Soluciones (de mejor a peor)

---

## 🥇 OPCIÓN 1: Configurar SMTP Personalizado (RECOMENDADO)

Usar tu propio servidor SMTP garantiza mejor entregabilidad y control total.

### Proveedores Recomendados:

#### **A) Gmail (Gratis hasta 500 emails/día)**

1. **Crear contraseña de aplicación:**
   - Ve a [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Activa "Verificación en 2 pasos" si no está activada
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Copia la contraseña de 16 caracteres

2. **Configurar en Supabase:**
   - Ve a tu proyecto en Supabase
   - **Authentication** → **Settings** → **SMTP Settings**
   - Activa "Enable Custom SMTP"
   - Configura:
     ```
     Host: smtp.gmail.com
     Port: 587
     Username: tu-email@gmail.com
     Password: [contraseña de aplicación de 16 caracteres]
     Sender email: tu-email@gmail.com
     Sender name: Chacinar
     ```
   - Guarda cambios

#### **B) SendGrid (Gratis hasta 100 emails/día)**

1. **Crear cuenta:**
   - Ve a [https://sendgrid.com](https://sendgrid.com)
   - Regístrate gratis
   - Verifica tu email

2. **Crear API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key
   - Nombre: "Supabase"
   - Permisos: Full Access
   - Copia la API Key

3. **Configurar en Supabase:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [tu API Key de SendGrid]
   Sender email: tu-email-verificado@dominio.com
   Sender name: Chacinar
   ```

#### **C) Resend (Gratis hasta 3,000 emails/mes)**

1. **Crear cuenta:**
   - Ve a [https://resend.com](https://resend.com)
   - Regístrate gratis

2. **Obtener API Key:**
   - Dashboard → API Keys
   - Create API Key
   - Copia la key

3. **Configurar en Supabase:**
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: [tu API Key de Resend]
   Sender email: tu-email@dominio.com
   Sender name: Chacinar
   ```

---

## 🥈 OPCIÓN 2: Verificar Dominio en Supabase

Si tienes un dominio propio (ej: chacinar.com):

1. **En Supabase:**
   - Authentication → Settings → Email Templates
   - Configura "Sender email" con tu dominio

2. **Agregar registros DNS:**
   - En tu proveedor de dominio (GoDaddy, Namecheap, etc.)
   - Agrega estos registros SPF y DKIM que Supabase te proporcione

3. **Esperar propagación:**
   - Puede tomar 24-48 horas

---

## 🥉 OPCIÓN 3: Ajustes Temporales (Solo Desarrollo)

### Desactivar confirmación de email:

1. **Supabase Dashboard:**
   - Authentication → Settings
   - Desactiva "Enable email confirmations"
   - Guarda

⚠️ **IMPORTANTE:** Esto permite que usuarios se registren sin confirmar email. Solo usar en desarrollo.

---

## 🔧 OPCIÓN 4: Personalizar Templates de Email

Emails más profesionales tienen menos probabilidad de ir a spam:

1. **En Supabase:**
   - Authentication → Email Templates

2. **Personalizar cada template:**
   - **Confirm signup:**
     ```html
     <h2>¡Bienvenido a Chacinar!</h2>
     <p>Hola,</p>
     <p>Gracias por registrarte. Por favor confirma tu email haciendo clic en el botón:</p>
     <a href="{{ .ConfirmationURL }}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Confirmar Email</a>
     <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
     <p>Saludos,<br>El equipo de Chacinar</p>
     ```

   - **Reset password:**
     ```html
     <h2>Restablecer Contraseña</h2>
     <p>Hola,</p>
     <p>Recibimos una solicitud para restablecer tu contraseña.</p>
     <a href="{{ .ConfirmationURL }}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Restablecer Contraseña</a>
     <p>Si no solicitaste esto, ignora este email.</p>
     <p>Saludos,<br>El equipo de Chacinar</p>
     ```

---

## ✅ Verificar que Funciona

Después de configurar SMTP:

1. **Prueba de registro:**
   - Regístrate con un email nuevo
   - Verifica que el email llegue a la bandeja principal (no spam)

2. **Prueba de recuperación:**
   - Usa "Olvidé mi contraseña"
   - Verifica que llegue correctamente

3. **Revisar logs:**
   - Supabase → Logs → Auth
   - Busca errores de envío de email

---

## 🎯 Recomendación Final

**Para producción:**
- Usa **Gmail** si es un proyecto pequeño (gratis, confiable)
- Usa **SendGrid** o **Resend** si necesitas más volumen
- Personaliza los templates de email
- Agrega tu logo y marca

**Para desarrollo:**
- Desactiva confirmación de email temporalmente
- O usa Gmail con contraseña de aplicación

---

## 📝 Checklist

- [ ] Elegí un proveedor SMTP (Gmail/SendGrid/Resend)
- [ ] Creé las credenciales (contraseña de app o API key)
- [ ] Configuré SMTP en Supabase
- [ ] Personalicé los templates de email
- [ ] Probé el registro de un usuario nuevo
- [ ] Verifiqué que el email llegó a la bandeja principal
- [ ] Los emails ya no van a spam ✅

---

## 🆘 Si Aún Van a Spam

1. **Marca como "No es spam"** en tu cliente de email
2. **Agrega el remitente a contactos**
3. **Espera 24-48 horas** para que los filtros de spam aprendan
4. **Verifica SPF/DKIM** si usas dominio propio
