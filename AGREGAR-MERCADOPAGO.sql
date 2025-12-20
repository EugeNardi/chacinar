-- ========================================
-- AGREGAR CAMPO DE MERCADO PAGO
-- Ejecuta esto si ya tienes la base de datos creada
-- ========================================

-- Agregar columna para billetera de Mercado Pago
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS mercadopago_wallet TEXT;

-- Actualizar política para que admin pueda modificar la billetera
-- (Ya existe la política de UPDATE para admin, no necesita cambios)

-- ✅ Listo! Ahora puedes configurar la billetera de Mercado Pago desde el panel de admin
