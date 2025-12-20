# Configurar variables de entorno en Netlify
# Ejecutar: .\configurar-netlify.ps1

Write-Host "CONFIGURANDO VARIABLES EN NETLIFY" -ForegroundColor Green
Write-Host ""

# Configurar SUPABASE_URL
Write-Host "Configurando NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo configurar SUPABASE_URL" -ForegroundColor Red
    Write-Host "Asegurate de haber ejecutado 'netlify login' primero" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Configurar ANON_KEY
Write-Host "Configurando NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo configurar ANON_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Verificar variables
Write-Host "Verificando variables configuradas..." -ForegroundColor Yellow
netlify env:list

Write-Host ""
Write-Host "VARIABLES CONFIGURADAS EXITOSAMENTE!" -ForegroundColor Green
Write-Host ""
Write-Host "AHORA DEBES:" -ForegroundColor Yellow
Write-Host "1. Ir a Netlify Dashboard" -ForegroundColor White
Write-Host "2. Trigger deploy -> Deploy site" -ForegroundColor White
Write-Host "3. Esperar que termine el deploy" -ForegroundColor White
Write-Host "4. Probar tu sitio de nuevo" -ForegroundColor White
Write-Host ""
Write-Host "O ejecuta:" -ForegroundColor Cyan
Write-Host "netlify deploy --prod" -ForegroundColor White
