# 🚨 URGENTE: Corregir Saldo Negativo

## 🔴 Problema Actual
- **Saldo mostrado:** -$140,000.00
- **Saldo correcto:** Debe calcularse sumando cargos y restando pagos
- **Transacciones:** 4 transacciones aprobadas

---

## ✅ SOLUCIÓN INMEDIATA

### Ejecuta este SQL en Supabase AHORA:

```sql
-- 1. Ver las transacciones actuales
SELECT 
  CASE WHEN t.type = 'cargo' THEN '📕 CARGO' ELSE '💰 PAGO' END as tipo,
  t.amount as monto,
  t.balance_before as saldo_antes,
  t.balance_after as saldo_despues,
  TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI') as fecha_hora,
  t.description as descripcion
FROM transactions t
WHERE t.account_id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47'
ORDER BY t.created_at ASC;

-- 2. CORREGIR EL SALDO
UPDATE accounts
SET balance = COALESCE((
  SELECT SUM(
    CASE 
      WHEN t.type = 'cargo' THEN t.amount 
      WHEN t.type = 'pago' THEN -t.amount 
      ELSE 0 
    END
  )
  FROM transactions t
  WHERE t.account_id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47'
    AND t.status = 'aprobado'
), 0)
WHERE id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47';

-- 3. Verificar el resultado
SELECT 
  u.full_name,
  a.balance as saldo_corregido
FROM users u
JOIN accounts a ON u.id = a.user_id
WHERE a.id = '7893e9f5-dc62-4bea-81d6-2827ca9e5c47';
```

---

## 📊 Cómo Funciona

**Fórmula correcta:**
```
SALDO = SUMA(CARGOS) - SUMA(PAGOS)
```

**Ejemplo:**
- Cargo 1: +$50,000
- Cargo 2: +$20,000  
- Cargo 3: +$20,000
- Pago 1: -$50,000
- **SALDO FINAL: $40,000** ✅

---

## 🔄 Después de Ejecutar

1. Refresca la página del cliente (Ctrl + F5)
2. El saldo debería mostrar el valor correcto
3. El historial mostrará las 4 transacciones con fecha y hora

---

## 📝 Nota Importante

Este script:
- ✅ NO borra transacciones
- ✅ NO modifica el historial
- ✅ SOLO recalcula el saldo basado en las transacciones reales
- ✅ Corrige cualquier inconsistencia

**Ejecuta el SQL y el problema se resolverá inmediatamente.**
