-- ⚠️ SOLUCIÓN AL ERROR 429: CREAR USUARIO MANUALMENTE
-- Ejecuta este script en Supabase SQL Editor

-- PASO 1: Primero crea el usuario en Authentication
-- Ve a: Authentication → Users → Add user
-- Email: admin@chacinar.com
-- Password: Admin123456
-- Copia el UUID que se genera

-- PASO 2: Reemplaza 'UUID-DEL-USUARIO' con el UUID que copiaste
-- y ejecuta este SQL:

INSERT INTO users (id, email, full_name, role)
VALUES (
  'UUID-DEL-USUARIO',  -- ← Reemplaza esto con el UUID real
  'admin@chacinar.com',
  'Administrador Chacinar',
  'admin'
);

-- PASO 3 (OPCIONAL): Si quieres crear un cliente de prueba
-- Primero crea el usuario en Authentication con:
-- Email: cliente@test.com
-- Password: Cliente123
-- Luego ejecuta:

INSERT INTO users (id, email, full_name, role)
VALUES (
  'UUID-DEL-CLIENTE',  -- ← Reemplaza con el UUID del cliente
  'cliente@test.com',
  'Cliente de Prueba',
  'cliente'
);

-- Crear cuenta corriente para el cliente
INSERT INTO accounts (user_id, balance)
VALUES (
  'UUID-DEL-CLIENTE',  -- ← Mismo UUID del cliente
  0.00
);

-- ✅ LISTO! Ahora puedes iniciar sesión con:
-- Admin: admin@chacinar.com / Admin123456
-- Cliente: cliente@test.com / Cliente123
