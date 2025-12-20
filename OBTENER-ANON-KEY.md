# 🔑 OBTENER ANON KEY DE SUPABASE

## ⚠️ IMPORTANTE

Tienes el **PUBLISHABLE_KEY**, pero necesitas el **ANON_KEY** para que funcione.

---

## 📋 CÓMO OBTENER EL ANON_KEY

### Paso 1: Ir a Supabase Dashboard
1. Abre: **https://supabase.com/dashboard**
2. Inicia sesión
3. Selecciona tu proyecto: **bwyuggaylirmlwozowgb**

### Paso 2: Ir a Settings → API
1. En el menú lateral, click en **Settings** (⚙️)
2. Click en **API**

### Paso 3: Copiar el ANON KEY
Busca la sección **Project API keys**:

```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjIyMzUsImV4cCI6MjA1MDI5ODIzNX0.XXXXXXXXXXXXXXXXXXXXXXX
```

**Copia TODO el texto** que empieza con `eyJ...`

---

## 📝 DIFERENCIA ENTRE KEYS

### ❌ PUBLISHABLE_KEY (que me diste)
```
sb_publishable_2Hb5lxpeNlsekZyrxtzZCQ_obc04wT2
```
**NO es la correcta para Next.js**

### ✅ ANON_KEY (la que necesitas)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Esta es la correcta**

---

## 🔧 CREAR .env.local

Una vez que tengas el **ANON_KEY**:

### 1. Crear archivo `.env.local` en la raíz del proyecto

### 2. Pegar este contenido:
```env
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TU_ANON_KEY_COMPLETO_AQUI
```

**Reemplaza** `TU_ANON_KEY_COMPLETO_AQUI` con el key que copiaste.

---

## 🚀 PARA NETLIFY

Cuando despliegues, usa las mismas variables en Netlify:

**Netlify Dashboard** → **Site settings** → **Environment**:

```
NEXT_PUBLIC_SUPABASE_URL = https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ VERIFICAR

### 1. Crear .env.local con el ANON_KEY correcto
### 2. Reiniciar servidor:
```powershell
npm run dev
```

### 3. Verificar build:
```powershell
npm run build
```

Si el build funciona, ¡estás listo para desplegar! 🎉

---

## 🆘 SI NO ENCUENTRAS EL ANON_KEY

Envíame una captura de pantalla de:
- Supabase Dashboard → Settings → API

Y te ayudo a identificarlo.

---

**¡Obtén el ANON_KEY y estarás listo! 🔑✨**
