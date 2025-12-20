# 🚨 SOLUCIÓN RÁPIDA AL ERROR

## El Problema

Las variables de entorno **NO están configuradas** en el archivo `.env.local`.

## ✅ Solución en 3 Pasos

### Paso 1: Editar .env.local

1. **Abre** el archivo `.env.local` que está en la raíz del proyecto
2. **Borra** todo su contenido actual
3. **Copia y pega** exactamente esto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=AQUI_VA_TU_CLAVE_ANON
```

4. **Reemplaza** `AQUI_VA_TU_CLAVE_ANON` con tu clave real de Supabase

### Paso 2: Obtener la Clave Anon

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/settings/api
2. Busca la sección **Project API keys**
3. Copia la clave que dice **`anon`** **`public`**
4. Debe empezar con `eyJ...` y ser muy larga (más de 100 caracteres)

### Paso 3: Reiniciar el Servidor

1. En la terminal donde corre `npm run dev`, presiona **Ctrl+C**
2. Ejecuta nuevamente:
   ```bash
   npm run dev
   ```
3. Espera a que diga "Ready in X ms"
4. Abre http://localhost:3000

---

## 📝 Ejemplo de .env.local Correcto

```env
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.ejemplo_de_firma_aqui
```

**IMPORTANTE**: 
- ✅ Usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no PUBLISHABLE_DEFAULT_KEY)
- ✅ La clave debe ser la **anon public** (no service_role)
- ✅ No debe haber espacios antes o después del `=`
- ✅ No debe haber comillas alrededor de los valores

---

## 🔍 Verificar que Funciona

Después de reiniciar el servidor, ejecuta:

```bash
node verificar-env.js
```

Deberías ver:
```
✅ Variables de entorno configuradas correctamente
```

---

## ❓ ¿Dónde está el archivo .env.local?

Está en la **raíz del proyecto**, al mismo nivel que:
- `package.json`
- `README.md`
- `tsconfig.json`

Si no lo ves, puede estar oculto. En VS Code:
1. Abre el explorador de archivos (Ctrl+Shift+E)
2. Busca `.env.local`
3. Si no existe, créalo nuevo

---

## 🆘 Si Sigue Sin Funcionar

1. Verifica que guardaste el archivo `.env.local`
2. Verifica que reiniciaste el servidor (Ctrl+C y `npm run dev`)
3. Verifica que la clave es la correcta (debe empezar con `eyJ`)
4. Cierra y abre el navegador
5. Limpia la caché del navegador (Ctrl+Shift+R)

---

**Una vez configurado correctamente, el error desaparecerá! 🚀**
