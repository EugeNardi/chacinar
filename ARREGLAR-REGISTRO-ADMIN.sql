-- ⚠️ EJECUTA ESTE SCRIPT EN SUPABASE SQL EDITOR
-- Esto arreglará el problema de registro de administradores

-- 1. Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

-- 2. Crear política de SELECT que permita a cualquier usuario autenticado ver su propio registro
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- 3. Crear política de SELECT que permita a admins ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Crear política de INSERT que permita a cualquier usuario autenticado crear su propio registro
-- Esta es la clave: permite el INSERT sin verificar si ya existe un registro previo
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Política para que admins puedan insertar otros usuarios (opcional, para futuro)
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Agregar política UPDATE para que usuarios puedan actualizar sus propios datos
DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 7. Agregar política UPDATE para que admins puedan actualizar cualquier usuario
DROP POLICY IF EXISTS "Admins can update all users" ON users;
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ✅ Listo! Ahora el registro de administradores debería funcionar correctamente
-- Los nuevos administradores podrán:
-- 1. Registrarse correctamente
-- 2. Iniciar sesión sin errores
-- 3. Acceder al panel de administrador
