-- ========================================
-- ARREGLAR TU CUENTA A ADMINISTRADOR
-- Ejecuta esto AHORA en Supabase SQL Editor
-- ========================================

-- PASO 1: Ver tu cuenta actual
SELECT '=== TU CUENTA ACTUAL ===' as info;
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- PASO 2: Cambiar tu cuenta a ADMIN
-- Esto cambiará la cuenta más reciente a admin
UPDATE users 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM users 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- PASO 3: Verificar el cambio
SELECT '=== CUENTA ACTUALIZADA ===' as info;
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE id = (
  SELECT id 
  FROM users 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 INSTRUCCIONES:

1. Copia TODO este SQL
2. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new
3. Pega el SQL completo
4. Haz clic en "Run" (Ejecutar)
5. Verás tu cuenta con role = 'admin'

DESPUÉS:

1. Cierra sesión en la app (si estás logueado)
2. Abre la consola del navegador (F12)
3. Ve a: Application → Local Storage
4. Elimina todo (botón "Clear All")
5. Recarga la página (F5)
6. Inicia sesión de nuevo
7. ¡Deberías ir al panel de admin! 🎉

⚠️ SI SIGUE SIN FUNCIONAR:

Ejecuta este SQL adicional:

UPDATE users 
SET role = 'admin' 
WHERE email = 'TU_EMAIL_AQUI@DOMINIO.COM';

(Reemplaza con tu email real)

*/
