-- =====================================================
-- SISTEMA DE APROBACIÓN PARA ADMINISTRADORES
-- =====================================================
-- Este script agrega un sistema de aprobación para que
-- nuevos administradores requieran autorización de
-- administradores existentes antes de poder acceder.
-- =====================================================

-- 1. Agregar campo 'approved' a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- 2. Agregar campo 'approved_by' para rastrear quién aprobó
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);

-- 3. Agregar campo 'approved_at' para rastrear cuándo fue aprobado
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 4. Crear tabla para solicitudes de aprobación de administradores
CREATE TABLE IF NOT EXISTS admin_approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendiente', 'aprobado', 'rechazado')) DEFAULT 'pendiente',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_admin_approval_requests_user_id ON admin_approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_approval_requests_status ON admin_approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_users_approved ON users(approved) WHERE role = 'admin';

-- 6. Marcar todos los administradores existentes como aprobados
UPDATE users 
SET approved = true, 
    approved_at = NOW()
WHERE role = 'admin' AND approved IS NULL;

-- 7. Los clientes siempre están aprobados automáticamente
UPDATE users 
SET approved = true, 
    approved_at = NOW()
WHERE role = 'cliente' AND approved IS NULL;

-- 8. Habilitar RLS en la nueva tabla
ALTER TABLE admin_approval_requests ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para admin_approval_requests
-- Solo admins aprobados pueden ver solicitudes
CREATE POLICY "Approved admins can view all approval requests" ON admin_approval_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- Solo admins aprobados pueden aprobar/rechazar
CREATE POLICY "Approved admins can update approval requests" ON admin_approval_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- Los usuarios pueden ver su propia solicitud
CREATE POLICY "Users can view their own approval request" ON admin_approval_requests
  FOR SELECT USING (user_id = auth.uid());

-- Sistema puede crear solicitudes (para el proceso de registro)
CREATE POLICY "System can create approval requests" ON admin_approval_requests
  FOR INSERT WITH CHECK (true);

-- 10. Actualizar política de users para que solo admins aprobados puedan ver todos los usuarios
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Approved admins can view all users" ON users
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- 11. Actualizar política de accounts para que solo admins aprobados puedan gestionar cuentas
DROP POLICY IF EXISTS "Admins can view all accounts" ON accounts;
CREATE POLICY "Approved admins can view all accounts" ON accounts
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;
CREATE POLICY "Approved admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

DROP POLICY IF EXISTS "Admins can update all accounts" ON accounts;
CREATE POLICY "Approved admins can update all accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- 12. Actualizar política de transactions para que solo admins aprobados puedan gestionar transacciones
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Approved admins can view all transactions" ON transactions
  FOR ALL USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- 13. Actualizar política de modification_requests
DROP POLICY IF EXISTS "Admins can view all requests" ON modification_requests;
CREATE POLICY "Approved admins can view all requests" ON modification_requests
  FOR ALL USING (
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- 14. Crear función para aprobar administrador
CREATE OR REPLACE FUNCTION approve_admin(
  p_user_id UUID,
  p_approved_by UUID
) RETURNS void AS $$
BEGIN
  -- Verificar que quien aprueba es un admin aprobado
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_approved_by 
    AND role = 'admin' 
    AND approved = true
  ) THEN
    RAISE EXCEPTION 'Solo administradores aprobados pueden aprobar nuevos administradores';
  END IF;

  -- Actualizar usuario
  UPDATE users 
  SET approved = true,
      approved_by = p_approved_by,
      approved_at = NOW(),
      updated_at = NOW()
  WHERE id = p_user_id AND role = 'admin';

  -- Actualizar solicitud
  UPDATE admin_approval_requests
  SET status = 'aprobado',
      reviewed_by = p_approved_by,
      reviewed_at = NOW(),
      updated_at = NOW()
  WHERE user_id = p_user_id AND status = 'pendiente';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Crear función para rechazar administrador
CREATE OR REPLACE FUNCTION reject_admin(
  p_user_id UUID,
  p_rejected_by UUID,
  p_reason TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Verificar que quien rechaza es un admin aprobado
  IF NOT EXISTS (
    SELECT 1 FROM users 
    WHERE id = p_rejected_by 
    AND role = 'admin' 
    AND approved = true
  ) THEN
    RAISE EXCEPTION 'Solo administradores aprobados pueden rechazar solicitudes';
  END IF;

  -- Actualizar solicitud
  UPDATE admin_approval_requests
  SET status = 'rechazado',
      reviewed_by = p_rejected_by,
      reviewed_at = NOW(),
      rejection_reason = p_reason,
      updated_at = NOW()
  WHERE user_id = p_user_id AND status = 'pendiente';

  -- Eliminar usuario rechazado
  DELETE FROM users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Crear vista para solicitudes pendientes con información completa
CREATE OR REPLACE VIEW pending_admin_requests AS
SELECT 
  aar.id,
  aar.user_id,
  aar.email,
  aar.full_name,
  aar.status,
  aar.requested_at,
  aar.reviewed_by,
  aar.reviewed_at,
  aar.rejection_reason,
  u.created_at as user_created_at
FROM admin_approval_requests aar
LEFT JOIN users u ON u.id = aar.user_id
WHERE aar.status = 'pendiente'
ORDER BY aar.requested_at DESC;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- =====================================================
-- 1. Ejecuta este script en tu base de datos Supabase
-- 2. Los administradores existentes quedarán automáticamente aprobados
-- 3. Nuevos registros de admin quedarán pendientes de aprobación
-- 4. Solo administradores aprobados pueden aprobar/rechazar solicitudes
-- 5. Administradores no aprobados no pueden acceder al panel admin
-- =====================================================
