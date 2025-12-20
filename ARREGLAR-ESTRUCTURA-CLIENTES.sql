-- ========================================
-- ARREGLAR ESTRUCTURA PARA CLIENTES SIN CUENTA
-- ========================================

-- Eliminar la restricción de foreign key en users.id
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Ahora users.id puede ser cualquier UUID, no necesariamente de auth.users
-- Esto permite crear clientes sin cuenta de autenticación

-- Agregar índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

SELECT '=== ✅ ESTRUCTURA ACTUALIZADA ===' as info;

-- Verificar la estructura
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 CÓMO FUNCIONA AHORA:

ANTES:
- users.id DEBE existir en auth.users
- No se pueden crear clientes sin cuenta de autenticación

AHORA:
- users.id puede ser cualquier UUID
- Se pueden crear clientes sin cuenta de autenticación
- Cuando el cliente se registra, se vincula con su código

FLUJO:

1. Admin crea cliente sin cuenta
   - Se genera UUID temporal
   - Se crea registro en users con ese UUID
   - Se crea cuenta vinculada a ese UUID
   - Se genera código de vinculación

2. Cliente se registra después
   - Se crea usuario en auth.users (nuevo UUID)
   - Se busca cuenta por código de vinculación
   - Se actualiza user_id de la cuenta al nuevo UUID
   - Se actualiza o elimina el registro temporal en users

IMPORTANTE:
- Los clientes sin cuenta NO pueden iniciar sesión
- Solo se usan para tracking y gestión
- Cuando se registran, se vincula todo automáticamente

*/
