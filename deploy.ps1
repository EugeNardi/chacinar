# Script de Deployment para Chacinar
# Ejecutar: .\deploy.ps1

Write-Host "DESPLEGANDO CHACINAR A NETLIFY" -ForegroundColor Green
Write-Host ""

# Verificar si Netlify CLI esta instalado
Write-Host "Verificando Netlify CLI..." -ForegroundColor Yellow
$netlifyCLI = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyCLI) {
    Write-Host "Netlify CLI no esta instalado" -ForegroundColor Red
    Write-Host "Instalando Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host "Netlify CLI instalado" -ForegroundColor Green
} else {
    Write-Host "Netlify CLI encontrado" -ForegroundColor Green
}

Write-Host ""

# Verificar .env.local
Write-Host "Verificando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "Archivo .env.local encontrado" -ForegroundColor Green
} else {
    Write-Host "ADVERTENCIA: .env.local no encontrado" -ForegroundColor Yellow
    Write-Host "Ejecuta: .\setup-env.ps1" -ForegroundColor Yellow
}

Write-Host ""

# Limpiar build anterior
Write-Host "Limpiando build anterior..." -ForegroundColor Yellow
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Build anterior limpiado" -ForegroundColor Green

Write-Host ""

# Verificar build
Write-Host "Construyendo proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en el build. Revisa los errores arriba." -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Cyan
    Write-Host "1. Verifica que .env.local exista" -ForegroundColor White
    Write-Host "2. Ejecuta: .\setup-env.ps1" -ForegroundColor White
    Write-Host "3. Verifica las credenciales de Supabase" -ForegroundColor White
    exit 1
}

Write-Host "Build exitoso" -ForegroundColor Green
Write-Host ""

# Login a Netlify
Write-Host "Iniciando sesion en Netlify..." -ForegroundColor Yellow
Write-Host "(Se abrira tu navegador para autorizar)" -ForegroundColor Cyan
netlify login

Write-Host ""

# Verificar si el sitio ya existe
Write-Host "Verificando configuracion de Netlify..." -ForegroundColor Yellow
$siteExists = Test-Path ".netlify/state.json"

if (-not $siteExists) {
    Write-Host "Primera vez desplegando. Inicializando sitio..." -ForegroundColor Yellow
    netlify init
}

Write-Host ""

# Configurar variables de entorno
Write-Host "IMPORTANTE: Configura las variables de entorno en Netlify" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opcion 1: Desde CLI (ejecuta estos comandos):" -ForegroundColor Cyan
Write-Host 'netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://bwyuggaylirmlwozowgb.supabase.co"' -ForegroundColor White
Write-Host 'netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eXVnZ2F5bGlybWx3b3pvd2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE5NDYsImV4cCI6MjA4MTYzNzk0Nn0.wDWp0-QKg1UAFq8XDvGeiXJHJNP8BxBQ11Yqerw-wng"' -ForegroundColor White
Write-Host ""
Write-Host "Opcion 2: Desde Dashboard:" -ForegroundColor Cyan
Write-Host "Site settings -> Environment variables -> Add variable" -ForegroundColor White
Write-Host ""

$response = Read-Host "Ya configuraste las variables? (s/n)"
if ($response -ne "s") {
    Write-Host "Por favor configura las variables y vuelve a ejecutar el script" -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# Desplegar
Write-Host "Desplegando a produccion..." -ForegroundColor Yellow
netlify deploy --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en el deployment" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "DEPLOYMENT COMPLETADO!" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Abre Supabase Dashboard" -ForegroundColor White
Write-Host "2. Authentication -> URL Configuration" -ForegroundColor White
Write-Host "3. Agrega tu URL de Netlify" -ForegroundColor White
Write-Host ""
Write-Host "Abriendo sitio..." -ForegroundColor Cyan
netlify open:site
