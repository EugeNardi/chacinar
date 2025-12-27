-- Agregar campo de teléfono a la tabla users
-- Ejecutar este script en Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Crear índice para búsquedas por teléfono (opcional pero recomendado)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Comentario en la columna
COMMENT ON COLUMN users.phone IS 'Número de teléfono del cliente para mensajes automáticos de WhatsApp. Formato: solo números sin espacios (ej: 3467494443)';
