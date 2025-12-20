# 🎨 RECORTAR BORDE BLANCO DEL LOGO

## Problema
El logo tiene demasiado borde blanco alrededor, lo que hace que se vea más pequeño de lo que debería.

## Solución: Recortar la Imagen

### Opción 1: Usar Paint (Windows)

1. **Abrir la imagen:**
   - Clic derecho en `public/logo.png`
   - "Abrir con" → "Paint"

2. **Seleccionar el área útil:**
   - Clic en "Seleccionar"
   - Dibujar un rectángulo alrededor del logo (sin incluir el borde blanco)
   - Asegúrate de incluir:
     - El cerdo rojo
     - El texto "Chacinar"
     - El subtítulo
     - Las líneas decorativas

3. **Recortar:**
   - Clic en "Recortar" (o Ctrl + Shift + X)

4. **Guardar:**
   - Archivo → Guardar como → PNG
   - Guardar en: `public/logo.png` (reemplazar)

---

### Opción 2: Usar Editor Online

1. **Ir a:** https://www.remove.bg/es/upload
   - O usar: https://www.iloveimg.com/es/recortar-imagen

2. **Subir** `public/logo.png`

3. **Recortar** el borde blanco

4. **Descargar** y guardar como `public/logo.png`

---

### Opción 3: Usar Photoshop/GIMP

1. Abrir `public/logo.png`
2. Imagen → Recortar
3. Ajustar los márgenes para eliminar el borde blanco
4. Guardar como PNG

---

## ✅ Resultado Esperado

### Antes (con borde blanco)
```
┌────────────────────────────────┐
│                                │
│                                │
│    ┌──────────────────┐        │
│    │  [LOGO CHACINAR] │        │
│    └──────────────────┘        │
│                                │
│                                │
└────────────────────────────────┘
   Mucho espacio desperdiciado
```

### Después (sin borde blanco)
```
┌──────────────────┐
│  [LOGO CHACINAR] │
└──────────────────┘
   Logo más grande y visible
```

---

## 📏 Dimensiones Recomendadas

Después de recortar, el logo debería tener aproximadamente:
- **Ancho:** 800-1200px
- **Alto:** 300-400px
- **Formato:** PNG con transparencia (si es posible)

---

## 🚀 Después de Recortar

1. **Guardar** la imagen recortada como `public/logo.png`

2. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Verificar:**
   - Ir a `/auth`
   - El logo debe verse más grande
   - Ir a `/admin` o `/cliente`
   - El logo en el header debe verse mejor

---

**¡Recorta el borde blanco y el logo se verá mucho más grande y profesional! 🎨✨**
