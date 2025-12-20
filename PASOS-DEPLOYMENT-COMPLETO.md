# 🚀 PASOS COMPLETOS PARA DEPLOYMENT A NETLIFY

## ✅ ESTADO ACTUAL

- ✅ Build local exitoso
- ✅ Variables de entorno configuradas localmente
- ✅ Código sin errores TypeScript
- ✅ Supabase configurado con fallback

---

## 📋 PASO 1: INSTALAR NETLIFY CLI

```powershell
npm install -g netlify-cli
```

---

## 📋 PASO 2: LOGIN A NETLIFY

```powershell
netlify login
```

Esto abrirá tu navegador para autorizar.

---

## 📋 PASO 3: INICIALIZAR PROYECTO

```powershell
netlify init
```

Responde las preguntas:
1. **Create & configure a new site** → YES
2. **Team** → Selecciona tu equipo
3. **Site name** → `chacinar-app` (o el que prefieras)
4. **Build command** → `npm run build`
5. **Publish directory** → `.next`
6. **Netlify functions folder** → (dejar vacío)

---

## 📋 PASO 4: CONFIGURAR VARIABLES DE ENTORNO EN NETLIFY

### Opción A: Desde CLI
```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"
```

### Opción B: Desde Dashboard
1. Ve a: https://app.netlify.com
2. Selecciona tu sitio
3. **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Agrega:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://bwyuggaylirmlwozowgb.supabase.co`
6. Click **Add a variable** de nuevo
7. Agrega:
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng`

---

## 📋 PASO 5: DESPLEGAR

```powershell
netlify deploy --prod
```

O usa el script:
```powershell
.\deploy.ps1
```

---

## 📋 PASO 6: CONFIGURAR SUPABASE

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: **bwyuggaylirmlwozowgb**
3. **Authentication** → **URL Configuration**
4. Agrega tu URL de Netlify (ej: `https://chacinar-app.netlify.app`)
   - **Site URL**: `https://chacinar-app.netlify.app`
   - **Redirect URLs**: `https://chacinar-app.netlify.app/**`
5. Click **Save**

---

## 📋 PASO 7: VERIFICAR DEPLOYMENT

1. Abre tu URL de Netlify
2. Prueba login admin
3. Prueba login cliente
4. Crea una boleta
5. Genera un PDF
6. Prueba en móvil

---

## 🔧 SI HAY ERRORES

### Error: "supabaseUrl is required"

**Solución:**
1. Verifica que las variables estén en Netlify Dashboard
2. Trigger un nuevo deploy:
   ```powershell
   netlify deploy --prod
   ```

### Error: Build falla

**Solución:**
1. Limpia y reconstruye local:
   ```powershell
   Remove-Item -Path .next -Recurse -Force
   npm run build
   ```
2. Si funciona local, despliega de nuevo

### Error: Auth no funciona

**Solución:**
1. Verifica URLs en Supabase Dashboard
2. Asegúrate que coincidan con tu URL de Netlify
3. Limpia caché del navegador

---

## 📊 COMANDOS ÚTILES

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

### Ver variables de entorno
```powershell
netlify env:list
```

### Redesplegar
```powershell
netlify deploy --prod
```

---

## ✅ CHECKLIST FINAL

- [ ] Netlify CLI instalado
- [ ] Login a Netlify exitoso
- [ ] Proyecto inicializado
- [ ] Variables de entorno configuradas
- [ ] Deployment exitoso
- [ ] URLs configuradas en Supabase
- [ ] Login admin funciona
- [ ] Login cliente funciona
- [ ] PDFs se generan correctamente
- [ ] Responsive en móvil

---

## 🎉 RESULTADO ESPERADO

Tu aplicación estará disponible en:
```
https://chacinar-app.netlify.app
```

O el nombre que hayas elegido.

---

## 📞 SOPORTE

Si algo falla:
1. Revisa los logs: `netlify logs`
2. Verifica variables: `netlify env:list`
3. Verifica build local: `npm run build`
4. Revisa la consola del navegador

---

**¡SIGUE ESTOS PASOS Y ESTARÁS EN PRODUCCIÓN! 🚀**
