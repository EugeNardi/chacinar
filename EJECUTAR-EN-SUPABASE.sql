-- ⚠️ EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Esto arreglará el error 401 al registrarse

-- 1. Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can create their own account" ON accounts;
DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;

-- 2. Crear políticas para permitir registro de usuarios
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Crear políticas para permitir creación de cuentas
CREATE POLICY "Users can create their own account" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ✅ Listo! Ahora el registro debería funcionar
