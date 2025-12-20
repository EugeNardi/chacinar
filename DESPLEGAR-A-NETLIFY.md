# 🚀 DESPLEGAR CHACINAR A NETLIFY

## ✅ Archivos de Configuración Listos

Ya están creados:
- ✅ `netlify.toml` - Configuración de build
- ✅ `package.json` - Dependencias
- ✅ `.env.example` - Variables de entorno

---

## 📋 OPCIÓN 1: Desplegar desde Netlify Dashboard (MÁS FÁCIL)

### Paso 1: Subir a GitHub (si no lo has hecho)
```bash
git init
git add .
git commit -m "🚀 Chacinar - Sistema de cuentas corrientes listo para producción"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/chacinar.git
git push -u origin main
```

### Paso 2: Conectar con Netlify
1. Ve a: **https://app.netlify.com/**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza
4. Busca el repositorio **"chacinar"**
5. Click en **"Deploy"**

### Paso 3: Configurar Variables de Entorno
En Netlify Dashboard:
1. Ve a **Site settings** → **Environment variables**
2. Agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_anon_key_aqui
```

**IMPORTANTE:** Usa tus credenciales reales de Supabase.

### Paso 4: Redesplegar
1. Click en **"Deploys"**
2. Click en **"Trigger deploy"** → **"Deploy site"**

---

## 📋 OPCIÓN 2: Desplegar con Netlify CLI

### Paso 1: Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

### Paso 2: Login
```bash
netlify login
```

### Paso 3: Inicializar
```bash
cd c:/Users/sebas/OneDrive/Escritorio/chacinar
netlify init
```

Selecciona:
- **Create & configure a new site**
- Team: Tu equipo
- Site name: **chacinar-app** (o el que prefieras)
- Build command: `npm run build`
- Publish directory: `.next`

### Paso 4: Configurar Variables de Entorno
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "tu_anon_key_aqui"
```

### Paso 5: Desplegar
```bash
netlify deploy --prod
```

---

## 🔐 CONFIGURAR SUPABASE PARA PRODUCCIÓN

### Paso 1: Ir a Supabase Dashboard
1. Ve a: **https://supabase.com/dashboard**
2. Selecciona tu proyecto

### Paso 2: Configurar URL de Producción
1. Ve a **Authentication** → **URL Configuration**
2. Agrega tu URL de Netlify:
   - Site URL: `https://chacinar-app.netlify.app`
   - Redirect URLs: `https://chacinar-app.netlify.app/**`

### Paso 3: Configurar Email Templates (Opcional)
1. Ve a **Authentication** → **Email Templates**
2. Personaliza los emails con tu dominio

---

## 📊 VERIFICAR DEPLOYMENT

### 1. Verificar Build
```bash
npm run build
```
Debe completarse sin errores.

### 2. Verificar Localmente
```bash
npm run start
```
Abre: http://localhost:3000

### 3. Verificar en Producción
Una vez desplegado:
- URL: `https://chacinar-app.netlify.app`
- Prueba login/registro
- Prueba crear boletas
- Prueba generar PDFs

---

## 🎯 COMANDOS RÁPIDOS

### Desplegar cambios
```bash
git add .
git commit -m "Actualización"
git push
```
Netlify desplegará automáticamente.

### Ver logs
```bash
netlify logs
```

### Abrir sitio
```bash
netlify open:site
```

### Ver dashboard
```bash
netlify open:admin
```

---

## 🔧 CONFIGURACIÓN DE netlify.toml

Ya está creado con:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
```

---

## ⚠️ IMPORTANTE ANTES DE DESPLEGAR

### 1. Variables de Entorno
Asegúrate de tener en Netlify:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Supabase
- URL de producción configurada
- Políticas RLS activadas
- Tablas creadas

### 3. Build Local
Prueba que el build funcione:
```bash
npm run build
```

---

## 🚀 DESPLEGAR AHORA (OPCIÓN RÁPIDA)

Si ya tienes Netlify CLI instalado:

```bash
# 1. Login
netlify login

# 2. Desplegar
cd c:/Users/sebas/OneDrive/Escritorio/chacinar
netlify deploy --prod

# 3. Configurar variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "TU_URL"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "TU_KEY"

# 4. Redesplegar
netlify deploy --prod
```

---

## 📱 DESPUÉS DEL DEPLOYMENT

1. **Probar en móvil:** La app es 100% responsive
2. **Compartir URL:** `https://chacinar-app.netlify.app`
3. **Configurar dominio propio** (opcional):
   - Netlify Dashboard → Domain settings
   - Add custom domain

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Tu aplicación Chacinar está lista con:
- ✅ Next.js 14 optimizado
- ✅ Supabase backend
- ✅ Diseño responsive
- ✅ PDFs con QR de Mercado Pago
- ✅ Sistema de roles (Admin/Cliente)
- ✅ Cuenta corriente completa

**¡Despliega y comienza a usarla! 🚀**
