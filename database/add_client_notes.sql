-- Crear tabla de notas/contactos de clientes
-- Ejecutar este script en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('contact', 'reminder', 'general')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_method TEXT CHECK (contact_method IN ('whatsapp', 'phone', 'email', 'in_person', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_client_notes_user_id ON client_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_created_by ON client_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_client_notes_created_at ON client_notes(created_at DESC);

-- Comentarios en la tabla
COMMENT ON TABLE client_notes IS 'Registro de contactos, notas y recordatorios sobre clientes';
COMMENT ON COLUMN client_notes.user_id IS 'ID del cliente sobre el que se hace la nota';
COMMENT ON COLUMN client_notes.created_by IS 'ID del administrador que creó la nota';
COMMENT ON COLUMN client_notes.note_type IS 'Tipo de nota: contact (contacto realizado), reminder (recordatorio), general (nota general)';
COMMENT ON COLUMN client_notes.subject IS 'Asunto o título de la nota';
COMMENT ON COLUMN client_notes.message IS 'Contenido de la nota o descripción del contacto';
COMMENT ON COLUMN client_notes.contact_method IS 'Método de contacto usado (solo para note_type=contact)';

-- Habilitar Row Level Security
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

-- Política: Los admins pueden ver todas las notas
CREATE POLICY "Admins can view all client notes" ON client_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Política: Los admins pueden crear notas
CREATE POLICY "Admins can create client notes" ON client_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Política: Los clientes pueden ver sus propias notas
CREATE POLICY "Clients can view their own notes" ON client_notes
  FOR SELECT
  USING (user_id = auth.uid());
