-- ============================================
-- VERIFICAR Y ARREGLAR PERMISOS DE TRANSACCIONES
-- ============================================

-- 1. Ver todas las transacciones existentes
SELECT 
  t.id,
  t.account_id,
  t.type,
  t.amount,
  t.status,
  t.description,
  t.balance_before,
  t.balance_after,
  t.created_at,
  u.full_name as cliente,
  a.balance as saldo_actual
FROM transactions t
LEFT JOIN accounts a ON t.account_id = a.id
LEFT JOIN users u ON a.user_id = u.id
ORDER BY t.created_at DESC;

-- 2. Verificar políticas RLS existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'transactions';

-- 3. ELIMINAR políticas antiguas que puedan estar causando problemas
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can insert all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete all transactions" ON transactions;

-- 4. CREAR políticas correctas para transacciones

-- Los clientes pueden VER sus propias transacciones
CREATE POLICY "Clientes pueden ver sus transacciones"
ON transactions FOR SELECT
TO authenticated
USING (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);

-- Los admins pueden VER todas las transacciones
CREATE POLICY "Admins pueden ver todas las transacciones"
ON transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Los admins pueden INSERTAR transacciones
CREATE POLICY "Admins pueden crear transacciones"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Los clientes pueden INSERTAR sus propias transacciones (para solicitudes)
CREATE POLICY "Clientes pueden crear sus transacciones"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);

-- Los admins pueden ACTUALIZAR transacciones
CREATE POLICY "Admins pueden actualizar transacciones"
ON transactions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Los admins pueden ELIMINAR transacciones
CREATE POLICY "Admins pueden eliminar transacciones"
ON transactions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Asegurarse de que RLS esté habilitado
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 6. Verificar que las políticas se crearon correctamente
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'transactions'
ORDER BY policyname;

-- 7. Mostrar resumen de transacciones por cliente
SELECT 
  u.full_name as cliente,
  u.email,
  COUNT(t.id) as total_transacciones,
  SUM(CASE WHEN t.type = 'cargo' THEN t.amount ELSE 0 END) as total_cargos,
  SUM(CASE WHEN t.type = 'pago' THEN t.amount ELSE 0 END) as total_pagos,
  a.balance as saldo_actual
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id
LEFT JOIN transactions t ON a.id = t.account_id
WHERE u.role = 'cliente'
GROUP BY u.id, u.full_name, u.email, a.balance
ORDER BY u.full_name;
