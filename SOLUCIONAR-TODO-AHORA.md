# 🔧 SOLUCIONAR TODOS LOS PROBLEMAS - GUÍA COMPLETA

## 🔴 Problemas Identificados

1. ✅ **Botón "Restar" funciona correctamente** - El código está bien
2. ❌ **Saldo negativo (-$140,000)** - Necesita recalcularse
3. ❌ **Historial no aparece** - Permisos RLS
4. ❌ **Límite de emails** - Configuración de Supabase

---

## 📋 PASO 1: Resetear y Limpiar Todo

### Ejecuta este SQL en Supabase:

```sql
-- 1. Ver estado actual
SELECT 
  u.full_name,
  u.email,
  a.balance as saldo_actual,
  COUNT(t.id) as num_transacciones
FROM users u
JOIN accounts a ON u.id = a.user_id
LEFT JOIN transactions t ON a.id = t.account_id
WHERE u.email = 'eugenionardi06@gmail.com'
GROUP BY u.id, u.full_name, u.email, a.balance;

-- 2. ELIMINAR todas las transacciones del cliente
DELETE FROM transactions
WHERE account_id IN (
  SELECT a.id FROM accounts a
  JOIN users u ON a.user_id = u.id
  WHERE u.email = 'eugenionardi06@gmail.com'
);

-- 3. ELIMINAR todas las solicitudes pendientes
DELETE FROM modification_requests
WHERE account_id IN (
  SELECT a.id FROM accounts a
  JOIN users u ON a.user_id = u.id
  WHERE u.email = 'eugenionardi06@gmail.com'
);

-- 4. RESETEAR el saldo a CERO
UPDATE accounts
SET balance = 0
WHERE user_id IN (
  SELECT id FROM users WHERE email = 'eugenionardi06@gmail.com'
);

-- 5. Verificar que está limpio
SELECT 
  u.full_name,
  a.balance,
  (SELECT COUNT(*) FROM transactions WHERE account_id = a.id) as transacciones
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.email = 'eugenionardi06@gmail.com';
```

**Resultado esperado:** Saldo = 0, Transacciones = 0

---

## 📋 PASO 2: Configurar Permisos RLS Correctamente

```sql
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can insert all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can update all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete all transactions" ON transactions;
DROP POLICY IF EXISTS "Clientes pueden ver sus transacciones" ON transactions;
DROP POLICY IF EXISTS "Admins pueden ver todas las transacciones" ON transactions;
DROP POLICY IF EXISTS "Admins pueden crear transacciones" ON transactions;
DROP POLICY IF EXISTS "Clientes pueden crear sus transacciones" ON transactions;
DROP POLICY IF EXISTS "Admins pueden actualizar transacciones" ON transactions;
DROP POLICY IF EXISTS "Admins pueden eliminar transacciones" ON transactions;

-- Crear políticas correctas
CREATE POLICY "Clientes ven sus transacciones"
ON transactions FOR SELECT
TO authenticated
USING (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins ven todas"
ON transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins crean transacciones"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Clientes crean solicitudes"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins actualizan"
ON transactions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins eliminan"
ON transactions FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Habilitar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

---

## 📋 PASO 3: Configurar Emails Sin Límite

### En Supabase Dashboard:

1. Ve a **Authentication** → **Settings**
2. Busca **"Rate Limits"**
3. Cambia de 4 a **50** emails por hora
4. O desactiva **"Enable email confirmations"** para desarrollo
5. Guarda cambios

---

## 🧪 PASO 4: Probar el Sistema

### Prueba 1: Cargar Saldo (Botón SUMAR)
1. Admin → Selecciona cliente eugenio2
2. Clic en **"Sumar"**
3. Ingresa **$50,000**
4. Descripción: "Primera compra"
5. Confirmar

**Resultado esperado:**
- Saldo del cliente: $50,000
- Historial muestra: "Cargo - $50,000 - [fecha/hora]"

### Prueba 2: Cargar Más Saldo
1. Clic en **"Sumar"** nuevamente
2. Ingresa **$20,000**
3. Descripción: "Segunda compra"
4. Confirmar

**Resultado esperado:**
- Saldo del cliente: $70,000
- Historial muestra 2 transacciones

### Prueba 3: Cliente Solicita Pago
1. Cliente → Clic en **"Notificar Pago Realizado"**
2. Ingresa **$30,000**
3. Descripción: "Pago en efectivo"
4. Enviar solicitud

**Resultado esperado:**
- Solicitud aparece en panel de admin
- Saldo del cliente sigue en $70,000 (aún no aprobado)

### Prueba 4: Admin Aprueba Pago
1. Admin → Solicitudes pendientes
2. Clic en **"Aprobar"** la solicitud de $30,000

**Resultado esperado:**
- Saldo del cliente: $40,000 (era $70,000 - $30,000)
- Historial muestra: "Pago - $30,000 - [fecha/hora]"

### Prueba 5: Admin Descuenta Saldo (Botón RESTAR)
1. Admin → Clic en **"Restar"**
2. Ingresa **$40,000**
3. Descripción: "Pago directo al admin"
4. Confirmar

**Resultado esperado:**
- Saldo del cliente: $0 (era $40,000 - $40,000)
- Historial muestra: "Pago - $40,000 - [fecha/hora]"
- Cliente está al día ✅

---

## 📊 Verificación Final

Ejecuta este SQL para verificar:

```sql
SELECT 
  u.full_name,
  a.balance as saldo_final,
  (SELECT COUNT(*) FROM transactions WHERE account_id = a.id) as total_transacciones,
  (SELECT SUM(amount) FROM transactions WHERE account_id = a.id AND type = 'cargo') as total_cargos,
  (SELECT SUM(amount) FROM transactions WHERE account_id = a.id AND type = 'pago') as total_pagos
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE u.email = 'eugenionardi06@gmail.com';
```

**Resultado esperado:**
- Saldo final: $0
- Total transacciones: 5
- Total cargos: $70,000
- Total pagos: $70,000

---

## ✅ Checklist Final

- [ ] Ejecuté PASO 1 (Resetear)
- [ ] Ejecuté PASO 2 (Permisos RLS)
- [ ] Configuré PASO 3 (Emails)
- [ ] Probé PASO 4 (Todas las operaciones)
- [ ] Verifiqué que el historial aparece
- [ ] Verifiqué que los cálculos son correctos
- [ ] El saldo nunca es negativo
- [ ] Puedo registrar emails múltiples veces

---

## 🆘 Si Algo Falla

1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Comparte el mensaje de error
4. Ejecuta el SQL de verificación y comparte el resultado
