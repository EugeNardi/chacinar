# Configuración de Supabase para Chacinar

## 📧 Plantilla de Email de Confirmación

Para configurar el mensaje de bienvenida cuando un usuario confirma su cuenta:

### Pasos:

1. **Ir a Supabase Dashboard**
   - Abre tu proyecto en https://supabase.com
   - Ve a `Authentication` > `Email Templates`

2. **Editar la plantilla "Confirm signup"**

### Plantilla HTML Personalizada:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Chacinar</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                🥩 Chacinar
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Chacinados y embutidos artesanales Monte Buey
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                ¡Bienvenido a Chacinar! 🎉
              </h2>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estamos muy contentos de tenerte con nosotros. Para completar tu registro y activar tu cuenta, por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" 
                   style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); 
                          color: #ffffff; 
                          padding: 16px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-size: 16px; 
                          font-weight: bold; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(139, 69, 19, 0.3);">
                  Confirmar mi cuenta
                </a>
              </div>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
              </p>
              
              <div style="background-color: #f9f9f9; border-left: 4px solid #8B4513; padding: 15px; margin-top: 30px; border-radius: 4px;">
                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                  <strong>💡 Nota importante:</strong> Este enlace expirará en 24 horas por seguridad.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 14px; margin: 0 0 10px 0;">
                Chacinados y embutidos artesanales Monte Buey
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                📱 +54 9 3467 49 4443 (Sebastián) | +54 9 3467 44 1282 (Claudia)
              </p>
              <p style="color: #cccccc; font-size: 11px; margin: 15px 0 0 0;">
                © 2024 Chacinar. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Plantilla de Texto Plano (fallback):

```
¡Bienvenido a Chacinar! 🎉

Estamos muy contentos de tenerte con nosotros.

Para completar tu registro y activar tu cuenta, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:

{{ .ConfirmationURL }}

Si no creaste esta cuenta, puedes ignorar este correo de forma segura.

💡 Nota importante: Este enlace expirará en 24 horas por seguridad.

---
Chacinados y embutidos artesanales Monte Buey
📱 +54 9 3467 49 4443 (Sebastián) | +54 9 3467 44 1282 (Claudia)

© 2024 Chacinar. Todos los derechos reservados.
```

---

## 🔐 Configuración de Autenticación

### Configuraciones Recomendadas:

1. **Email Settings** (Authentication > Settings):
   - ✅ Enable email confirmations
   - ✅ Enable email change confirmations
   - ✅ Secure email change
   - Confirmation URL: `https://tu-dominio.com/auth`

2. **Password Settings**:
   - Minimum password length: 6 caracteres
   - ✅ Require uppercase
   - ✅ Require lowercase
   - ✅ Require numbers

3. **Email Rate Limits**:
   - Rate limit per hour: 4 emails
   - (Para evitar spam)

---

## 📧 Otras Plantillas de Email

### Plantilla de Recuperación de Contraseña

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar Contraseña - Chacinar</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                🥩 Chacinar
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Chacinados y embutidos artesanales Monte Buey
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                Recuperar Contraseña 🔐
              </h2>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú, haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{ .ConfirmationURL }}" 
                   style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); 
                          color: #ffffff; 
                          padding: 16px 40px; 
                          text-decoration: none; 
                          border-radius: 8px; 
                          font-size: 16px; 
                          font-weight: bold; 
                          display: inline-block;
                          box-shadow: 0 4px 6px rgba(139, 69, 19, 0.3);">
                  Restablecer Contraseña
                </a>
              </div>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px;">
                <p style="color: #856404; font-size: 14px; line-height: 1.6; margin: 0;">
                  <strong>⚠️ Importante:</strong> Si no solicitaste este cambio, ignora este correo. Tu contraseña permanecerá sin cambios.
                </p>
              </div>
              
              <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                Este enlace expirará en 1 hora por seguridad.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 14px; margin: 0 0 10px 0;">
                Chacinados y embutidos artesanales Monte Buey
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                📱 +54 9 3467 49 4443 (Sebastián) | +54 9 3467 44 1282 (Claudia)
              </p>
              <p style="color: #cccccc; font-size: 11px; margin: 15px 0 0 0;">
                © 2024 Chacinar. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🚀 Pasos para Aplicar las Plantillas

1. **Accede a Supabase Dashboard**
2. **Ve a Authentication > Email Templates**
3. **Selecciona "Confirm signup"**
4. **Pega la plantilla HTML en el editor**
5. **Guarda los cambios**
6. **Repite para "Reset password" y otras plantillas**

---

## ✅ Verificación

Después de configurar:

1. Registra una cuenta de prueba
2. Verifica que el email llegue con el diseño correcto
3. Confirma que los enlaces funcionen
4. Prueba la recuperación de contraseña

---

## 📝 Notas Adicionales

- Las plantillas usan variables de Supabase como `{{ .ConfirmationURL }}`
- Los colores están basados en la paleta de Chacinar (#8B4513 - marrón)
- El diseño es responsive y se ve bien en móviles
- Incluye información de contacto de Sebastián y Claudia
