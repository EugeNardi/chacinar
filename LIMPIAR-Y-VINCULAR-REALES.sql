-- ========================================
-- LIMPIAR CLIENTES FALSOS Y VINCULAR USUARIOS REALES
-- Ejecuta esto en Supabase SQL Editor
-- ========================================

-- PASO 1: Eliminar todos los datos falsos
-- ========================================

DELETE FROM modification_requests;
DELETE FROM transactions;
DELETE FROM accounts;
DELETE FROM users;

-- PASO 2: Vincular tus usuarios reales de Authentication
-- ========================================

DO $$
DECLARE
  user_record RECORD;
  account_id UUID;
BEGIN
  -- Recorrer TODOS los usuarios de auth.users
  FOR user_record IN 
    SELECT id, email 
    FROM auth.users 
    ORDER BY created_at
  LOOP
    -- Insertar en la tabla users
    -- El primer usuario será admin, los demás clientes
    INSERT INTO users (id, email, full_name, role)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(
        (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = user_record.id),
        split_part(user_record.email, '@', 1)  -- Usar parte del email como nombre
      ),
      CASE 
        WHEN user_record.email LIKE '%admin%' THEN 'admin'
        ELSE 'cliente'
      END
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
    
    -- Si es cliente, crear su cuenta
    IF user_record.email NOT LIKE '%admin%' THEN
      INSERT INTO accounts (user_id, balance, mercadopago_wallet)
      VALUES (user_record.id, 0.00, NULL)
      ON CONFLICT (user_id) DO NOTHING;
      
      RAISE NOTICE '✅ Cliente vinculado: % (ID: %)', user_record.email, user_record.id;
    ELSE
      RAISE NOTICE '✅ Admin vinculado: % (ID: %)', user_record.email, user_record.id;
    END IF;
  END LOOP;
END $$;

-- PASO 3: Verificar usuarios vinculados
-- ========================================

SELECT '=== USUARIOS VINCULADOS ===' as info;

SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  CASE WHEN a.id IS NOT NULL THEN '✅ Tiene cuenta' ELSE '❌ Sin cuenta' END as cuenta_status
FROM users u
LEFT JOIN accounts a ON a.user_id = u.id
ORDER BY u.role DESC, u.email;

SELECT '=== CUENTAS CREADAS ===' as info;

SELECT 
  u.email,
  u.full_name,
  a.balance,
  a.mercadopago_wallet
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY u.email;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 RESULTADO:

Ahora en el panel de admin verás SOLO tus usuarios reales:
- Tu cuenta de admin
- Tu cuenta de cliente

Ambas están conectadas a Authentication y funcionan completamente.

🔗 CÓMO FUNCIONA:

1. Admin carga saldo al cliente → Se actualiza en la base de datos
2. Cliente inicia sesión → Ve su saldo actualizado
3. Cliente puede:
   - Ver QR de Mercado Pago para pagar
   - Solicitar modificaciones (que el admin debe aprobar)
   - Ver su historial de transacciones

4. Admin puede:
   - Ver todos los clientes reales
   - Cargar/descargar saldo
   - Configurar Mercado Pago para cada cliente
   - Aprobar/rechazar solicitudes

⚠️ IMPORTANTE:

Si quieres agregar más clientes:
1. Ve a Authentication → Users → Add user
2. Crea el usuario con su email y password
3. Marca "Auto Confirm User"
4. Vuelve a ejecutar este SQL para vincularlo

O simplemente usa el registro desde la app (botón "Registrarse")

*/
