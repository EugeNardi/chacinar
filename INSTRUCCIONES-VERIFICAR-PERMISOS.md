# 🔍 VERIFICAR Y ARREGLAR PERMISOS DE TRANSACCIONES

## 🔴 Problema Actual
- El saldo se actualiza correctamente ✅
- Pero las transacciones NO aparecen en el historial ❌
- Dice "Sin transacciones aún"

## 🎯 Causa Probable
Las transacciones se están guardando en la base de datos, pero los permisos (RLS - Row Level Security) están bloqueando que los clientes las vean.

---

## ✅ SOLUCIÓN

### Paso 1: Ir a Supabase SQL Editor
1. Abre [https://supabase.com](https://supabase.com)
2. Selecciona tu proyecto "chacinar"
3. Ve a **"SQL Editor"** → **"New query"**

### Paso 2: Ejecutar el Script Completo
Copia y pega el contenido del archivo `VERIFICAR-Y-ARREGLAR-PERMISOS.sql` y haz clic en **"Run"**

---

## 📊 Qué Hace Este Script

### 1️⃣ **Verificación**
- Muestra todas las transacciones existentes
- Verifica los permisos actuales
- Muestra un resumen por cliente

### 2️⃣ **Limpieza**
- Elimina políticas antiguas que puedan estar causando conflictos

### 3️⃣ **Configuración Correcta**
Crea los permisos necesarios:

**Para CLIENTES:**
- ✅ Pueden VER sus propias transacciones
- ✅ Pueden CREAR solicitudes de pago

**Para ADMINS:**
- ✅ Pueden VER todas las transacciones
- ✅ Pueden CREAR transacciones (cargos y pagos)
- ✅ Pueden ACTUALIZAR transacciones
- ✅ Pueden ELIMINAR transacciones

---

## 🎯 Resultado Esperado

Después de ejecutar este script, deberías ver:

### En el Panel del Cliente:
```
📋 Historial
┌─────────────────────────────────────┐
│ [Cargo] 28/12/2024 19:30           │
│ $ 50.000,00                         │
│ Carga de saldo por administrador    │
├─────────────────────────────────────┤
│ [Cargo] 28/12/2024 19:35           │
│ $ 20.000,00                         │
│ Carga de saldo por administrador    │
└─────────────────────────────────────┘
```

### En el Panel del Admin (Historial del Cliente):
- Todas las transacciones del cliente
- Cargos y pagos con fecha/hora
- Saldo antes y después de cada movimiento

---

## 🔄 Después de Ejecutar

1. **Refresca la aplicación** del cliente (Ctrl + F5)
2. **Haz clic en "Refrescar"** en el historial
3. **Deberías ver todas las transacciones** con fecha y hora
4. **Abre la consola** (F12) y verifica:
   - `Total transacciones en DB: 2` (o el número que sea)
   - `Transacciones aprobadas: 2`

---

## 🆘 Si Aún No Aparecen

Después de ejecutar el script, abre la consola del navegador en el panel del cliente y busca:

```
=== DEBUG: TODAS LAS TRANSACCIONES ===
Total transacciones en DB: 2
Todas las transacciones: [...]
```

Si dice `0`, las transacciones no se guardaron.
Si dice `2` o más, pero no se muestran, hay otro problema de permisos.

Comparte lo que ves en la consola y continuaremos desde ahí.
