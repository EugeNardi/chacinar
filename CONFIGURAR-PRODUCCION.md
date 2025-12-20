# 🔐 CONFIGURAR PRODUCCIÓN - CHACINAR

## 📋 CHECKLIST ANTES DE DESPLEGAR

### ✅ 1. Supabase
- [ ] Proyecto creado en Supabase
- [ ] Todas las tablas creadas (users, accounts, transactions, etc.)
- [ ] RLS (Row Level Security) activado
- [ ] Políticas de seguridad configuradas

### ✅ 2. Variables de Entorno
Necesitas estas credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**¿Dónde encontrarlas?**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ✅ 3. Configurar URL de Producción en Supabase

Una vez desplegado en Netlify:

1. **Ir a Supabase Dashboard**
   - Authentication → URL Configuration

2. **Agregar URLs:**
   ```
   Site URL: https://chacinar-app.netlify.app
   
   Redirect URLs:
   https://chacinar-app.netlify.app/**
   http://localhost:3000/**
   ```

---

## 🚀 DESPLEGAR PASO A PASO

### OPCIÓN A: Netlify CLI (Recomendado)

#### 1. Instalar Netlify CLI
```powershell
npm install -g netlify-cli
```

#### 2. Ejecutar Script de Deployment
```powershell
.\deploy.ps1
```

O manualmente:
```powershell
netlify login
netlify deploy --prod
```

#### 3. Configurar Variables de Entorno
```powershell
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://tu-proyecto.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "tu_anon_key_aqui"
```

#### 4. Redesplegar con Variables
```powershell
netlify deploy --prod
```

---

### OPCIÓN B: Netlify Dashboard

#### 1. Subir a GitHub
```powershell
git init
git add .
git commit -m "🚀 Chacinar v1.0 - Listo para producción"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/chacinar.git
git push -u origin main
```

#### 2. Conectar con Netlify
1. Ve a: https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Busca **"chacinar"**
5. Configuración:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **"Deploy site"**

#### 3. Agregar Variables de Entorno
1. En Netlify Dashboard → **Site settings**
2. **Environment variables** → **Add a variable**
3. Agregar:
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://tu-proyecto.supabase.co
   
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: tu_anon_key_aqui
   ```

#### 4. Redesplegar
1. **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🔍 VERIFICAR DEPLOYMENT

### 1. Build Local
```powershell
npm run build
```
✅ Debe completarse sin errores

### 2. Servidor Local
```powershell
npm run start
```
✅ Abre http://localhost:3000 y prueba

### 3. Producción
✅ Abre tu URL de Netlify
✅ Prueba login/registro
✅ Prueba crear cliente
✅ Prueba generar PDF

---

## 🎯 URLs IMPORTANTES

### Desarrollo
```
Local: http://localhost:3000
```

### Producción
```
Netlify: https://chacinar-app.netlify.app
(o tu dominio personalizado)
```

### Dashboards
```
Netlify: https://app.netlify.com/
Supabase: https://supabase.com/dashboard
```

---

## 🔧 COMANDOS ÚTILES

### Ver logs de deployment
```powershell
netlify logs
```

### Abrir sitio en producción
```powershell
netlify open:site
```

### Abrir dashboard de Netlify
```powershell
netlify open:admin
```

### Ver status del sitio
```powershell
netlify status
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Build failed"
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs en Netlify Dashboard
3. Verifica que todas las dependencias estén en `package.json`

### Error: "Supabase connection failed"
1. Verifica las variables de entorno en Netlify
2. Verifica que las URLs sean correctas
3. Verifica que el proyecto de Supabase esté activo

### Error: "Authentication failed"
1. Configura las URLs de redirect en Supabase
2. Verifica que la URL de producción esté autorizada
3. Limpia caché del navegador

---

## 📱 DESPUÉS DEL DEPLOYMENT

### 1. Probar Funcionalidades
- [ ] Login como admin
- [ ] Login como cliente
- [ ] Crear cliente sin cuenta
- [ ] Crear boleta
- [ ] Cargar saldo
- [ ] Generar PDF
- [ ] Ver historial

### 2. Configurar Dominio Propio (Opcional)
1. Netlify Dashboard → **Domain settings**
2. **Add custom domain**
3. Sigue las instrucciones para configurar DNS

### 3. Configurar HTTPS (Automático)
Netlify configura HTTPS automáticamente con Let's Encrypt.

---

## 🎉 ¡LISTO PARA USAR!

Tu aplicación Chacinar está en producción con:

✅ **Backend:** Supabase (PostgreSQL + Auth)
✅ **Frontend:** Next.js 14 + React 18
✅ **Hosting:** Netlify (CDN global)
✅ **Responsive:** 100% móvil-friendly
✅ **Seguro:** HTTPS + RLS + Auth
✅ **PDFs:** Con QR de Mercado Pago
✅ **Roles:** Admin + Cliente

**¡Comparte la URL y comienza a usarla! 🚀**

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs: `netlify logs`
2. Verifica variables de entorno
3. Revisa la consola del navegador (F12)
4. Verifica Supabase Dashboard

**¡Éxito con tu deployment! 🎊**
