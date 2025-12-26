-- ⚠️ EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Este script limpia usuarios huérfanos y arregla las políticas RLS

-- PASO 1: Limpiar políticas antiguas
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- PASO 2: Crear políticas correctas para SELECT
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 3: Crear políticas correctas para INSERT
-- Esta política permite a CUALQUIER usuario autenticado crear su propio registro
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- PASO 4: Crear políticas para UPDATE
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ✅ PASO 5: Ahora necesitas ELIMINAR MANUALMENTE el usuario huérfano de Auth
-- 
-- Ve a: Authentication > Users en Supabase Dashboard
-- Busca el email: sebastiannardi1976@gmail.com
-- Elimina ese usuario (botón de tres puntos > Delete user)
-- 
-- Después de eliminarlo:
-- 1. Regístrate nuevamente como admin
-- 2. Confirma tu email
-- 3. Inicia sesión
-- 
-- ✅ Ahora podrás registrar MÚLTIPLES administradores sin problemas
