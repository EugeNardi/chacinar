# 🎨 PASOS PARA ACTUALIZAR EL LOGO

## PASO 1: Guardar la Imagen

1. **Guarda la imagen del logo que subiste como:**
   - Nombre: `logo.png`
   - Ubicación: `c:/Users/sebas/OneDrive/Escritorio/chacinar/public/logo.png`
   - Formato: PNG
   - Calidad: Alta

**IMPORTANTE:** La imagen debe estar en la carpeta `public` del proyecto.

---

## PASO 2: Verificar que el Archivo Existe

```bash
# En la terminal, verifica:
ls public/logo.png
```

Debe mostrar el archivo.

---

## PASO 3: El Código Ya Está Listo

El componente `Logo` ya está configurado para usar PNG:

```tsx
// src/components/Logo.tsx
<img 
  src="/logo.png"  // ← Buscará public/logo.png
  alt="Chacinar"
  style={{ width: sizes[size], height: 'auto' }}
/>
```

---

## PASO 4: Reiniciar Servidor

```bash
npm run dev
```

---

## ✅ El Logo Aparecerá En:

- ✅ Página de bienvenida (grande)
- ✅ Login admin (mediano)
- ✅ Login cliente (mediano)
- ✅ Registro (mediano)
- ✅ Panel admin (pequeño, arriba izquierda)
- ✅ Panel cliente (pequeño, arriba izquierda)

---

## 🎨 Características del Logo

El logo que subiste tiene:
- **Cerdo rojo** (silueta)
- **"Chacinar"** en tipografía cursiva negra
- **"Chacinados y embutidos artesanales Monte Buey"** en texto negro
- **Líneas decorativas** negras arriba y rojas abajo
- **Fondo blanco**

---

## 📐 Tamaños Configurados

- **sm:** 100px de ancho (headers)
- **md:** 150px de ancho (login/registro)
- **lg:** 200px de ancho (bienvenida)

Todos con altura automática para mantener proporciones.

---

**¡Guarda la imagen como `public/logo.png` y reinicia el servidor! El logo profesional aparecerá en toda la aplicación! 🎨✨**
