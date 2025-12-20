-- ========================================
-- SETUP COMPLETO DE CHACINAR
-- Ejecuta este archivo COMPLETO en Supabase SQL Editor
-- ========================================

-- PASO 1: Actualizar políticas RLS para permitir registro
-- ========================================

DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can create their own account" ON accounts;
DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own account" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- PASO 2: Crear función para generar UUID
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PASO 3: Crear usuarios de prueba
-- IMPORTANTE: Primero debes crear estos usuarios en Authentication
-- Ve a: Authentication → Users → Add user
-- ========================================

-- Usuario Admin
-- Email: admin@chacinar.com
-- Password: Admin123456
-- Después de crear en Authentication, ejecuta esto:

DO $$
DECLARE
  admin_uuid UUID;
BEGIN
  -- Buscar el UUID del usuario admin en auth.users
  SELECT id INTO admin_uuid 
  FROM auth.users 
  WHERE email = 'admin@chacinar.com' 
  LIMIT 1;
  
  IF admin_uuid IS NOT NULL THEN
    -- Insertar en la tabla users si no existe
    INSERT INTO users (id, email, full_name, role)
    VALUES (admin_uuid, 'admin@chacinar.com', 'Administrador Chacinar', 'admin')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Usuario admin creado con UUID: %', admin_uuid;
  ELSE
    RAISE NOTICE 'ADVERTENCIA: No se encontró el usuario admin@chacinar.com en Authentication';
    RAISE NOTICE 'Por favor, créalo primero en: Authentication → Users → Add user';
  END IF;
END $$;

-- Usuario Cliente de Prueba
-- Email: cliente@test.com
-- Password: Cliente123
-- Después de crear en Authentication, ejecuta esto:

DO $$
DECLARE
  cliente_uuid UUID;
BEGIN
  -- Buscar el UUID del usuario cliente en auth.users
  SELECT id INTO cliente_uuid 
  FROM auth.users 
  WHERE email = 'cliente@test.com' 
  LIMIT 1;
  
  IF cliente_uuid IS NOT NULL THEN
    -- Insertar en la tabla users si no existe
    INSERT INTO users (id, email, full_name, role)
    VALUES (cliente_uuid, 'cliente@test.com', 'Cliente de Prueba', 'cliente')
    ON CONFLICT (id) DO NOTHING;
    
    -- Crear cuenta corriente para el cliente
    INSERT INTO accounts (user_id, balance)
    VALUES (cliente_uuid, 0.00)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE 'Usuario cliente creado con UUID: %', cliente_uuid;
  ELSE
    RAISE NOTICE 'ADVERTENCIA: No se encontró el usuario cliente@test.com en Authentication';
    RAISE NOTICE 'Por favor, créalo primero en: Authentication → Users → Add user';
  END IF;
END $$;

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Ver usuarios creados
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- Ver cuentas creadas
SELECT a.id, u.email, u.full_name, a.balance, a.created_at
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- ========================================
-- RESUMEN DE CREDENCIALES
-- ========================================

/*

✅ USUARIOS CREADOS:

👨‍💼 ADMINISTRADOR:
   Email: admin@chacinar.com
   Password: Admin123456
   
👤 CLIENTE:
   Email: cliente@test.com
   Password: Cliente123

📝 INSTRUCCIONES:

1. Si los usuarios NO aparecen arriba, significa que no los creaste en Authentication
2. Ve a: Authentication → Users → Add user
3. Crea cada usuario con el email y password indicados
4. Marca "Auto Confirm User" ✅
5. Vuelve a ejecutar este script completo

🚀 INICIAR SESIÓN:

Ve a: http://localhost:3000
Usa las credenciales de arriba para iniciar sesión

*/
