# Reiniciar servidor de desarrollo
# Ejecutar: .\reiniciar.ps1

Write-Host "Reiniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host ""

# Verificar .env.local
Write-Host "Verificando .env.local..." -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Write-Host "OK - .env.local encontrado" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contenido:" -ForegroundColor Cyan
    Get-Content .env.local
    Write-Host ""
} else {
    Write-Host "ERROR - .env.local no encontrado" -ForegroundColor Red
    Write-Host "Ejecuta: .\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Limpiar cache
Write-Host "Limpiando cache..." -ForegroundColor Cyan
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "OK - Cache limpiado" -ForegroundColor Green
Write-Host ""

# Iniciar servidor
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host "Abre: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

npm run dev
