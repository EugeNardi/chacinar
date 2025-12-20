-- ========================================
-- AGREGAR CÓDIGOS DE VINCULACIÓN
-- ========================================

-- Agregar columna para código de vinculación en accounts
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS link_code TEXT UNIQUE;

-- Agregar índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_accounts_link_code ON accounts(link_code);

-- Función para generar código único de 4 dígitos
CREATE OR REPLACE FUNCTION generate_link_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generar código aleatorio de 4 dígitos
    new_code := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM accounts WHERE link_code = new_code) INTO code_exists;
    
    -- Si no existe, salir del loop
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Generar códigos para cuentas existentes que no tienen
UPDATE accounts 
SET link_code = generate_link_code() 
WHERE link_code IS NULL;

-- Trigger para generar código automáticamente al crear cuenta
CREATE OR REPLACE FUNCTION auto_generate_link_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.link_code IS NULL THEN
    NEW.link_code := generate_link_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_generate_link_code ON accounts;
CREATE TRIGGER trigger_auto_generate_link_code
  BEFORE INSERT ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_link_code();

SELECT '=== ✅ CÓDIGOS DE VINCULACIÓN AGREGADOS ===' as info;

-- Ver códigos generados
SELECT 
  u.full_name,
  u.email,
  a.link_code,
  a.balance
FROM accounts a
LEFT JOIN users u ON u.id = a.user_id
ORDER BY a.created_at DESC;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 CÓMO FUNCIONA:

1. Cada cuenta tiene un código único de 4 dígitos (ej: 1234)
2. El admin puede ver el código de cada cliente
3. El cliente puede usar ese código para vincular su cuenta
4. Se genera automáticamente al crear una cuenta

EJEMPLO DE USO:

-- Buscar cuenta por código
SELECT * FROM accounts WHERE link_code = '1234';

-- Vincular cuenta con usuario
UPDATE accounts 
SET user_id = 'uuid-del-nuevo-usuario'
WHERE link_code = '1234';

*/
