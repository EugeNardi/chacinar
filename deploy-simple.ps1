# Deploy Simple a Netlify
# Ejecutar: .\deploy-simple.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  CHACINAR - DEPLOY A NETLIFY" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar Netlify CLI
Write-Host "[1/5] Verificando Netlify CLI..." -ForegroundColor Yellow
$netlifyCLI = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyCLI) {
    Write-Host "Instalando Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Paso 2: Limpiar y construir
Write-Host "[2/5] Construyendo proyecto..." -ForegroundColor Yellow
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build fallo" -ForegroundColor Red
    exit 1
}
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Paso 3: Login
Write-Host "[3/5] Login a Netlify..." -ForegroundColor Yellow
Write-Host "(Se abrira tu navegador)" -ForegroundColor Cyan
netlify login
Write-Host ""

# Paso 4: Configurar variables
Write-Host "[4/5] Configurar variables de entorno" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANTE: Copia y ejecuta estos comandos:" -ForegroundColor Red
Write-Host ""
Write-Host 'netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"' -ForegroundColor White
Write-Host ""
Write-Host 'netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"' -ForegroundColor White
Write-Host ""
Write-Host "O configuralo desde el Dashboard de Netlify" -ForegroundColor Cyan
Write-Host ""

$response = Read-Host "Ya configuraste las variables? (s/n)"
if ($response -ne "s" -and $response -ne "S") {
    Write-Host ""
    Write-Host "Configuralo y vuelve a ejecutar el script" -ForegroundColor Yellow
    exit 0
}
Write-Host ""

# Paso 5: Deploy
Write-Host "[5/5] Desplegando a produccion..." -ForegroundColor Yellow
netlify deploy --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Deploy fallo" -ForegroundColor Red
    Write-Host "Verifica que hayas ejecutado 'netlify init' primero" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  DEPLOY COMPLETADO!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Abre Supabase Dashboard" -ForegroundColor White
Write-Host "2. Authentication -> URL Configuration" -ForegroundColor White
Write-Host "3. Agrega tu URL de Netlify" -ForegroundColor White
Write-Host ""
Write-Host "Abriendo sitio..." -ForegroundColor Cyan
netlify open:site
