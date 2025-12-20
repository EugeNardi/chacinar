-- ========================================
-- CAMBIAR TU CUENTA A ADMIN - URGENTE
-- ========================================

-- Ver TODAS las cuentas actuales
SELECT '=== TODAS LAS CUENTAS ===' as info;
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- OPCIÓN 1: Cambiar la cuenta más reciente a admin
UPDATE users 
SET role = 'admin' 
WHERE id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1);

-- OPCIÓN 2: Si tienes un email específico, usa esto:
-- UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

-- OPCIÓN 3: Si tu nombre es EUGENIO, usa esto:
-- UPDATE users SET role = 'admin' WHERE full_name LIKE '%EUGENIO%';

-- Verificar el cambio
SELECT '=== CUENTA ACTUALIZADA ===' as info;
SELECT id, email, full_name, role 
FROM users 
ORDER BY created_at DESC 
LIMIT 3;

-- ========================================
-- ✅ DESPUÉS DE EJECUTAR ESTO:
-- ========================================

/*

1. Cierra sesión en la app
2. Presiona F12 (consola del navegador)
3. Ve a: Application → Local Storage → http://localhost:3000
4. Haz clic derecho → Clear
5. Cierra la consola
6. Recarga la página (F5)
7. Inicia sesión de nuevo
8. ¡Deberías ir al panel de admin!

SI SIGUE SIN FUNCIONAR:

Ejecuta este SQL con TU EMAIL REAL:

UPDATE users 
SET role = 'admin' 
WHERE email = 'TU_EMAIL_REAL@ejemplo.com';

Y repite los pasos 1-8.

*/
