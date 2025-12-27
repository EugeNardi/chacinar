# 🚀 Configuración Rápida de WhatsApp

## ⚠️ Problema Actual
Los mensajes de WhatsApp no están llegando porque **falta configurar las credenciales de Twilio**.

---

## 📋 Pasos para Configurar (5 minutos)

### 1. Crear Cuenta en Twilio (Gratis)

1. Ir a: **https://www.twilio.com/try-twilio**
2. Registrarse con tu email
3. Verificar tu número de teléfono (el de Sebastián: +54 9 3467 49 4443)

### 2. Obtener Credenciales

Una vez dentro del Dashboard de Twilio:

1. Buscar **"Account SID"** - Copiar
2. Buscar **"Auth Token"** - Hacer clic en "Show" y copiar
3. Ir a **Messaging** → **Try it out** → **Send a WhatsApp message**
4. Copiar el número de WhatsApp Sandbox (ejemplo: `+14155238886`)

### 3. Configurar en el Proyecto

Editar el archivo `.env.local` en la raíz del proyecto:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**IMPORTANTE**: Reemplazar con tus credenciales reales de Twilio.

### 4. Unir WhatsApp al Sandbox

Para que funcione en modo prueba:

1. En Twilio, ir a **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Verás un código como: `join abc-def`
3. Desde el WhatsApp de Sebastián, enviar ese mensaje al número de Twilio
4. Recibirás confirmación: "You are all set!"

### 5. Configurar Teléfonos de Clientes

Para cada cliente que quieras que reciba WhatsApp:

1. Ir al Panel de Admin
2. Hacer clic en el botón **📱** del cliente
3. Ingresar su número (ejemplo: `3467494443`)
4. Guardar

**IMPORTANTE**: Cada cliente también debe unirse al Sandbox enviando `join abc-def` desde su WhatsApp.

### 6. Reiniciar el Servidor

```bash
npm run dev
```

---

## ✅ Probar que Funciona

1. Ir al panel de admin
2. Cargar saldo a un cliente que tenga teléfono configurado
3. Verificar que llegue el WhatsApp

---

## 🔧 Si No Funciona

### Verificar en la Consola del Navegador

Abrir DevTools (F12) y buscar mensajes como:
- ✅ `Mensaje de WhatsApp enviado: SMxxxx`
- ❌ `Twilio no está configurado`
- ❌ `Error al enviar mensaje`

### Verificar Variables de Entorno

En la terminal donde corre el servidor, verificar que las variables estén cargadas:

```bash
echo $TWILIO_ACCOUNT_SID
```

Si no muestra nada, las variables no están configuradas.

---

## 💰 Costos

- **Sandbox (Gratis)**: Para pruebas
  - Limitación: Solo números que se unan al sandbox
  - Mensaje de "trial account" en cada WhatsApp
  
- **Producción**: ~$15 USD/mes
  - Sin limitaciones
  - Sin mensaje de "trial"

---

## 📱 Formato de Números

El sistema acepta cualquier formato:
- `3467494443`
- `+54 9 3467 49 4443`
- `(3467) 494443`

Se formatea automáticamente a: `whatsapp:+5493467494443`

---

## 🎯 Resumen

1. ✅ Crear cuenta Twilio
2. ✅ Copiar credenciales (SID, Token, Número)
3. ✅ Pegar en `.env.local`
4. ✅ Unir WhatsApp de Sebastián al Sandbox
5. ✅ Configurar teléfonos de clientes
6. ✅ Reiniciar servidor
7. ✅ Probar cargando saldo

**Tiempo total**: ~5 minutos

---

¿Necesitas ayuda? Los mensajes de error aparecen en la consola del navegador (F12).
