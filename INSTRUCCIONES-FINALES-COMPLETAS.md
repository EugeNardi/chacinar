# 🎯 INSTRUCCIONES FINALES COMPLETAS

## 🚨 PASO 1: Arreglar Rol de Administrador

### Problema
Tu cuenta de admin te redirige al panel de cliente.

### Solución

1. **Ve a Supabase SQL Editor:**
   https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new

2. **Abre el archivo `ARREGLAR-ROL-ADMIN.sql`**

3. **Reemplaza `TU_EMAIL_ADMIN@DOMINIO.COM` con tu email real**
   
   Por ejemplo, si tu email es `sebastian@gmail.com`:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'sebastian@gmail.com';
   ```

4. **Ejecuta el SQL completo**

5. **Cierra sesión y vuelve a iniciar sesión**

6. **Si sigue yendo a cliente:**
   - Presiona F12 (abrir consola)
   - Ve a Application → Local Storage
   - Elimina todo
   - Recarga la página (F5)
   - Inicia sesión de nuevo

---

## 📦 PASO 2: Instalar Librerías para PDF

```bash
npm install jspdf qrcode
npm install --save-dev @types/qrcode
```

---

## 🚀 PASO 3: Reiniciar Servidor

```bash
npm run dev
```

---

## ✅ PASO 4: Probar el Sistema

### Como Administrador

1. **Iniciar sesión**
   - Ve a http://localhost:3000
   - Login con tu cuenta de admin
   - Deberías ir al panel de administrador

2. **Ver todos los clientes**
   - Verás TODOS los clientes registrados
   - Cada cliente tiene 3 botones:
     - **+** (Plus) = Cargar saldo
     - **💳** (Wallet) = Configurar Mercado Pago
     - **📄** (FileText) = Generar PDF

3. **Crear Nueva Boleta**
   - Clic en "Nueva Boleta" (arriba a la derecha)
   - Selecciona cliente
   - Fecha: 19/12/2024
   - Monto: 5000
   - Descripción: "Compra de productos"
   - Clic en "Crear Boleta"

4. **Generar PDF con QR**
   - Busca al cliente
   - Clic en el botón 📄 (PDF)
   - Se descargará un PDF con:
     - Encabezado de Chacinar
     - Datos del cliente
     - Tabla con todas las boletas
     - Total a pagar
     - **Código QR de Mercado Pago**
     - Instrucciones de pago

---

## 📄 Contenido del PDF

El PDF incluye:

```
┌─────────────────────────────────────┐
│         CHACINAR                     │
│  Chacinados y Embutidos Artesanales │
├─────────────────────────────────────┤
│                                      │
│  RESUMEN DE CUENTA                  │
│  Cliente: Juan Pérez                │
│  Email: juan@email.com              │
│  Fecha: 19/12/2024                  │
│                                      │
│  DETALLE DE BOLETAS                 │
│  ┌──────┬────────────┬────────┐    │
│  │Fecha │Descripción │ Monto  │    │
│  ├──────┼────────────┼────────┤    │
│  │19/12 │Compra...   │$5,000  │    │
│  │18/12 │Pedido...   │$3,000  │    │
│  └──────┴────────────┴────────┘    │
│                                      │
│  TOTAL A PAGAR:        $8,000       │
│                                      │
│  PAGAR CON MERCADO PAGO             │
│  ┌─────────┐                        │
│  │  [QR]   │ Escanea con MP         │
│  │  CODE   │ o ingresa a:           │
│  └─────────┘ tu.alias.mp            │
│                                      │
└─────────────────────────────────────┘
```

---

## 💳 PASO 5: Configurar Mercado Pago

### Para Cada Cliente

1. **Busca al cliente**
2. **Clic en el botón 💳 (Wallet)**
3. **Ingresa tu alias o CVU de Mercado Pago**
   - Ejemplo: `chacinar.pagos`
   - O tu CVU de 22 dígitos
4. **Guardar**

### Cuenta Única para Todos

Si quieres que TODOS los clientes paguen a la misma cuenta:

1. Configura el mismo alias/CVU para cada cliente
2. O crea una configuración global (te lo puedo implementar)

---

## 🔄 Flujo Completo

### Escenario: Cliente compra $5,000

```
1. Admin crea boleta
   ├─ Selecciona cliente
   ├─ Fecha: 19/12/2024
   ├─ Monto: $5,000
   └─ Descripción: "Compra de productos"

2. Admin genera PDF
   ├─ Clic en botón 📄
   └─ Se descarga PDF con QR

3. Admin envía PDF al cliente
   ├─ Por email
   ├─ Por WhatsApp
   └─ O impreso

4. Cliente escanea QR
   ├─ Abre Mercado Pago
   ├─ Escanea el QR del PDF
   └─ Paga $5,000

5. Admin confirma pago
   ├─ Ve el pago en Mercado Pago
   ├─ Carga -$5,000 (descuenta)
   └─ Cliente queda en $0
```

---

## 🎯 Características del PDF

### ✅ Incluye

- Logo y nombre de Chacinar
- Datos completos del cliente
- Tabla con TODAS las boletas pendientes
- Total a pagar (suma de todas las boletas)
- **Código QR de Mercado Pago**
- Alias/CVU para pago manual
- Instrucciones paso a paso
- Footer profesional

### 📱 El QR Funciona

- Se puede escanear con la app de Mercado Pago
- Abre directamente el pago
- Con el monto pre-cargado
- Listo para confirmar

---

## 🔧 Configuración Avanzada

### Cuenta de Mercado Pago Única

Si quieres que TODOS los clientes paguen a UNA sola cuenta:

**Opción 1: Manual**
- Configura el mismo alias para cada cliente

**Opción 2: Global (te lo implemento)**
- Una configuración global en el sistema
- Todos los PDFs usan la misma cuenta automáticamente

### Múltiples Admins

Si tienes 2 cuentas de admin:

1. Ejecuta el SQL para cada una:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin1@chacinar.com';
   UPDATE users SET role = 'admin' WHERE email = 'admin2@chacinar.com';
   ```

2. Ambos verán TODOS los clientes
3. Ambos pueden crear boletas y PDFs

---

## 📊 Panel Admin Completo

### Estadísticas
- Total de clientes
- Deuda total
- Solicitudes pendientes

### Acciones por Cliente
- ✅ **Cargar saldo** (botón +)
- ✅ **Configurar Mercado Pago** (botón 💳)
- ✅ **Generar PDF** (botón 📄)

### Nueva Boleta
- ✅ Selector de cliente
- ✅ Fecha personalizable
- ✅ Monto y descripción
- ✅ Vista previa del saldo

### Buscador
- ✅ Por nombre
- ✅ Por email
- ✅ Filtrado en tiempo real

---

## 🆘 Solución de Problemas

### No se genera el PDF

1. Verifica que instalaste las librerías:
   ```bash
   npm install jspdf qrcode
   ```

2. Reinicia el servidor:
   ```bash
   npm run dev
   ```

### El QR no funciona

1. Verifica que configuraste el alias/CVU de Mercado Pago
2. Verifica que el alias sea correcto
3. Prueba escaneando con la app de Mercado Pago

### Sigo yendo al panel de cliente

1. Ejecuta `ARREGLAR-ROL-ADMIN.sql`
2. Limpia Local Storage (F12 → Application)
3. Cierra sesión y vuelve a entrar

---

## 📋 Resumen de Archivos

1. **`ARREGLAR-ROL-ADMIN.sql`** - Arregla el rol de admin
2. **`src/lib/pdfGenerator.ts`** - Genera PDFs con QR
3. **`src/app/admin/page.tsx`** - Panel admin con botón PDF
4. **`package.json`** - Dependencias actualizadas

---

## 🎉 ¡Todo Listo!

Ahora tienes:
- ✅ Login separado admin/cliente
- ✅ Sistema de boletas con fecha y descripción
- ✅ Generación de PDF profesional
- ✅ Código QR de Mercado Pago en el PDF
- ✅ Panel admin completo
- ✅ Todos los clientes visibles

---

**¡Ejecuta los pasos y prueba el sistema! 🚀**

Cuando tengas la cuenta de Mercado Pago, configúrala en cada cliente y genera un PDF de prueba.
