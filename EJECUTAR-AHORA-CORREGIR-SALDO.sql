-- ============================================
-- EJECUTAR AHORA - CORREGIR SALDO INMEDIATAMENTE
-- ============================================

-- 1. VER LAS 4 TRANSACCIONES DEL CLIENTE
SELECT 
  t.id,
  t.type,
  t.amount,
  t.status,
  t.balance_before,
  t.balance_after,
  t.created_at,
  t.description
FROM transactions t
WHERE t.account_id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47'
ORDER BY t.created_at ASC;

-- 2. RECALCULAR EL SALDO CORRECTO
-- Fórmula: CARGOS (suman) - PAGOS (restan) = SALDO
UPDATE accounts
SET balance = COALESCE((
  SELECT SUM(
    CASE 
      WHEN t.type = 'cargo' THEN t.amount 
      WHEN t.type = 'pago' THEN -t.amount 
      ELSE 0 
    END
  )
  FROM transactions t
  WHERE t.account_id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47'
    AND t.status = 'aprobado'
), 0)
WHERE id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47';

-- 3. VERIFICAR EL SALDO CORREGIDO
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_corregido,
  (
    SELECT SUM(amount) 
    FROM transactions 
    WHERE account_id = a.id AND type = 'cargo' AND status = 'aprobado'
  ) as total_cargos,
  (
    SELECT SUM(amount) 
    FROM transactions 
    WHERE account_id = a.id AND type = 'pago' AND status = 'aprobado'
  ) as total_pagos
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE a.id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47';

-- 4. MOSTRAR TODAS LAS TRANSACCIONES CON DETALLE
SELECT 
  CASE WHEN t.type = 'cargo' THEN '📕 CARGO' ELSE '💰 PAGO' END as tipo,
  t.amount as monto,
  t.balance_before as saldo_antes,
  t.balance_after as saldo_despues,
  TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI') as fecha_hora,
  t.description as descripcion
FROM transactions t
WHERE t.account_id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47'
ORDER BY t.created_at ASC;
