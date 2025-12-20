# 🔑 DÓNDE ENCONTRAR LA CLAVE CORRECTA

## Paso a Paso con Imágenes

### 1. Ve a la Configuración de API

URL directa: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/settings/api

### 2. Busca la Sección Correcta

En esa página verás **VARIAS secciones**:

```
❌ Connection string (PostgreSQL)
   postgresql://postgres:...
   ↑ NO ES ESTA

❌ Connection pooling
   ↑ NO ES ESTA

✅ Project API keys  ← ESTA ES LA CORRECTA
   ↓ AQUÍ ESTÁN LAS CLAVES
```

### 3. En "Project API keys" verás DOS claves:

```
┌─────────────────────────────────────────────────────┐
│ Project API keys                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ anon                                                 │
│ public                                               │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [📋 Copy]                                            │
│                                                      │
│ ✅ ESTA ES LA QUE NECESITAS ↑                        │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│ service_role                                         │
│ secret                                               │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [📋 Copy]                                            │
│                                                      │
│ ❌ NO USES ESTA ↑                                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 4. Copia la Clave "anon public"

Haz clic en el botón **Copy** (📋) que está al lado de la clave que dice:
- **`anon`**
- **`public`**

### 5. Características de la Clave Correcta

La clave que necesitas:
- ✅ Empieza con: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- ✅ Tiene 3 partes separadas por puntos (`.`)
- ✅ Es MUY larga (150-200 caracteres)
- ✅ Dice "anon" y "public" arriba

### 6. NO Confundir Con

❌ **Connection string**: `postgresql://postgres:...`
❌ **Publishable key**: `sb_publishable_...`
❌ **Service role key**: La otra clave que dice "secret"

---

## 🎯 Una Vez que la Copies

Pégala aquí en el chat y yo crearé el archivo `.env.local` automáticamente.

Debe verse algo así:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDM2MzEsImV4cCI6MjA1MDExOTYzMX0.abcdefghijklmnopqrstuvwxyz123456789
```

(Este es solo un ejemplo, tu clave será diferente)
