# 🚨 EJECUTA ESTO AHORA

## El Error 406 significa que la tabla `users` no existe

### ✅ Solución en 3 Pasos

---

## 1️⃣ Ir a Supabase SQL Editor

Abre este link:
```
https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/sql/new
```

---

## 2️⃣ Copiar y Pegar este SQL

Copia TODO este código y pégalo en Supabase:

```sql
-- Eliminar tablas viejas
DROP TABLE IF EXISTS modification_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Crear extensión
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  mercadopago_wallet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla transactions
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

-- Crear tabla modification_requests
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

-- Crear índices
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_modification_requests_status ON modification_requests(status);

-- Vincular usuario existente
DO $$
DECLARE
  user_uuid UUID := '72cf2ee6-1efe-4c53-a019-1c98bc64f316';
BEGIN
  -- Insertar en users
  INSERT INTO users (id, email, full_name, role)
  VALUES (user_uuid, 'admin@chacinar.com', 'Administrador', 'admin')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  
  RAISE NOTICE '✅ Usuario vinculado correctamente';
END $$;

-- Verificar
SELECT * FROM users;
```

---

## 3️⃣ Hacer Clic en "Run"

Haz clic en el botón **"Run"** en Supabase.

Deberías ver:
- ✅ Mensaje: "Usuario vinculado correctamente"
- ✅ Una fila con tu usuario

---

## 4️⃣ Recargar la Página

Ve a http://localhost:3001 y recarga la página (F5).

Ahora deberías poder iniciar sesión sin errores.

---

## ⚠️ Importante

Este SQL usa el UUID que aparece en tu error: `72cf2ee6-1efe-4c53-a019-1c98bc64f316`

Esto vinculará tu usuario de Authentication con la tabla `users`.

---

**¡Ejecuta el SQL y recarga la página! 🚀**
