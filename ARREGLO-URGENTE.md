# ARREGLO URGENTE - SITIO EN PRODUCCION

## PROBLEMA
Tu sitio en Netlify NO tiene las variables de Supabase configuradas.
Por eso nadie puede hacer login.

## SOLUCION RAPIDA (5 MINUTOS)

### OPCION 1: Desde Dashboard (RECOMENDADO)

1. Abre: https://app.netlify.com
2. Selecciona tu sitio
3. Site settings -> Environment variables
4. Add variable (2 veces):

**Variable 1:**
```
NEXT_PUBLIC_SUPABASE_URL
https://bwyuggaylirmlwozowgb.supabase.co
```

**Variable 2:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng
```

5. Trigger deploy -> Deploy site
6. Espera 2-3 minutos
7. Prueba tu sitio

### OPCION 2: Desde CLI

```powershell
.\configurar-netlify.ps1
```

Luego:
```powershell
netlify deploy --prod
```

---

## VERIFICAR QUE FUNCIONE

1. Abre tu sitio de Netlify
2. Abre la consola del navegador (F12)
3. NO debe aparecer "placeholder.supabase.co"
4. Intenta hacer login
5. Debe funcionar

---

## POR QUE PASO ESTO

Las variables de entorno se configuran en 2 lugares:

1. **Local** (.env.local) - ESTA OK
2. **Netlify** (Dashboard) - FALTABA ESTO

El sitio en produccion usa las variables de Netlify, no las locales.

---

## EJECUTAR AHORA

**OPCION MAS RAPIDA:**
1. https://app.netlify.com
2. Tu sitio -> Site settings -> Environment variables
3. Agregar las 2 variables de arriba
4. Trigger deploy

**En 3 minutos estara funcionando!**
