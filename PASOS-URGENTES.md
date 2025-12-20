# 🚨 PASOS URGENTES PARA ARREGLAR LOS ERRORES

## Error 500 - Solución Inmediata

### 1. Ejecutar SQL en Supabase

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new
2. Abre el archivo **`ARREGLAR-TODO.sql`**
3. Copia TODO el contenido
4. Pégalo en Supabase SQL Editor
5. Haz clic en **"Run"**

**Esto deshabilitará RLS y arreglará los errores 500.**

---

### 2. Instalar Librería de QR

En la terminal, ejecuta:

```bash
npm install qrcode.react
```

Esto instalará la librería necesaria para generar códigos QR de Mercado Pago.

---

### 3. Reiniciar el Servidor

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

---

## ✅ Verificar que Funciona

1. Ve a http://localhost:3000
2. Inicia sesión con:
   - Email: `admin@chacinar.com`
   - Password: `Admin123456`

**Deberías poder:**
- ✅ Iniciar sesión sin errores
- ✅ Ver el panel de admin
- ✅ Ver la lista de clientes
- ✅ Cargar saldo a clientes
- ✅ Configurar Mercado Pago

---

## 🔧 Si Aún Hay Errores

### Error: Cannot find module 'qrcode.react'

```bash
npm install qrcode.react --save
```

### Error: 500 en Supabase

Verifica que ejecutaste el SQL `ARREGLAR-TODO.sql` correctamente.

### Error: Usuario no encontrado

Ejecuta `SETUP-COMPLETO-FINAL.sql` para crear los usuarios de prueba.

---

## 📋 Resumen de Archivos SQL

1. **`ARREGLAR-TODO.sql`** ← Ejecuta PRIMERO (arregla error 500)
2. **`SETUP-COMPLETO-FINAL.sql`** ← Ejecuta si necesitas crear usuarios
3. **`AGREGAR-MERCADOPAGO.sql`** ← Solo si ya tenías la BD creada

---

## 🎯 Orden de Ejecución

```
1. ARREGLAR-TODO.sql          (Arregla errores)
2. npm install qrcode.react   (Instala QR)
3. npm run dev                (Reinicia servidor)
4. Probar en http://localhost:3000
```

---

**¡Después de estos pasos todo debería funcionar! 🚀**
