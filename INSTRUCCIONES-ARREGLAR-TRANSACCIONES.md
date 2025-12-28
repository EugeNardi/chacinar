# 🔧 INSTRUCCIONES: Arreglar Tabla de Transacciones

## ❌ Problema Actual
Error: `Could not find the 'balance_after' column of 'transactions' in the schema cache`

La tabla `transactions` no tiene las columnas `balance_before` y `balance_after` que el código necesita.

---

## ✅ Solución

### Paso 1: Ir a Supabase
1. Abre [https://supabase.com](https://supabase.com)
2. Inicia sesión
3. Selecciona tu proyecto "chacinar"

### Paso 2: Abrir el Editor SQL
1. En el menú lateral izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"** (Nueva consulta)

### Paso 3: Ejecutar el SQL
1. Copia y pega el contenido del archivo `ARREGLAR-TRANSACCIONES.sql`
2. Haz clic en **"Run"** (Ejecutar) o presiona `Ctrl + Enter`

### Paso 4: Verificar
Deberías ver:
- ✅ Mensaje de éxito: "Success. No rows returned"
- ✅ Una tabla mostrando las columnas de `transactions`
- ✅ Las columnas `balance_before` y `balance_after` ahora existen

---

## 🎯 Después de Ejecutar

1. **Refresca la aplicación** (Ctrl + F5)
2. **Intenta crear un nuevo cargo** desde el panel de admin
3. **Verifica que funcione** sin errores
4. **Revisa el historial** del cliente para ver las transacciones

---

## 📝 Qué Hace Este Script

- Agrega las columnas `balance_before` y `balance_after` a la tabla `transactions`
- Estas columnas guardan el saldo antes y después de cada transacción
- Permite que el historial muestre correctamente todos los movimientos

---

## ⚠️ Importante

Después de ejecutar este SQL:
- Todas las transacciones nuevas se guardarán correctamente
- El historial mostrará tanto cargos como pagos
- El cliente podrá ver su historial completo
- El admin también verá el historial completo de cada cliente
