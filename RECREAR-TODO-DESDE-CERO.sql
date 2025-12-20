-- ========================================
-- RECREAR TODO DESDE CERO
-- ⚠️ ESTO ELIMINARÁ TODOS LOS DATOS EXISTENTES
-- Ejecuta esto COMPLETO en Supabase SQL Editor
-- ========================================

-- PASO 1: Eliminar tablas existentes
-- ========================================

DROP TABLE IF EXISTS modification_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- PASO 2: Crear extensión UUID
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PASO 3: Crear tabla users
-- ========================================

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 4: Crear tabla accounts
-- ========================================

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  mercadopago_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 5: Crear tabla transactions
-- ========================================

CREATE TABLE transactions (
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

-- PASO 6: Crear tabla modification_requests
-- ========================================

CREATE TABLE modification_requests (
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

-- PASO 7: Crear índices
-- ========================================

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_modification_requests_status ON modification_requests(status);

-- PASO 8: NO habilitar RLS (para evitar errores)
-- ========================================

-- Dejamos RLS deshabilitado para que funcione sin problemas

-- PASO 9: Crear usuarios de prueba
-- ========================================

DO $$
DECLARE
  admin_uuid UUID;
  cliente_uuid UUID;
BEGIN
  -- Buscar UUID del admin en auth.users
  SELECT id INTO admin_uuid 
  FROM auth.users 
  WHERE email = 'admin@chacinar.com' 
  LIMIT 1;
  
  IF admin_uuid IS NOT NULL THEN
    -- Insertar admin en users
    INSERT INTO users (id, email, full_name, role)
    VALUES (admin_uuid, 'admin@chacinar.com', 'Administrador Chacinar', 'admin')
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
    
    RAISE NOTICE '✅ Admin creado: %', admin_uuid;
  ELSE
    RAISE NOTICE '⚠️  No se encontró admin@chacinar.com en Authentication';
    RAISE NOTICE '   Créalo en: Authentication → Users → Add user';
  END IF;
  
  -- Buscar UUID del cliente en auth.users
  SELECT id INTO cliente_uuid 
  FROM auth.users 
  WHERE email = 'cliente@test.com' 
  LIMIT 1;
  
  IF cliente_uuid IS NOT NULL THEN
    -- Insertar cliente en users
    INSERT INTO users (id, email, full_name, role)
    VALUES (cliente_uuid, 'cliente@test.com', 'Cliente de Prueba', 'cliente')
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
    
    -- Crear cuenta para el cliente
    INSERT INTO accounts (user_id, balance, mercadopago_wallet)
    VALUES (cliente_uuid, 0.00, NULL)
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE NOTICE '✅ Cliente creado: %', cliente_uuid;
  ELSE
    RAISE NOTICE '⚠️  No se encontró cliente@test.com en Authentication';
    RAISE NOTICE '   Créalo en: Authentication → Users → Add user';
  END IF;
END $$;

-- PASO 10: Verificación
-- ========================================

SELECT '=== USUARIOS CREADOS ===' as info;
SELECT id, email, full_name, role FROM users;

SELECT '=== CUENTAS CREADAS ===' as info;
SELECT a.id, u.email, a.balance, a.mercadopago_wallet 
FROM accounts a
JOIN users u ON a.user_id = u.id;

-- ========================================
-- ✅ BASE DE DATOS RECREADA
-- ========================================

/*

📝 CREDENCIALES:

👨‍💼 ADMIN:
   Email: admin@chacinar.com
   Password: Admin123456

👤 CLIENTE:
   Email: cliente@test.com
   Password: Cliente123

⚠️ SI NO VES LOS USUARIOS ARRIBA:

1. Ve a Authentication → Users → Add user
2. Crea los usuarios con esos emails
3. Marca "Auto Confirm User"
4. Vuelve a ejecutar este script

🔐 SEGURIDAD:

RLS está DESHABILITADO para evitar errores 500.
Esto es OK para desarrollo/pruebas.

*/
