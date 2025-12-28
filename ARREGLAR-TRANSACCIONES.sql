-- ============================================
-- ARREGLAR TABLA TRANSACTIONS
-- Agregar columnas faltantes para balance_before y balance_after
-- ============================================

-- Agregar columnas si no existen
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS balance_before DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS balance_after DECIMAL(10, 2);

-- Verificar la estructura de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;

-- Mostrar todas las transacciones existentes
SELECT 
  id,
  account_id,
  type,
  amount,
  status,
  balance_before,
  balance_after,
  created_at,
  description
FROM transactions
ORDER BY created_at DESC;
