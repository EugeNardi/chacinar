# 🎨 Cómo Agregar el Logo Real de Chacinar

## 📋 Pasos para Reemplazar el Logo

### 1. Guardar la Imagen del Logo

1. **Guarda la imagen** del logo de Chacinar (la que tiene el cerdo rojo y el texto)
2. **Nómbrala exactamente**: `logo.png`
3. **Guárdala en**: `c:\Users\sebas\OneDrive\Escritorio\chacinar\public\logo.png`

### 2. Verificar la Ubicación

La estructura debe quedar así:
```
chacinar/
├── public/
│   └── logo.png  ← Aquí debe estar tu imagen
├── src/
├── package.json
└── ...
```

### 3. Reiniciar el Servidor

Después de guardar la imagen:

1. **Detén el servidor** (Ctrl+C en la terminal)
2. **Reinicia**:
   ```bash
   npm run dev
   ```

### 4. Verificar

Abre http://localhost:3000 y deberías ver:
- ✅ El logo real de Chacinar en la página de bienvenida
- ✅ El logo en el header del panel de admin
- ✅ El logo en el header del panel de cliente

---

## 🔧 Si la Imagen No Aparece

### Opción 1: Verificar el Nombre
- El archivo DEBE llamarse exactamente `logo.png`
- Debe estar en la carpeta `public`

### Opción 2: Limpiar Caché
1. Detén el servidor
2. Borra la carpeta `.next`:
   ```bash
   rmdir /s .next
   ```
3. Reinicia:
   ```bash
   npm run dev
   ```

### Opción 3: Verificar el Formato
- Si la imagen es JPG, renómbrala a `logo.jpg` y actualiza el código
- Si es PNG, debe ser `logo.png`

---

## ✅ Código Ya Actualizado

Ya actualicé el componente `Logo.tsx` para usar `/logo.png` en lugar del SVG.

**Solo falta que guardes la imagen en `public/logo.png`!**

---

## 📐 Tamaños del Logo

El logo se mostrará en 3 tamaños:
- **sm** (pequeño): 100x40px - En headers
- **md** (mediano): 150x60px - En páginas
- **lg** (grande): 200x80px - En página de bienvenida

La imagen se ajustará automáticamente manteniendo la proporción.
