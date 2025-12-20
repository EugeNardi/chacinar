# Setup Environment Variables
# Ejecutar: .\setup-env.ps1

Write-Host "CONFIGURANDO VARIABLES DE ENTORNO" -ForegroundColor Green
Write-Host ""

# Copiar template a .env.local
if (Test-Path ".env.local.template") {
    Copy-Item ".env.local.template" ".env.local" -Force
    Write-Host "Archivo .env.local creado exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contenido:" -ForegroundColor Cyan
    Get-Content ".env.local"
    Write-Host ""
    Write-Host "Listo! Ahora puedes ejecutar:" -ForegroundColor Green
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host "   o" -ForegroundColor Yellow
    Write-Host "   npm run build" -ForegroundColor Yellow
}
else {
    Write-Host "No se encontro .env.local.template" -ForegroundColor Red
}
