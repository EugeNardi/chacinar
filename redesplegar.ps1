# Redesplegar a Netlify con las nuevas variables
# Ejecutar: .\redesplegar.ps1

Write-Host "REDESPLEGANDO A NETLIFY" -ForegroundColor Green
Write-Host ""

Write-Host "Las variables ya estan configuradas en Netlify" -ForegroundColor Cyan
Write-Host "Ahora vamos a redesplegar para aplicar los cambios" -ForegroundColor Cyan
Write-Host ""

# Limpiar cache local
Write-Host "Limpiando cache local..." -ForegroundColor Yellow
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Build local
Write-Host "Construyendo proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en el build" -ForegroundColor Red
    exit 1
}

Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "Desplegando a produccion..." -ForegroundColor Yellow
Write-Host "(Esto tomara 2-3 minutos)" -ForegroundColor Cyan
netlify deploy --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en el deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "DEPLOY COMPLETADO!" -ForegroundColor Green
Write-Host ""
Write-Host "AHORA:" -ForegroundColor Yellow
Write-Host "1. Abre tu sitio de Netlify" -ForegroundColor White
Write-Host "2. Refresca la pagina (Ctrl + F5)" -ForegroundColor White
Write-Host "3. Intenta hacer login" -ForegroundColor White
Write-Host "4. Deberia funcionar!" -ForegroundColor White
Write-Host ""

# Abrir sitio
Write-Host "Abriendo sitio..." -ForegroundColor Cyan
netlify open:site
