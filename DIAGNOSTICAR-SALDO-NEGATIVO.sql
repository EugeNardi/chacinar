-- ============================================
-- DIAGNOSTICAR PROBLEMA DE SALDO NEGATIVO
-- ============================================

-- 1. Ver el historial completo del cliente eugenio2
SELECT 
  t.id,
  t.type,
  t.amount,
  t.status,
  t.description,
  t.balance_before,
  t.balance_after,
  t.created_at,
  t.approved_at
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
WHERE u.email = 'eugenionardi06@gmail.com'
ORDER BY t.created_at ASC;

-- 2. Ver el saldo actual de la cuenta
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_actual,
  a.created_at as cuenta_creada
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.email = 'eugenionardi06@gmail.com';

-- 3. Calcular el saldo correcto basado en transacciones
SELECT 
  u.full_name,
  u.email,
  SUM(CASE WHEN t.type = 'cargo' THEN t.amount ELSE 0 END) as total_cargos,
  SUM(CASE WHEN t.type = 'pago' THEN t.amount ELSE 0 END) as total_pagos,
  SUM(CASE WHEN t.type = 'cargo' THEN t.amount ELSE -t.amount END) as saldo_calculado,
  a.balance as saldo_en_db
FROM users u
JOIN accounts a ON u.id = a.user_id
LEFT JOIN transactions t ON a.id = t.account_id AND t.status = 'aprobado'
WHERE u.email = 'eugenionardi06@gmail.com'
GROUP BY u.full_name, u.email, a.balance;

-- 4. Ver solicitudes de modificación
SELECT 
  mr.id,
  mr.type,
  mr.amount,
  mr.status,
  mr.description,
  mr.created_at,
  mr.reviewed_at,
  u.full_name as solicitante
FROM modification_requests mr
JOIN accounts a ON mr.account_id = a.id
JOIN users u ON a.user_id = u.id
WHERE u.email = 'eugenionardi06@gmail.com'
ORDER BY mr.created_at DESC;

-- ============================================
-- SOLUCIÓN: CORREGIR EL SALDO
-- ============================================

-- Opción 1: Si el saldo debería ser 0 (todas las deudas pagadas)
UPDATE accounts
SET balance = 0
WHERE user_id IN (
  SELECT id FROM users WHERE email = 'eugenionardi06@gmail.com'
);

-- Opción 2: Recalcular el saldo basado en transacciones
UPDATE accounts a
SET balance = COALESCE((
  SELECT SUM(CASE WHEN t.type = 'cargo' THEN t.amount ELSE -t.amount END)
  FROM transactions t
  WHERE t.account_id = a.id AND t.status = 'aprobado'
), 0)
WHERE a.user_id IN (
  SELECT id FROM users WHERE email = 'eugenionardi06@gmail.com'
);

-- Verificar el resultado
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_corregido
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.email = 'eugenionardi06@gmail.com';
