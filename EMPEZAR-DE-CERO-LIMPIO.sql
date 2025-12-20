-- ========================================
-- EMPEZAR DE CERO - SISTEMA LIMPIO
-- ========================================
-- Este script borra TODO y empieza de nuevo
-- ========================================

-- PASO 1: BORRAR TODO
DROP TABLE IF EXISTS modification_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

SELECT '=== ✅ TABLAS ELIMINADAS ===' as info;

-- PASO 2: CREAR TABLAS NUEVAS
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  mercadopago_wallet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('cargo', 'pago')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_modification_requests_status ON modification_requests(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

SELECT '=== ✅ TABLAS CREADAS ===' as info;

-- PASO 3: DESHABILITAR RLS (para evitar errores)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE modification_requests DISABLE ROW LEVEL SECURITY;

SELECT '=== ✅ RLS DESHABILITADO ===' as info;

-- PASO 4: Ver estado actual
SELECT '=== ESTADO ACTUAL ===' as info;
SELECT 
  (SELECT COUNT(*) FROM users) as total_usuarios,
  (SELECT COUNT(*) FROM users WHERE role = 'admin') as admins,
  (SELECT COUNT(*) FROM users WHERE role = 'cliente') as clientes;

-- ========================================
-- ✅ BASE DE DATOS LIMPIA Y LISTA
-- ========================================

/*

📝 PRÓXIMOS PASOS:

1. ✅ Ejecuta este SQL en Supabase
2. ✅ Ve a Authentication en Supabase
3. ✅ ELIMINA TODOS LOS USUARIOS de Authentication
4. ✅ Reinicia el servidor: npm run dev
5. ✅ Ve a http://localhost:3000
6. ✅ Clic en "Crear cuenta"
7. ✅ Selecciona "ADMINISTRADOR"
8. ✅ Regístrate con tu email
9. ✅ Confirma el email
10. ✅ Inicia sesión

IMPORTANTE:

- La PRIMERA cuenta que crees debe ser ADMINISTRADOR
- Después puedes crear 1 o 2 cuentas más de ADMINISTRADOR
- El resto de cuentas se crean como CLIENTE
- Los clientes solo ven su saldo
- Los admins ven TODO

ELIMINAR USUARIOS DE AUTHENTICATION:

1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/auth/users
2. Selecciona todos los usuarios
3. Haz clic en "Delete users"
4. Confirma

Esto asegura que empiezas completamente de cero.

*/
