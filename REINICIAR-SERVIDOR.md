# REINICIAR SERVIDOR DE DESARROLLO

## PROBLEMA
El servidor no esta detectando las variables de .env.local

## SOLUCION

### Paso 1: Detener el servidor actual
Presiona `Ctrl + C` en la terminal donde esta corriendo `npm run dev`

### Paso 2: Limpiar cache
```powershell
Remove-Item -Path .next -Recurse -Force
```

### Paso 3: Reiniciar servidor
```powershell
npm run dev
```

### Paso 4: Verificar
Abre http://localhost:3000 y verifica que no aparezca el error de Supabase

---

## COMANDOS COMPLETOS

```powershell
# Detener servidor (Ctrl + C)
# Luego ejecutar:

Remove-Item -Path .next -Recurse -Force
npm run dev
```

---

## SI SIGUE FALLANDO

Verifica que .env.local este en la raiz del proyecto:
```powershell
Get-Content .env.local
```

Debe mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
