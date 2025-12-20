# 🔐 CREAR ARCHIVO .env.local

## 📋 INSTRUCCIONES

### Paso 1: Crear el archivo
1. En la raíz del proyecto `chacinar`
2. Crea un archivo llamado **`.env.local`**
3. Copia y pega el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjIyMzUsImV4cCI6MjA1MDI5ODIzNX0.sb_publishable_2Hb5lxpeNlsekZyrxtzZCQ_obc04wT2
```

### Paso 2: Guardar
- Guarda el archivo
- **NO** lo subas a Git (ya está en `.gitignore`)

### Paso 3: Verificar
```powershell
# Reiniciar servidor
npm run dev
```

---

## 🚀 PARA NETLIFY

En **Netlify Dashboard** → **Site settings** → **Environment variables**:

### Variable 1:
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://bwyuggaylirmlwozowgb.supabase.co
```

### Variable 2:
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjIyMzUsImV4cCI6MjA1MDI5ODIzNX0.sb_publishable_2Hb5lxpeNlsekZyrxtzZCQ_obc04wT2
```

---

## ⚠️ IMPORTANTE

El `ANON_KEY` correcto debe empezar con `eyJ...`

Si solo tienes el `PUBLISHABLE_KEY`, necesitas obtener el `ANON_KEY`:

1. Ve a: https://supabase.com/dashboard
2. Tu proyecto → **Settings** → **API**
3. Copia el **anon public** key (empieza con `eyJ...`)

---

## 📝 CREAR ARCHIVO MANUALMENTE

### Windows (PowerShell):
```powershell
cd c:\Users\sebas\OneDrive\Escritorio\chacinar
notepad .env.local
```

Pega el contenido y guarda.

### Windows (CMD):
```cmd
cd c:\Users\sebas\OneDrive\Escritorio\chacinar
echo NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co > .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI >> .env.local
```

---

## ✅ DESPUÉS DE CREAR

1. **Reiniciar servidor:**
   ```powershell
   npm run dev
   ```

2. **Verificar build:**
   ```powershell
   npm run build
   ```

3. **Desplegar:**
   ```powershell
   .\deploy.ps1
   ```

---

**¡Crea el archivo `.env.local` y estarás listo para desplegar! 🚀**
