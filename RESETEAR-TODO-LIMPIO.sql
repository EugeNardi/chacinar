-- ============================================
-- RESETEAR TODO Y EMPEZAR LIMPIO
-- ============================================

-- 1. VER ESTADO ACTUAL
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_actual,
  COUNT(t.id) as num_transacciones
FROM users u
JOIN accounts a ON u.id = a.user_id
LEFT JOIN transactions t ON a.id = t.account_id
WHERE u.role = 'cliente'
GROUP BY u.id, u.full_name, u.email, a.balance;

-- 2. ELIMINAR TODAS LAS TRANSACCIONES DEL CLIENTE
DELETE FROM transactions
WHERE account_id IN (
  SELECT a.id FROM accounts a
  JOIN users u ON a.user_id = u.id
  WHERE u.email = 'eugenionardi06@gmail.com'
);

-- 3. ELIMINAR TODAS LAS SOLICITUDES PENDIENTES
DELETE FROM modification_requests
WHERE account_id IN (
  SELECT a.id FROM accounts a
  JOIN users u ON a.user_id = u.id
  WHERE u.email = 'eugenionardi06@gmail.com'
);

-- 4. RESETEAR EL SALDO A CERO
UPDATE accounts
SET balance = 0
WHERE user_id IN (
  SELECT id FROM users WHERE email = 'eugenionardi06@gmail.com'
);

-- 5. VERIFICAR QUE TODO ESTÁ LIMPIO
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo,
  (SELECT COUNT(*) FROM transactions WHERE account_id = a.id) as transacciones,
  (SELECT COUNT(*) FROM modification_requests WHERE account_id = a.id) as solicitudes
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.email = 'eugenionardi06@gmail.com';

-- ============================================
-- AHORA PUEDES EMPEZAR DE CERO
-- ============================================
-- El cliente tiene saldo 0
-- Cuando le cargues $50,000 desde el admin (botón SUMAR):
--   - Saldo pasa de $0 a $50,000 (debe $50,000)
-- Cuando le cargues otros $20,000 (botón SUMAR):
--   - Saldo pasa de $50,000 a $70,000 (debe $70,000)
-- Cuando el cliente pague $30,000 y lo apruebes:
--   - Saldo pasa de $70,000 a $40,000 (debe $40,000)
-- ============================================
