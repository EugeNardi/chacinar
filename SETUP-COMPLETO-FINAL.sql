-- ========================================
-- SETUP COMPLETO DE CHACINAR - VERSIÓN FINAL
-- Ejecuta este archivo COMPLETO en Supabase SQL Editor
-- ========================================

-- PASO 1: Crear extensión UUID
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PASO 2: Crear tablas si no existen
-- ========================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cuentas corrientes
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  mercadopago_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('aprobado', 'pendiente', 'rechazado')) DEFAULT 'aprobado',
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de solicitudes de modificación
CREATE TABLE IF NOT EXISTS modification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  requested_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- PASO 3: Crear índices
-- ========================================
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_modification_requests_status ON modification_requests(status);

-- PASO 4: Habilitar RLS
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modification_requests ENABLE ROW LEVEL SECURITY;

-- PASO 5: Eliminar políticas antiguas
-- ========================================
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;

DROP POLICY IF EXISTS "Users can view their own account" ON accounts;
DROP POLICY IF EXISTS "Users can create their own account" ON accounts;
DROP POLICY IF EXISTS "Admins can view all accounts" ON accounts;
DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;
DROP POLICY IF EXISTS "Admins can update all accounts" ON accounts;

DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;

DROP POLICY IF EXISTS "Users can view their own requests" ON modification_requests;
DROP POLICY IF EXISTS "Users can create requests" ON modification_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON modification_requests;

-- PASO 6: Crear políticas RLS para users
-- ========================================
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 7: Crear políticas RLS para accounts
-- ========================================
CREATE POLICY "Users can view their own account" ON accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own account" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all accounts" ON accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 8: Crear políticas RLS para transactions
-- ========================================
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 9: Crear políticas RLS para modification_requests
-- ========================================
CREATE POLICY "Users can view their own requests" ON modification_requests
  FOR SELECT USING (requested_by = auth.uid());

CREATE POLICY "Users can create requests" ON modification_requests
  FOR INSERT WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Admins can view all requests" ON modification_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PASO 10: Crear usuarios de prueba
-- ========================================
-- IMPORTANTE: Primero crea estos usuarios en Authentication:
-- 1. Ve a: Authentication → Users → Add user
-- 2. Crea admin@chacinar.com con password Admin123456
-- 3. Crea cliente@test.com con password Cliente123
-- 4. Marca "Auto Confirm User" en ambos

DO $$
DECLARE
  admin_uuid UUID;
  cliente_uuid UUID;
BEGIN
  -- Buscar UUID del admin
  SELECT id INTO admin_uuid 
  FROM auth.users 
  WHERE email = 'admin@chacinar.com' 
  LIMIT 1;
  
  IF admin_uuid IS NOT NULL THEN
    INSERT INTO users (id, email, full_name, role)
    VALUES (admin_uuid, 'admin@chacinar.com', 'Administrador Chacinar', 'admin')
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
    
    RAISE NOTICE '✅ Usuario admin creado/actualizado: %', admin_uuid;
  ELSE
    RAISE NOTICE '⚠️  No se encontró admin@chacinar.com en Authentication';
    RAISE NOTICE '   Créalo en: Authentication → Users → Add user';
  END IF;
  
  -- Buscar UUID del cliente
  SELECT id INTO cliente_uuid 
  FROM auth.users 
  WHERE email = 'cliente@test.com' 
  LIMIT 1;
  
  IF cliente_uuid IS NOT NULL THEN
    INSERT INTO users (id, email, full_name, role)
    VALUES (cliente_uuid, 'cliente@test.com', 'Cliente de Prueba', 'cliente')
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
    
    INSERT INTO accounts (user_id, balance)
    VALUES (cliente_uuid, 0.00)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE '✅ Usuario cliente creado/actualizado: %', cliente_uuid;
  ELSE
    RAISE NOTICE '⚠️  No se encontró cliente@test.com en Authentication';
    RAISE NOTICE '   Créalo en: Authentication → Users → Add user';
  END IF;
END $$;

-- PASO 11: Verificación
-- ========================================
SELECT '=== USUARIOS CREADOS ===' as info;
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at DESC;

SELECT '=== CUENTAS CREADAS ===' as info;
SELECT a.id, u.email, u.full_name, a.balance, a.created_at
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- ========================================
-- ✅ SETUP COMPLETADO
-- ========================================

/*

📝 CREDENCIALES PARA INICIAR SESIÓN:

👨‍💼 ADMINISTRADOR:
   Email: admin@chacinar.com
   Password: Admin123456
   
👤 CLIENTE:
   Email: cliente@test.com
   Password: Cliente123

🚀 PRÓXIMOS PASOS:

1. Si ves mensajes de "⚠️ No se encontró...", ve a Authentication y crea los usuarios
2. Vuelve a ejecutar este script completo
3. Ve a http://localhost:3000
4. Inicia sesión con las credenciales de arriba

✅ Si ves "✅ Usuario creado/actualizado", ¡todo está listo!

*/
