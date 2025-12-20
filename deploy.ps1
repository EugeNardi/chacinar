# 🚀 Script de Deployment para Chacinar
# Ejecutar: .\deploy.ps1

Write-Host "🚀 DESPLEGANDO CHACINAR A NETLIFY" -ForegroundColor Green
Write-Host ""

# Verificar si Netlify CLI está instalado
Write-Host "📦 Verificando Netlify CLI..." -ForegroundColor Yellow
$netlifyCLI = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyCLI) {
    Write-Host "❌ Netlify CLI no está instalado" -ForegroundColor Red
    Write-Host "📥 Instalando Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host "✅ Netlify CLI instalado" -ForegroundColor Green
} else {
    Write-Host "✅ Netlify CLI encontrado" -ForegroundColor Green
}

Write-Host ""

# Verificar build
Write-Host "🔨 Verificando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build exitoso" -ForegroundColor Green
Write-Host ""

# Login a Netlify
Write-Host "🔐 Iniciando sesión en Netlify..." -ForegroundColor Yellow
netlify login

Write-Host ""

# Desplegar
Write-Host "🚀 Desplegando a producción..." -ForegroundColor Yellow
netlify deploy --prod

Write-Host ""
Write-Host "✅ ¡DEPLOYMENT COMPLETADO!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Configura las variables de entorno en Netlify Dashboard"
Write-Host "2. NEXT_PUBLIC_SUPABASE_URL"
Write-Host "3. NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host ""
Write-Host "🌐 Abre tu sitio:" -ForegroundColor Cyan
netlify open:site
