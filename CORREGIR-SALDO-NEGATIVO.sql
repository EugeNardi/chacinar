-- ============================================
-- CORREGIR SALDO NEGATIVO Y RECALCULAR
-- ============================================

-- 1. Ver el estado actual
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_actual,
  (
    SELECT COUNT(*) 
    FROM transactions t 
    WHERE t.account_id = a.id AND t.status = 'aprobado'
  ) as total_transacciones
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.role = 'cliente'
ORDER BY u.full_name;

-- 2. Ver todas las transacciones del cliente con saldo negativo
SELECT 
  u.full_name,
  t.type,
  t.amount,
  t.balance_before,
  t.balance_after,
  t.created_at,
  t.description
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
WHERE a.balance < 0
ORDER BY u.full_name, t.created_at;

-- 3. RECALCULAR todos los saldos basados en transacciones
-- Esto corrige cualquier inconsistencia
UPDATE accounts a
SET balance = COALESCE((
  SELECT SUM(
    CASE 
      WHEN t.type = 'cargo' THEN t.amount 
      WHEN t.type = 'pago' THEN -t.amount 
      ELSE 0 
    END
  )
  FROM transactions t
  WHERE t.account_id = a.id 
    AND t.status = 'aprobado'
), 0);

-- 4. Verificar que se corrigieron los saldos
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_corregido,
  (
    SELECT SUM(CASE WHEN t.type = 'cargo' THEN t.amount ELSE 0 END)
    FROM transactions t 
    WHERE t.account_id = a.id AND t.status = 'aprobado'
  ) as total_cargos,
  (
    SELECT SUM(CASE WHEN t.type = 'pago' THEN t.amount ELSE 0 END)
    FROM transactions t 
    WHERE t.account_id = a.id AND t.status = 'aprobado'
  ) as total_pagos
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.role = 'cliente'
ORDER BY u.full_name;

-- 5. Mostrar resumen final
SELECT 
  COUNT(*) as total_clientes,
  SUM(a.balance) as deuda_total,
  AVG(a.balance) as promedio_por_cliente,
  MAX(a.balance) as deuda_maxima,
  MIN(a.balance) as deuda_minima
FROM accounts a
JOIN users u ON a.user_id = u.id
WHERE u.role = 'cliente';
