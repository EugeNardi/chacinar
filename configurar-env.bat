@echo off
echo ============================================================
echo CONFIGURACION DE VARIABLES DE ENTORNO
echo ============================================================
echo.
echo Este script te ayudara a configurar Supabase
echo.
echo Necesitas obtener tu clave ANON de Supabase:
echo 1. Ve a: https://supabase.com/dashboard/project/bwyuggaylirmlwozowgb/settings/api
echo 2. Busca "Project API keys"
echo 3. Copia la clave que dice "anon" "public"
echo.
echo ============================================================
echo.
set /p ANON_KEY="Pega tu clave ANON aqui y presiona Enter: "
echo.
echo Creando archivo .env.local...
echo NEXT_PUBLIC_SUPABASE_URL=https://bwyuggaylirmlwozowgb.supabase.co > .env.local
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%ANON_KEY% >> .env.local
echo.
echo ============================================================
echo ARCHIVO CREADO EXITOSAMENTE
echo ============================================================
echo.
echo Ahora:
echo 1. Detén el servidor (Ctrl+C en la terminal donde corre npm run dev)
echo 2. Ejecuta: npm run dev
echo 3. Abre: http://localhost:3000
echo.
pause
