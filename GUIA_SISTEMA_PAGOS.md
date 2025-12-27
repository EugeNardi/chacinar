# 📘 Guía Completa del Sistema de Pagos - Chacinar

## 🎯 Resumen Ejecutivo

Sistema profesional de gestión de cuentas corrientes con integración de MercadoPago para una empresa real. Permite a los clientes ver su saldo, realizar pagos y notificarlos, mientras que los administradores gestionan las aprobaciones y el historial completo.

---

## 📋 Tabla de Contenidos

1. [Para Clientes](#para-clientes)
2. [Para Administradores](#para-administradores)
3. [Flujo Técnico](#flujo-técnico)
4. [Configuración Inicial](#configuración-inicial)

---

## 👤 PARA CLIENTES

### 1. Acceso al Sistema

1. Ingresar a la plataforma con tu cuenta
2. Serás redirigido automáticamente a tu dashboard

### 2. Ver tu Saldo

Tu saldo actual se muestra de forma destacada en la parte superior del dashboard:
- **Saldo > 0**: Tienes deuda pendiente
- **Saldo = 0**: Estás al día

### 3. Realizar un Pago con MercadoPago

#### Opción A: Escanear Código QR (Recomendado)

1. **Ver el QR**: En la sección "💳 Opciones de Pago" verás un código QR
2. **Abrir MercadoPago**: Abre la app de MercadoPago en tu celular
3. **Escanear**: Usa la función de escanear QR de la app
4. **Verificar datos**:
   - ✅ Alias destino: Correcto
   - ✅ Monto: Tu saldo exacto
   - ✅ Descripción: "Pago Chacinar - [Tu Nombre]"
5. **Confirmar**: Completa el pago en MercadoPago

#### Opción B: Botón "Abrir en Mercado Pago"

1. **Hacer clic** en el botón azul "Abrir en Mercado Pago"
2. Se abrirá MercadoPago con los datos precargados
3. **Verificar** que el monto y alias sean correctos
4. **Confirmar** el pago

#### Opción C: Transferencia Manual

Si el QR o botón no funcionan:

1. **Copiar el alias**: Hacer clic en el botón de copiar junto al alias
2. **Abrir MercadoPago**: Ir a la app
3. **Transferir**:
   - Seleccionar "Transferir" o "Enviar dinero"
   - Pegar el alias copiado
   - Ingresar el monto exacto de tu saldo
   - Confirmar la transferencia

### 4. Notificar tu Pago (IMPORTANTE)

**Después de realizar el pago, DEBES notificarlo:**

1. **Hacer clic** en el botón verde "💰 Notificar Pago Realizado"
2. **Completar el formulario**:
   - Tipo: Pago (ya seleccionado)
   - Monto: Cantidad exacta que pagaste
   - Descripción (opcional): Detalles adicionales
3. **Enviar**: Hacer clic en "Enviar solicitud"

### 5. Enviar Comprobante por WhatsApp (Opcional)

Para agilizar la aprobación, puedes enviar el comprobante:

1. **Tomar captura** del comprobante de MercadoPago
2. **Hacer clic** en el botón de WhatsApp (Sebastián o Claudia)
3. **Adjuntar** la captura del comprobante
4. **Enviar** el mensaje

### 6. Esperar Aprobación

- Recibirás una **notificación** cuando tu pago sea aprobado
- Tu saldo se actualizará automáticamente
- Podrás ver el movimiento en tu historial

### 7. Ver tu Historial

En la sección "Historial de Movimientos" verás:
- Todos tus cargos y pagos aprobados
- **Saldo anterior**: Tu saldo antes de cada movimiento
- **Saldo después**: Tu saldo después de cada movimiento
- Fecha y hora de cada transacción
- Descripción de cada movimiento

---

## 👨‍💼 PARA ADMINISTRADORES

### 1. Configuración Inicial de MercadoPago

**IMPORTANTE**: Antes de que los clientes puedan pagar, debes configurar el alias.

#### Configurar Alias por Cliente:

1. **Ir al Panel de Administrador**
2. **Localizar al cliente** en la lista
3. **Hacer clic** en el botón 🪙 (Wallet) del cliente
4. **Ingresar el alias o CVU**:
   - **Alias**: 6-20 caracteres (ej: `chacinar.mp`)
   - **CVU**: 22 dígitos exactos
5. **Guardar**

#### Validaciones:
- ✅ Alias válido: Solo letras, números, puntos y guiones
- ✅ CVU válido: Exactamente 22 dígitos

### 2. Aprobar Solicitudes de Pago

Cuando un cliente notifica un pago:

1. **Ver solicitud** en "Solicitudes Pendientes"
2. **Verificar información**:
   - Nombre del cliente
   - Tipo: Pago
   - Monto solicitado
   - Descripción (si la hay)
3. **Verificar en MercadoPago** que el pago fue recibido
4. **Hacer clic en "Aprobar"**

#### ¿Qué sucede al aprobar?

El sistema automáticamente:
1. ✅ Registra el saldo anterior del cliente
2. ✅ Calcula el nuevo saldo (saldo - monto pagado)
3. ✅ Actualiza el saldo en la cuenta
4. ✅ Crea una transacción con historial completo
5. ✅ Envía notificación al cliente con:
   - Monto del pago
   - Saldo anterior
   - Saldo actual
   - Mensaje de agradecimiento

### 3. Rechazar Solicitudes

Si el pago no fue recibido o hay un error:

1. **Hacer clic en "Rechazar"**
2. La solicitud se marca como rechazada
3. El saldo del cliente NO se modifica

### 4. Cargar Saldo (Crear Cargo)

Para agregar deuda a un cliente:

1. **Hacer clic** en el botón ➕ del cliente
2. **Ingresar**:
   - Monto del cargo
   - Descripción (ej: "Boleta del 15/12/2024")
3. **Confirmar**

El sistema:
- Registra saldo anterior y posterior
- Crea transacción aprobada automáticamente
- Genera comprobante PDF
- Notifica al cliente

### 5. Crear Nueva Boleta

Para crear una boleta con fecha específica:

1. **Hacer clic** en "Nueva Boleta"
2. **Seleccionar cliente**
3. **Ingresar**:
   - Fecha de la boleta
   - Monto
   - Descripción
4. **Crear Boleta**

### 6. Ver Historial

#### Historial Individual:
1. **Hacer clic** en la tarjeta del cliente
2. Ver todas sus transacciones con saldos antes/después

#### Historial Global:
1. **Hacer clic** en "Historial Global"
2. Ver todas las transacciones de todos los clientes
3. Ver totales de cargos y pagos

### 7. Generar PDF

Para cada cliente puedes generar un PDF con:
- Todas sus boletas
- Saldo total
- Código QR de MercadoPago
- Datos bancarios (si están configurados)

**Hacer clic** en el botón 📄 del cliente

---

## 🔧 FLUJO TÉCNICO

### Arquitectura del Sistema

```
Cliente → Dashboard → MercadoPago QR Component
                   ↓
              Realiza Pago
                   ↓
         Notifica en Sistema
                   ↓
    Crea modification_request (pendiente)
                   ↓
         Admin ve solicitud
                   ↓
            Aprueba/Rechaza
                   ↓
    Si aprueba → Actualiza saldo + Crea transaction + Notifica cliente
```

### Base de Datos

#### Tabla: `accounts`
```sql
- id: UUID
- user_id: UUID (FK a users)
- balance: DECIMAL (saldo actual)
- mercadopago_wallet: TEXT (alias o CVU)
```

#### Tabla: `transactions`
```sql
- id: UUID
- account_id: UUID (FK a accounts)
- type: 'cargo' | 'pago'
- amount: DECIMAL
- description: TEXT
- status: 'aprobado' | 'pendiente' | 'rechazado'
- balance_before: DECIMAL (saldo antes de la transacción)
- balance_after: DECIMAL (saldo después de la transacción)
- created_at: TIMESTAMP
- approved_at: TIMESTAMP
- created_by: UUID
- approved_by: UUID
```

#### Tabla: `modification_requests`
```sql
- id: UUID
- account_id: UUID
- type: 'cargo' | 'pago'
- amount: DECIMAL
- description: TEXT
- status: 'pendiente' | 'aprobado' | 'rechazado'
- requested_by: UUID
- reviewed_by: UUID
- created_at: TIMESTAMP
- reviewed_at: TIMESTAMP
```

### Generación del Link de MercadoPago

**Archivo**: `src/lib/mercadoPagoQR.ts`

```typescript
function generateMercadoPagoQR(alias: string, amount: number, description: string): string {
  const baseUrl = 'https://www.mercadopago.com.ar/money-request/create';
  const params = new URLSearchParams({
    alias: alias,
    amount: amount.toString(),
    description: description
  });
  return `${baseUrl}?${params.toString()}`;
}
```

**URL generada**:
```
https://www.mercadopago.com.ar/money-request/create?alias=ALIAS&amount=MONTO&description=DESCRIPCION
```

### Componente MercadoPagoQR

**Ubicación**: `src/components/MercadoPagoQR.tsx`

**Props**:
- `wallet`: Alias o CVU de MercadoPago
- `amount`: Monto del saldo
- `clientName`: Nombre del cliente

**Funcionalidad**:
1. Genera link de MercadoPago con datos precargados
2. Muestra código QR con el link
3. Botón para abrir MercadoPago directamente
4. Botón para copiar alias
5. Instrucciones claras de uso

---

## ⚙️ CONFIGURACIÓN INICIAL

### 1. Variables de Entorno

No se requieren variables adicionales para MercadoPago (solo transferencias P2P).

### 2. Configurar Alias de MercadoPago

**Para cada cliente**:
1. Obtener alias o CVU de la cuenta de MercadoPago de la empresa
2. Ir al panel de admin
3. Configurar el alias en cada cliente

**Recomendación**: Usar el mismo alias para todos los clientes para simplificar la gestión.

### 3. Configurar Métodos de Pago Globales (Opcional)

Para incluir en los PDFs:

1. **Hacer clic** en "Configurar Métodos de Pago"
2. **Ingresar**:
   - Alias de MercadoPago
   - Nombre del banco
   - Número de cuenta
   - CBU
3. **Guardar**

Estos datos aparecerán en los PDFs generados.

---

## 📊 Reportes y Estadísticas

### Dashboard de Administrador

**Métricas disponibles**:
- Total de clientes
- Deuda total acumulada
- Solicitudes pendientes de aprobación

### Historial Global

**Información disponible**:
- Total de transacciones
- Total de cargos
- Total de pagos
- Deuda total actual
- Detalle de cada transacción con cliente

---

## 🔐 Seguridad

### Validaciones Implementadas

1. **Autenticación**: Solo usuarios autenticados pueden acceder
2. **Roles**: Clientes solo ven su información, admins ven todo
3. **Validación de montos**: Solo números positivos
4. **Validación de alias**: Formato correcto de MercadoPago
5. **Transacciones atómicas**: Saldo se actualiza correctamente

### Registro de Auditoría

Cada transacción registra:
- Quién la creó (`created_by`)
- Quién la aprobó (`approved_by`)
- Cuándo fue creada (`created_at`)
- Cuándo fue aprobada (`approved_at`)
- Saldo antes y después

---

## ❓ Preguntas Frecuentes

### Para Clientes

**P: ¿Por qué no funciona el QR?**
R: MercadoPago no permite QR dinámicos para transferencias P2P. Usa el botón "Abrir en Mercado Pago" o copia el alias manualmente.

**P: ¿Cuánto tarda en aprobarse mi pago?**
R: Depende de la disponibilidad del administrador. Envía el comprobante por WhatsApp para agilizar.

**P: ¿Puedo pagar un monto parcial?**
R: Sí, notifica el monto exacto que pagaste y el administrador lo aprobará.

**P: ¿Dónde veo mi historial?**
R: En tu dashboard, sección "Historial de Movimientos".

### Para Administradores

**P: ¿Qué pasa si apruebo un pago por error?**
R: Deberás crear un cargo manual por el mismo monto para revertirlo.

**P: ¿Puedo usar diferentes alias para cada cliente?**
R: Sí, pero es más complejo de gestionar. Recomendamos usar el mismo alias para todos.

**P: ¿Cómo sé si un pago fue realmente recibido?**
R: Verifica en tu cuenta de MercadoPago antes de aprobar.

---

## 🆘 Soporte

Para problemas técnicos o consultas:
- **Email**: [Tu email de soporte]
- **WhatsApp**: +54 9 3467 49 4443 (Sebastián) o +54 9 3467 44 1282 (Claudia)

---

## 📝 Notas Técnicas

### Limitaciones de MercadoPago

MercadoPago **NO permite**:
- Links dinámicos para transferencias P2P con alias y monto
- QR codes que abran directamente la app con datos precargados

**Solución implementada**:
- QR con link que intenta abrir MercadoPago (puede fallar)
- Botón directo para abrir el link
- Instrucciones claras para transferencia manual
- Botón para copiar alias fácilmente

### Mejoras Futuras Sugeridas

1. **Integración con API de MercadoPago**: Para detectar pagos automáticamente
2. **Webhooks**: Para notificaciones en tiempo real
3. **Recordatorios automáticos**: Para clientes con saldo pendiente
4. **Exportación de reportes**: Excel, CSV
5. **Dashboard de métricas**: Gráficos de evolución

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2024  
**Sistema**: Chacinar - Gestión de Cuentas Corrientes
