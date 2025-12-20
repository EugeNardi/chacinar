# 🎉 Sistema Completo de Chacinar

## ✅ Funcionalidades Implementadas

### 👨‍💼 Panel de Administrador
1. **Buscador de clientes** por nombre o email
2. **Cargar saldo** a cualquier cliente
3. **Configurar billetera de Mercado Pago** para cada cliente
4. **Gestionar solicitudes** (aprobar/rechazar)
5. **Ver estadísticas** generales

### 👤 Panel de Cliente
1. **Ver perfil** completo con datos
2. **Ver saldo** actual (solo lectura)
3. **QR de Mercado Pago** para pagar el saldo
4. **Historial de transacciones** con fechas
5. **Solicitar modificaciones** (solo solicitudes, no puede modificar directamente)

---

## 📋 Pasos para Configurar

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará la nueva librería `qrcode.react` para generar códigos QR.

### 2. Actualizar Base de Datos

**Opción A: Si ya tienes la base de datos creada**

Ejecuta el archivo `AGREGAR-MERCADOPAGO.sql` en Supabase SQL Editor:
```sql
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS mercadopago_wallet TEXT;
```

**Opción B: Si estás creando la base de datos desde cero**

Ejecuta el archivo `SETUP-COMPLETO-FINAL.sql` (ya incluye el campo de Mercado Pago).

### 3. Crear Usuarios

1. Ve a Supabase Authentication
2. Crea usuarios con "Auto Confirm User" marcado
3. Ejecuta el SQL para vincularlos

---

## 🚀 Cómo Usar el Sistema

### Como Administrador

#### 1. Configurar Mercado Pago para un Cliente

1. Inicia sesión como admin
2. Busca al cliente en la lista
3. Haz clic en el botón con icono de billetera (💳)
4. Ingresa el **alias o CVU** de Mercado Pago
5. Guarda

**Ejemplo de alias:** `chacinar.pagos` o `tu.alias.mp`

#### 2. Cargar Saldo a un Cliente

1. Busca al cliente
2. Haz clic en "Cargar"
3. Ingresa el monto (ejemplo: 5000.50)
4. Verás el saldo actual y el nuevo saldo
5. Confirma

**Esto creará:**
- ✅ Una transacción de tipo "cargo"
- ✅ Actualización automática del saldo
- ✅ Registro en el historial

### Como Cliente

#### 1. Ver Saldo

- El saldo se muestra en grande en la tarjeta principal
- Solo puedes **verlo**, no modificarlo

#### 2. Pagar con Mercado Pago

**Si tienes saldo pendiente:**

1. Verás una tarjeta con un **código QR**
2. Abre la app de Mercado Pago
3. Escanea el código QR
4. Verifica que el monto sea correcto
5. Confirma el pago

**El QR incluye:**
- ✅ Billetera del destinatario
- ✅ Monto exacto de tu saldo
- ✅ Descripción del pago

**Después del pago:**
- Avisa al administrador
- El admin confirmará y actualizará tu saldo

#### 3. Solicitar Modificaciones

- Puedes solicitar cargos o pagos
- El admin debe aprobarlas
- **No puedes modificar tu saldo directamente**

---

## 🔐 Permisos y Restricciones

### Cliente PUEDE:
- ✅ Ver su saldo
- ✅ Ver su historial
- ✅ Solicitar modificaciones
- ✅ Ver QR para pagar
- ❌ **NO puede modificar su saldo**

### Admin PUEDE:
- ✅ Ver todos los clientes
- ✅ Cargar saldo a cualquier cliente
- ✅ Configurar Mercado Pago
- ✅ Aprobar/rechazar solicitudes
- ✅ Ver todas las transacciones

---

## 💡 Flujo de Pago Completo

### Escenario: Cliente debe $10,000

1. **Cliente ve su saldo:** $10,000
2. **Cliente ve el QR** de Mercado Pago
3. **Cliente escanea** el QR con su app
4. **Cliente paga** los $10,000
5. **Cliente avisa** al administrador
6. **Admin verifica** el pago en Mercado Pago
7. **Admin carga** -$10,000 (o el monto pagado)
8. **Saldo del cliente** se actualiza a $0

---

## 🎨 Características del QR

- **Tamaño:** 200x200px, fácil de escanear
- **Nivel de corrección:** Alto (H)
- **Incluye:**
  - Link directo a Mercado Pago
  - Monto pre-cargado
  - Descripción del pago
  - Nombre del cliente

- **Botón de copiar** la billetera manualmente
- **Instrucciones** paso a paso
- **Mensaje** si no hay billetera configurada

---

## 🔧 Configuración de Mercado Pago

### Qué necesitas:

1. **Alias de Mercado Pago** (ejemplo: `chacinar.pagos`)
   - O **CVU** (22 dígitos)

2. **Configurarlo en cada cliente:**
   - Cada cliente puede tener una billetera diferente
   - O todos pueden usar la misma billetera de la empresa

### Dónde encontrar tu alias/CVU:

1. Abre Mercado Pago
2. Ve a "Tu dinero" o "CVU"
3. Copia tu **alias** (más fácil) o **CVU**
4. Pégalo en el modal de configuración

---

## 📊 Ejemplo de Uso Real

### Caso 1: Cliente nuevo con compra

```
1. Admin crea cliente en el sistema
2. Cliente compra por $5,000
3. Admin carga $5,000 al cliente
4. Cliente ve su saldo: $5,000
5. Cliente ve el QR y paga
6. Admin confirma y descuenta el pago
```

### Caso 2: Cliente con cuenta corriente

```
1. Cliente tiene saldo: $15,000
2. Cliente hace nueva compra: $3,000
3. Admin carga $3,000
4. Nuevo saldo: $18,000
5. Cliente paga $10,000 por Mercado Pago
6. Admin descuenta: Saldo = $8,000
```

---

## ⚠️ Notas Importantes

1. **El QR solo aparece si el cliente tiene saldo > 0**
2. **El cliente NO puede modificar su saldo directamente**
3. **Solo el admin puede cargar/descargar saldo**
4. **El pago por Mercado Pago NO es automático** (requiere confirmación del admin)
5. **Configura la billetera de Mercado Pago antes de que el cliente intente pagar**

---

## 🆘 Solución de Problemas

### No aparece el QR

- Verifica que el cliente tenga saldo > 0
- Verifica que el admin haya configurado la billetera de Mercado Pago

### El QR no funciona

- Verifica que el alias/CVU sea correcto
- Prueba copiando la billetera manualmente

### El cliente no puede modificar su saldo

- ✅ **Esto es correcto!** Solo el admin puede hacerlo
- El cliente solo puede solicitar modificaciones

---

**¡El sistema está completo y listo para usar! 🚀**
