-- =====================================================
-- ARREGLAR SISTEMA DE APROBACIÓN PARA ADMINISTRADORES
-- =====================================================
-- Este script elimina y recrea las políticas y funciones
-- para evitar errores de duplicados
-- =====================================================

-- 1. Eliminar políticas existentes de admin_approval_requests
DROP POLICY IF EXISTS "Approved admins can view all approval requests" ON admin_approval_requests;
DROP POLICY IF EXISTS "Approved admins can update approval requests" ON admin_approval_requests;
DROP POLICY IF EXISTS "Users can view their own approval request" ON admin_approval_requests;
DROP POLICY IF EXISTS "System can create approval requests" ON admin_approval_requests;

-- 2. Eliminar políticas existentes de users
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Approved admins can view all users" ON users;

-- 3. Eliminar políticas existentes de accounts
DROP POLICY IF EXISTS "Admins can view all accounts" ON accounts;
DROP POLICY IF EXISTS "Approved admins can view all accounts" ON accounts;
DROP POLICY IF EXISTS "Admins can create accounts" ON accounts;
DROP POLICY IF EXISTS "Approved admins can create accounts" ON accounts;
DROP POLICY IF EXISTS "Admins can update all accounts" ON accounts;
DROP POLICY IF EXISTS "Approved admins can update all accounts" ON accounts;

-- 4. Eliminar políticas existentes de transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Approved admins can view all transactions" ON transactions;

-- 5. Eliminar políticas existentes de modification_requests
DROP POLICY IF EXISTS "Admins can view all requests" ON modification_requests;
DROP POLICY IF EXISTS "Approved admins can view all requests" ON modification_requests;

-- 6. Recrear políticas RLS para admin_approval_requests
CREATE POLICY "Approved admins can view all approval requests" ON admin_approval_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

CREATE POLICY "Approved admins can update approval requests" ON admin_approval_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

CREATE POLICY "Users can view their own approval request" ON admin_approval_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create approval requests" ON admin_approval_requests
  FOR INSERT WITH CHECK (true);

-- 7. Recrear política de users
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

-- 8. Recrear políticas de accounts
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

CREATE POLICY "Approved admins can create accounts" ON accounts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

CREATE POLICY "Approved admins can update all accounts" ON accounts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approved = true
    )
  );

-- 9. Recrear política de transactions
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

-- 10. Recrear política de modification_requests
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

-- 11. Recrear función para aprobar administrador
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

-- 12. Recrear función para rechazar administrador
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

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Ejecuta PRIMERO: AGREGAR-UPDATED-AT.sql
-- 2. Ejecuta DESPUÉS: este script (ARREGLAR-APROBACION-ADMINS.sql)
-- =====================================================
