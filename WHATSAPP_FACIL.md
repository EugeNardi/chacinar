# 📱 WhatsApp SÚPER FÁCIL - 2 Pasos

## ✅ Configuración en 2 Minutos

### Paso 1: Obtener tu API Key (1 minuto)

1. **Desde el WhatsApp de Sebastián** (+54 9 3467 49 4443), enviar este mensaje:

```
Quiero mi código API
```

2. **Enviarlo a este número de WhatsApp**:
   ```
   +34 644 44 96 42
   ```

3. **Recibirás una respuesta** con tu API Key (algo como: `123456`)

---

### Paso 2: Configurar en el Proyecto (1 minuto)

1. **Abrir el archivo**: `.env.local`

2. **Agregar estas 2 líneas al final**:
   ```env
   CALLMEBOT_API_KEY=tu_api_key_aqui
   SEBASTIAN_PHONE=5493467494443
   ```

3. **Reemplazar** `tu_api_key_aqui` con el código que recibiste

4. **Guardar** el archivo

5. **Reiniciar el servidor**:
   ```bash
   npm run dev
   ```

---

## ✅ ¡Listo! Ya Funciona

Ahora cuando cargues saldo o apruebes un pago, **Sebastián recibirá un WhatsApp automático** con:
- Nombre del cliente
- Monto del cargo/pago
- Saldo total actualizado

---

## 📱 Ejemplo de Mensaje que Recibirá Sebastián

```
🔔 Chacinar - Nuevo Cargo

Cliente: Juan Pérez
💰 Cargo: $5,000.00
📝 Compra del día
📊 Saldo total: $31,000.00
```

O cuando se aprueba un pago:

```
✅ Chacinar - Pago Aprobado

Cliente: Juan Pérez
💚 Pago: $2,000.00
📊 Nuevo saldo: $29,000.00
```

---

## 🆓 Ventajas de CallMeBot

- ✅ **100% Gratis** - Sin costo mensual
- ✅ **Sin límites** - Mensajes ilimitados
- ✅ **Súper fácil** - Solo 2 pasos
- ✅ **Sin registros** - No necesitas cuenta
- ✅ **Funciona ya** - Sin esperas ni aprobaciones

---

## ❓ Preguntas Frecuentes

### ¿Por qué solo Sebastián recibe los mensajes?

Porque es el administrador y necesita estar al tanto de todos los movimientos. Los clientes ven su información en el panel web.

### ¿Puedo cambiar el número?

Sí, solo cambia `SEBASTIAN_PHONE` en `.env.local` por el número que quieras.

### ¿Funciona en producción (Netlify)?

Sí, solo agrega las mismas variables de entorno en Netlify:
1. Ir a: Site settings → Environment variables
2. Agregar `CALLMEBOT_API_KEY` y `SEBASTIAN_PHONE`

---

## 🔧 Verificar que Funciona

1. Ir al panel de admin
2. Cargar saldo a cualquier cliente
3. Sebastián debería recibir el WhatsApp en segundos

Si no llega, revisar la consola del navegador (F12) para ver errores.

---

**¡Eso es todo!** Mucho más fácil que Twilio 🎉
