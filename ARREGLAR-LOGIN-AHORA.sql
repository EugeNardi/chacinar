-- ========================================
-- ARREGLAR LOGIN - EJECUTA ESTO AHORA
-- ========================================

-- PASO 1: Eliminar tablas viejas
DROP TABLE IF EXISTS modification_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- PASO 2: Crear extensión
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PASO 3: Crear tabla users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 4: Crear tabla accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  mercadopago_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 5: Crear tabla transactions
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
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_modification_requests_status ON modification_requests(status);

-- PASO 8: Vincular tu usuario actual (UUID del error)
INSERT INTO users (id, email, full_name, role)
VALUES (
  '72cf2ee6-1efe-4c53-a019-1c98bc64f316',
  'admin@chacinar.com',
  'Administrador Principal',
  'admin'
);

-- PASO 9: Crear algunos clientes de ejemplo
DO $$
DECLARE
  cliente1_id UUID := uuid_generate_v4();
  cliente2_id UUID := uuid_generate_v4();
  cliente3_id UUID := uuid_generate_v4();
BEGIN
  -- Cliente 1
  INSERT INTO users (id, email, full_name, role)
  VALUES (cliente1_id, 'juan.perez@email.com', 'Juan Pérez', 'cliente');
  
  INSERT INTO accounts (user_id, balance, mercadopago_wallet)
  VALUES (cliente1_id, 15000.00, 'juan.perez.mp');
  
  -- Cliente 2
  INSERT INTO users (id, email, full_name, role)
  VALUES (cliente2_id, 'maria.gomez@email.com', 'María Gómez', 'cliente');
  
  INSERT INTO accounts (user_id, balance, mercadopago_wallet)
  VALUES (cliente2_id, 8500.50, 'maria.gomez.mp');
  
  -- Cliente 3
  INSERT INTO users (id, email, full_name, role)
  VALUES (cliente3_id, 'carlos.rodriguez@email.com', 'Carlos Rodríguez', 'cliente');
  
  INSERT INTO accounts (user_id, balance, mercadopago_wallet)
  VALUES (cliente3_id, 0.00, NULL);
  
  RAISE NOTICE '✅ Clientes de ejemplo creados';
END $$;

-- PASO 10: Crear transacciones de ejemplo
DO $$
DECLARE
  admin_id UUID := '72cf2ee6-1efe-4c53-a019-1c98bc64f316';
  cuenta1_id UUID;
  cuenta2_id UUID;
BEGIN
  -- Obtener IDs de cuentas
  SELECT id INTO cuenta1_id FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email = 'juan.perez@email.com');
  SELECT id INTO cuenta2_id FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email = 'maria.gomez@email.com');
  
  -- Transacciones para Juan
  INSERT INTO transactions (account_id, type, amount, description, status, created_by, approved_by, approved_at)
  VALUES 
    (cuenta1_id, 'cargo', 10000.00, 'Compra inicial', 'aprobado', admin_id, admin_id, NOW() - INTERVAL '10 days'),
    (cuenta1_id, 'cargo', 5000.00, 'Compra adicional', 'aprobado', admin_id, admin_id, NOW() - INTERVAL '5 days');
  
  -- Transacciones para María
  INSERT INTO transactions (account_id, type, amount, description, status, created_by, approved_by, approved_at)
  VALUES 
    (cuenta2_id, 'cargo', 8500.50, 'Compra de productos', 'aprobado', admin_id, admin_id, NOW() - INTERVAL '7 days');
  
  RAISE NOTICE '✅ Transacciones de ejemplo creadas';
END $$;

-- VERIFICACIÓN FINAL
SELECT '=== USUARIOS ===' as info;
SELECT id, email, full_name, role FROM users ORDER BY role, full_name;

SELECT '=== CUENTAS ===' as info;
SELECT u.full_name, a.balance, a.mercadopago_wallet 
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY u.full_name;

SELECT '=== TRANSACCIONES ===' as info;
SELECT COUNT(*) as total_transacciones FROM transactions;

-- ✅ LISTO! Ahora puedes iniciar sesión
