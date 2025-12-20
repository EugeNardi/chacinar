# DEPLOY A NETLIFY - PASOS FINALES

## ESTADO ACTUAL
- Build exitoso
- Variables configuradas
- Codigo sin errores
- Listo para produccion

---

## OPCION 1: DEPLOY AUTOMATICO (RECOMENDADO)

### Ejecuta:
```powershell
.\deploy.ps1
```

El script te guiara paso a paso.

---

## OPCION 2: DEPLOY MANUAL

### Paso 1: Instalar Netlify CLI
```powershell
npm install -g netlify-cli
```

### Paso 2: Login
```powershell
netlify login
```

### Paso 3: Inicializar (primera vez)
```powershell
netlify init
```

Responde:
- Create & configure a new site: YES
- Site name: chacinar-app (o el que quieras)
- Build command: npm run build
- Publish directory: .next

### Paso 4: Configurar Variables de Entorno

#### Opcion A: Desde CLI
```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"

netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"
```

#### Opcion B: Desde Dashboard
1. https://app.netlify.com
2. Tu sitio -> Site settings -> Environment variables
3. Add variable:
   - Key: NEXT_PUBLIC_SUPABASE_URL
   - Value: https://bwyuggaylirmlwozowgb.supabase.co
4. Add variable:
   - Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng

### Paso 5: Desplegar
```powershell
netlify deploy --prod
```

---

## DESPUES DEL DEPLOY

### 1. Configurar Supabase
1. https://supabase.com/dashboard
2. Tu proyecto -> Authentication -> URL Configuration
3. Agregar:
   - Site URL: https://tu-app.netlify.app
   - Redirect URLs: https://tu-app.netlify.app/**
4. Save

### 2. Verificar
- Abrir URL de Netlify
- Probar login admin
- Probar login cliente
- Crear boleta
- Generar PDF

---

## COMANDOS UTILES

### Ver sitio
```powershell
netlify open:site
```

### Ver dashboard
```powershell
netlify open:admin
```

### Ver logs
```powershell
netlify logs
```

### Redesplegar
```powershell
netlify deploy --prod
```

---

## CREDENCIALES PARA NETLIFY

**SUPABASE_URL:**
```
https://bwyuggaylirmlwozowgb.supabase.co
```

**ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng
```

---

## EJECUTAR AHORA

```powershell
.\deploy.ps1
```

**Tu app estara en linea en minutos!**
