# CHACINAR - DEPLOYMENT A NETLIFY

## TODO LISTO PARA PRODUCCION

### Estado
- Build: EXITOSO
- TypeScript: SIN ERRORES
- Variables: CONFIGURADAS
- Supabase: CONECTADO

---

## DESPLEGAR AHORA

### Opcion 1: Script Automatico
```powershell
.\deploy.ps1
```

### Opcion 2: Script Simple
```powershell
.\deploy-simple.ps1
```

### Opcion 3: Manual
Lee: `DEPLOY-FINAL.md`

---

## CREDENCIALES PARA NETLIFY

Cuando despliegues, necesitas configurar estas variables en Netlify:

### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
https://bwyuggaylirmlwozowgb.supabase.co
```

### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng
```

---

## CONFIGURAR DESDE CLI

```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"

netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"
```

---

## DESPUES DEL DEPLOY

### Configurar Supabase
1. https://supabase.com/dashboard
2. Tu proyecto -> Authentication -> URL Configuration
3. Site URL: `https://tu-app.netlify.app`
4. Redirect URLs: `https://tu-app.netlify.app/**`

---

## ARCHIVOS IMPORTANTES

- `deploy.ps1` - Script completo con validaciones
- `deploy-simple.ps1` - Script simplificado
- `DEPLOY-FINAL.md` - Instrucciones detalladas
- `PASOS-DEPLOYMENT-COMPLETO.md` - Guia paso a paso
- `.env.local` - Variables locales (NO subir a Git)
- `netlify.toml` - Configuracion de Netlify

---

## COMANDOS UTILES

### Ver sitio desplegado
```powershell
netlify open:site
```

### Ver dashboard de Netlify
```powershell
netlify open:admin
```

### Ver logs
```powershell
netlify logs
```

### Verificar variables
```powershell
netlify env:list
```

---

## EJECUTAR

```powershell
.\deploy.ps1
```

**Tu aplicacion estara en linea en minutos!**
