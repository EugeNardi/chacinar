-- ========================================
-- ARREGLAR ROL DE ADMINISTRADOR
-- Ejecuta esto en Supabase SQL Editor
-- ========================================

-- Ver todos los usuarios actuales
SELECT '=== USUARIOS ACTUALES ===' as info;
SELECT id, email, role FROM users ORDER BY created_at;

-- Actualizar el rol de tu cuenta a admin
-- Reemplaza 'TU_EMAIL_ADMIN@DOMINIO.COM' con tu email real
UPDATE users 
SET role = 'admin' 
WHERE email LIKE '%admin%' OR email = 'TU_EMAIL_ADMIN@DOMINIO.COM';

-- Si tienes un email específico que no contiene 'admin', usa esto:
-- UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- Verificar que se actualizó correctamente
SELECT '=== USUARIOS ACTUALIZADOS ===' as info;
SELECT id, email, role FROM users ORDER BY role DESC, email;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 INSTRUCCIONES:

1. Si tu email de admin es algo como:
   - admin@chacinar.com
   - sebastian.admin@gmail.com
   - cualquier-cosa-admin@dominio.com
   
   → El SQL ya lo detectará automáticamente

2. Si tu email NO contiene 'admin', por ejemplo:
   - sebastian@gmail.com
   - info@chacinar.com
   
   → Reemplaza 'TU_EMAIL_ADMIN@DOMINIO.COM' con tu email real

3. Después de ejecutar:
   - Cierra sesión
   - Vuelve a iniciar sesión
   - Deberías ir al panel de admin

⚠️ IMPORTANTE:

Si sigues yendo al panel de cliente después de ejecutar esto:
1. Abre la consola del navegador (F12)
2. Ve a Application → Local Storage
3. Elimina todo
4. Recarga la página
5. Inicia sesión de nuevo

*/
