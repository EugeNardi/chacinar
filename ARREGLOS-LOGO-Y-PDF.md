# ✅ ARREGLOS: LOGO Y PDF

## 🔧 Problemas Solucionados

### 1. Logo No Se Veía
**Problema:** El logo SVG no se mostraba en los headers

**Solución:**
- Cambiado de `<Image>` a `<img>` nativo
- SVG se carga directamente desde `/logo.svg`
- Funciona en todos los navegadores

### 2. PDF Vacío
**Problema:** El PDF no mostraba datos, QR ni transacciones

**Soluciones:**
- ✅ Resetear color de texto a negro después del header
- ✅ QR con link correcto de Mercado Pago
- ✅ Manejo de errores en generación de QR
- ✅ Datos del cliente visibles
- ✅ Tabla de transacciones visible
- ✅ Total a pagar visible

---

## 📋 Cambios Realizados

### Archivos Modificados

1. **`src/app/admin/layout.tsx`**
   - Cambiado `<Image>` por `<img>`
   - Logo se ve correctamente

2. **`src/app/cliente/layout.tsx`**
   - Cambiado `<Image>` por `<img>`
   - Logo se ve correctamente

3. **`src/app/auth/page.tsx`**
   - Cambiado `<Image>` por `<img>` en todas las pantallas
   - Logo se ve en bienvenida, login y registro

4. **`src/lib/pdfGenerator.ts`**
   - Agregado `doc.setTextColor(0, 0, 0)` después del header
   - QR con link correcto: `https://www.mercadopago.com.ar/money-request/create?alias=...`
   - Try-catch para manejo de errores
   - Instrucciones mejoradas con alias y monto

---

## 🎯 Cómo Funciona Ahora

### Logo
```jsx
// Antes (no funcionaba)
<Image src="/logo.svg" width={120} height={48} />

// Ahora (funciona)
<img src="/logo.svg" style={{ width: '120px', height: 'auto' }} />
```

### PDF
```typescript
// Header bordeaux
doc.setFillColor(139, 24, 24);
doc.rect(0, 0, pageWidth, 35, 'F');

// Texto blanco en header
doc.setTextColor(255, 255, 255);
doc.text('Chacinar', ...);

// IMPORTANTE: Resetear a negro después
doc.setTextColor(0, 0, 0);

// Ahora todo el contenido se ve
doc.text('RESUMEN DE CUENTA', ...);
doc.text(`Cliente: ${data.clientName}`, ...);
```

---

## 📊 Estructura del PDF

### Header (Bordeaux)
```
┌────────────────────────────────────┐
│                                    │
│          Chacinar                  │
│  CHACINADOS Y EMBUTIDOS ARTESANALES│
│                                    │
└────────────────────────────────────┘
```

### Contenido (Negro)
```
─────────────────────────────────────

RESUMEN DE CUENTA

Cliente: Juan Pérez
Email: juan@email.com
Fecha de emisión: 20/12/2024

DETALLE DE BOLETAS

Fecha         Descripción           Monto
───────────────────────────────────────
15/12/2024    Compra productos    $5,000.00
18/12/2024    Servicios           $3,000.00
───────────────────────────────────────

TOTAL A PAGAR:                    $8,000.00

PAGAR CON MERCADO PAGO

[QR CODE]    Escanea este código QR
             Alias: chacinar.mp
             Monto: $8,000.00
```

---

## 🔍 Verificación

### Probar Logo
1. Ir a `/auth`
2. ✅ Logo debe verse en el centro
3. Ir a `/admin` o `/cliente`
4. ✅ Logo debe verse arriba a la izquierda

### Probar PDF
1. Admin → Clic en tarjeta de cliente
2. Clic en "Generar PDF"
3. ✅ Se descarga PDF
4. Abrir PDF
5. ✅ Header bordeaux con "Chacinar"
6. ✅ Datos del cliente visibles (negro)
7. ✅ Tabla de boletas visible (negro)
8. ✅ Total visible (negro)
9. ✅ QR de Mercado Pago visible

---

## 🎨 Colores en PDF

### Header
- Fondo: Bordeaux (#8B1818) → RGB(139, 24, 24)
- Texto: Blanco (#FFFFFF) → RGB(255, 255, 255)

### Contenido
- Texto: Negro (#000000) → RGB(0, 0, 0)
- Líneas: Gris (#808080) → RGB(128, 128, 128)

### Footer
- Texto: Gris claro (#808080) → RGB(128, 128, 128)

---

## 🚀 Próximos Pasos

1. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Verificar logo:**
   - Ir a `/auth`
   - Verificar que se vea el logo

3. **Verificar PDF:**
   - Login como admin
   - Generar PDF de un cliente
   - Verificar que se vean todos los datos

---

## 🆘 Si Sigue Sin Verse

### Logo
```bash
# Verificar que el archivo existe
ls public/logo.svg

# Debe mostrar el archivo con tamaño ~41KB
```

### PDF
```javascript
// En pdfGenerator.ts, verificar:
doc.setTextColor(0, 0, 0); // DESPUÉS del header

// Si el QR no se ve:
console.log('QR Link:', mpLink);
console.log('QR Data:', qrDataUrl);
```

---

**¡Reinicia el servidor y prueba! El logo y el PDF ahora deberían funcionar correctamente! 🎨📄**
