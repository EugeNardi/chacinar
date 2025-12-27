# 📱 Configuración de WhatsApp - Mensajes Automáticos

## 🎯 Descripción

El sistema ahora envía mensajes automáticos de WhatsApp desde el teléfono de Sebastián (+54 9 3467 49 4443) a los clientes cuando:

1. **Se carga un nuevo saldo** (cargo)
2. **Se aprueba un pago** realizado por el cliente

---

## 🔧 Configuración de Twilio

### Paso 1: Crear Cuenta en Twilio

1. Ir a [https://www.twilio.com/](https://www.twilio.com/)
2. Crear una cuenta gratuita
3. Verificar tu número de teléfono (el de Sebastián: +54 9 3467 49 4443)

### Paso 2: Obtener Credenciales

Una vez en el Dashboard de Twilio:

1. **Account SID**: Copiar desde el dashboard principal
2. **Auth Token**: Copiar desde el dashboard principal (hacer clic en "Show" para verlo)
3. **WhatsApp Number**: Twilio te asignará un número de WhatsApp Sandbox

### Paso 3: Configurar WhatsApp Sandbox

1. En Twilio, ir a **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Seguir las instrucciones para conectar tu WhatsApp:
   - Enviar un mensaje desde el WhatsApp de Sebastián al número de Twilio
   - El mensaje debe ser: `join [código-único]` (Twilio te dirá el código exacto)
3. Una vez conectado, el Sandbox estará activo

**IMPORTANTE**: El WhatsApp Sandbox es gratuito pero tiene limitaciones:
- Solo funciona con números que se hayan unido al sandbox
- Cada cliente debe unirse enviando el mensaje `join [código]` primero
- Para producción real, necesitas solicitar un número de WhatsApp Business (de pago)

### Paso 4: Configurar Variables de Entorno

Crear o editar el archivo `.env.local` en la raíz del proyecto:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=tu_account_sid_aqui
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Nota**: El número `+14155238886` es el número del Sandbox de Twilio. Si tienes un número de WhatsApp Business aprobado, usa ese número en su lugar.

---

## 📊 Configuración en la Base de Datos

### Agregar Campo de Teléfono a la Tabla `users`

Ejecutar en Supabase SQL Editor:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
```

---

## 👨‍💼 Uso del Sistema

### Para Administradores

#### 1. Configurar Teléfono de un Cliente

1. Ir al **Panel de Administrador**
2. Localizar la tarjeta del cliente
3. Hacer clic en el botón **📱** (Configurar Teléfono)
4. Ingresar el número de teléfono del cliente:
   - **Formato**: Solo números, sin espacios ni guiones
   - **Ejemplo**: `3467494443`
   - El sistema automáticamente formateará a: `+549 3467 494443`
5. Hacer clic en **Guardar**

#### 2. Mensajes Automáticos

Una vez configurado el teléfono, el sistema enviará mensajes automáticamente:

**Al cargar saldo:**
```
Hola [Nombre]! 👋

Se ha registrado un nuevo cargo en tu cuenta corriente de Chacinar:

💰 *Cargo del día:* $XXX.XX
📝 *Concepto:* [Descripción]

📊 *Saldo total de tu cuenta:* $XXX.XX

Para consultar tu cuenta o realizar un pago, ingresa a tu panel de cliente.

¿Consultas? Respondé este mensaje.

_Mensaje automático de Chacinar_
```

**Al aprobar un pago:**
```
Hola [Nombre]! ✅

Tu pago ha sido aprobado exitosamente:

💚 *Pago aprobado:* $XXX.XX
📊 *Nuevo saldo:* $XXX.XX

🎉 ¡Felicitaciones! Estás al día con tu cuenta.

Gracias por tu pago.

_Mensaje automático de Chacinar_
```

---

## 🔐 Seguridad

### Variables de Entorno

**NUNCA** subir las credenciales de Twilio a Git. El archivo `.env.local` está en `.gitignore`.

### Validación de Números

El sistema valida y formatea automáticamente los números de teléfono argentinos:
- Elimina espacios y caracteres especiales
- Agrega el código de país (+54)
- Agrega el 9 para WhatsApp
- Formato final: `whatsapp:+549XXXXXXXXXX`

---

## 💰 Costos de Twilio

### Sandbox (Gratis)
- **Costo**: $0
- **Limitaciones**: 
  - Solo números que se unan al sandbox
  - Mensaje de "Sent from your Twilio trial account" en cada mensaje
  - Límite de mensajes por día

### WhatsApp Business API (Producción)
- **Costo inicial**: ~$15 USD/mes
- **Costo por mensaje**: ~$0.005 - $0.01 USD por mensaje
- **Ventajas**:
  - Sin limitaciones de destinatarios
  - Sin mensaje de "trial account"
  - Mayor límite de mensajes
  - Número verificado de WhatsApp Business

---

## 🧪 Pruebas

### Probar el Sistema

1. **Configurar teléfono de prueba**:
   - Usar tu propio número
   - Unirse al Sandbox de Twilio (enviar `join [código]`)

2. **Probar carga de saldo**:
   - Ir al panel de admin
   - Cargar saldo a un cliente con teléfono configurado
   - Verificar que llegue el mensaje de WhatsApp

3. **Probar aprobación de pago**:
   - Cliente notifica un pago
   - Admin aprueba el pago
   - Verificar que llegue el mensaje de WhatsApp

---

## ❓ Preguntas Frecuentes

### ¿Por qué no llegan los mensajes?

**Posibles causas**:
1. **Twilio no configurado**: Verificar variables de entorno
2. **Cliente no unido al Sandbox**: El cliente debe enviar `join [código]` primero
3. **Número mal formateado**: Verificar que el número esté correcto
4. **Créditos agotados**: Verificar saldo en Twilio

### ¿Cómo verifico si Twilio está configurado?

Revisar los logs del servidor:
- Si Twilio está configurado, verás: `Mensaje de WhatsApp enviado: [SID]`
- Si no está configurado, verás: `Twilio no está configurado`

### ¿Puedo usar otro servicio en lugar de Twilio?

Sí, puedes modificar el archivo `src/app/api/whatsapp/send/route.ts` para usar:
- **WhatsApp Business API** directamente
- **Vonage** (antes Nexmo)
- **MessageBird**
- Cualquier otro proveedor de WhatsApp API

### ¿Los clientes pueden responder los mensajes?

Sí, si responden, el mensaje llegará al WhatsApp de Sebastián (el número configurado en Twilio).

---

## 🚀 Migración a Producción

### Cuando estés listo para producción:

1. **Solicitar WhatsApp Business API** en Twilio
2. **Verificar el número de Sebastián** como número de WhatsApp Business
3. **Actualizar** `TWILIO_WHATSAPP_NUMBER` en `.env.local`
4. **Eliminar** la necesidad de que los clientes se unan al sandbox

---

## 📝 Notas Técnicas

### Archivos Modificados

- `src/types/index.ts`: Agregado campo `phone` al tipo `User`
- `src/lib/whatsappService.ts`: Servicio para enviar mensajes
- `src/app/api/whatsapp/send/route.ts`: API route para Twilio
- `src/app/admin/page.tsx`: 
  - Modal para configurar teléfonos
  - Envío automático al cargar saldo
  - Envío automático al aprobar pagos

### Formato de Mensajes

Los mensajes usan formato de WhatsApp:
- `*texto*` = negrita
- `_texto_` = cursiva
- Emojis para mejor UX

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en Twilio
- [ ] Obtener credenciales (SID, Token)
- [ ] Configurar WhatsApp Sandbox
- [ ] Unir el WhatsApp de Sebastián al Sandbox
- [ ] Agregar variables de entorno en `.env.local`
- [ ] Agregar campo `phone` en tabla `users` de Supabase
- [ ] Configurar teléfonos de clientes en el panel de admin
- [ ] Unir WhatsApp de clientes al Sandbox (para pruebas)
- [ ] Probar carga de saldo
- [ ] Probar aprobación de pago
- [ ] (Opcional) Migrar a WhatsApp Business API para producción

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2024  
**Sistema**: Chacinar - Mensajería Automática por WhatsApp
