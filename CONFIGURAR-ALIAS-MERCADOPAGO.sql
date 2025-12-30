-- ============================================
-- CONFIGURAR ALIAS DE MERCADO PAGO
-- ============================================
-- Este script configura el alias de Mercado Pago para todas las cuentas
-- para que los clientes puedan ver las opciones de pago

-- 1. Verificar si la columna existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'accounts' 
AND column_name = 'mercadopago_wallet';

-- 2. Si NO existe, crearla (ejecutar solo si el paso 1 no devuelve resultados)
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS mercadopago_wallet TEXT;

-- 3. Configurar el alias para todas las cuentas
UPDATE accounts 
SET mercadopago_wallet = 'sebastiannardi.mp'
WHERE mercadopago_wallet IS NULL OR mercadopago_wallet = '';

-- 4. Verificar que se aplicó correctamente
SELECT 
  a.id,
  u.full_name,
  u.email,
  a.mercadopago_wallet,
  a.balance
FROM accounts a
JOIN users u ON a.user_id = u.id
WHERE u.role = 'cliente';

-- ============================================
-- RESULTADO ESPERADO:
-- Todas las cuentas de clientes deberían tener 
-- mercadopago_wallet = 'sebastiannardi.mp'
-- ============================================
