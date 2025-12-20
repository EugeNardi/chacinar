-- ========================================
-- AGREGAR SISTEMA DE NOTIFICACIONES
-- ========================================

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  related_transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Deshabilitar RLS
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

SELECT '=== ✅ TABLA DE NOTIFICACIONES CREADA ===' as info;

-- Ver estado
SELECT 
  (SELECT COUNT(*) FROM notifications) as total_notificaciones,
  (SELECT COUNT(*) FROM notifications WHERE read = false) as no_leidas;

-- ========================================
-- ✅ LISTO!
-- ========================================

/*

📝 CÓMO FUNCIONA:

1. Cuando el admin crea una boleta → Se crea una notificación para el cliente
2. Cuando el admin actualiza el saldo → Se crea una notificación para el cliente
3. El cliente ve las notificaciones en su panel
4. El cliente puede marcarlas como leídas

TIPOS DE NOTIFICACIONES:

- 'info' → Información general (azul)
- 'success' → Operación exitosa (verde)
- 'warning' → Advertencia (amarillo)
- 'error' → Error (rojo)

EJEMPLO:

INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'uuid-del-cliente',
  'Nueva boleta',
  'Se agregó una boleta de $5,000 a tu cuenta',
  'info'
);

*/
