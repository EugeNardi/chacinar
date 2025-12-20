-- ========================================
-- CONFIGURACIÓN DE MÉTODOS DE PAGO
-- ========================================

-- Crear tabla para configuración de métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  
  -- Mercado Pago
  mp_alias TEXT,
  mp_cvu TEXT,
  mp_enabled BOOLEAN DEFAULT false,
  
  -- Banco
  bank_name TEXT,
  bank_account_number TEXT,
  bank_cbu TEXT,
  bank_alias TEXT,
  bank_enabled BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por admin
CREATE INDEX IF NOT EXISTS idx_payment_methods_admin ON payment_methods(admin_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

SELECT '=== ✅ TABLA DE MÉTODOS DE PAGO CREADA ===' as info;

-- Verificar estructura
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payment_methods'
ORDER BY ordinal_position;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 ESTRUCTURA:

payment_methods
├── id (UUID)
├── admin_id (UUID) → Referencia a auth.users
├── mp_alias (TEXT) → Alias de Mercado Pago
├── mp_cvu (TEXT) → CVU de Mercado Pago
├── mp_enabled (BOOLEAN) → Si Mercado Pago está activo
├── bank_name (TEXT) → Nombre del banco
├── bank_account_number (TEXT) → Número de cuenta
├── bank_cbu (TEXT) → CBU del banco
├── bank_alias (TEXT) → Alias del banco
├── bank_enabled (BOOLEAN) → Si banco está activo
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

USO:

1. Admin configura métodos de pago
2. Se guarda en esta tabla
3. Los clientes ven los métodos activos
4. Pueden pagar por Mercado Pago o transferencia bancaria

EJEMPLO:

INSERT INTO payment_methods (
  admin_id,
  mp_alias,
  mp_enabled,
  bank_name,
  bank_account_number,
  bank_cbu,
  bank_enabled
) VALUES (
  'uuid-del-admin',
  'chacinar.mp',
  true,
  'Banco Nación',
  '1234567890',
  '0110123456789012345678',
  true
);

*/
