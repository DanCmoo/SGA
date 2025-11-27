# Script de inicialización rápida del frontend
# Ejecutar: .\setup-frontend.ps1

Write-Host "🚀 Iniciando configuración del frontend..." -ForegroundColor Cyan

# Verificar si existe .env.local
if (-Not (Test-Path .env.local)) {
    Write-Host "📝 Creando archivo .env.local..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:8080" | Out-File -FilePath .env.local -Encoding UTF8
    Write-Host "✅ Archivo .env.local creado" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local ya existe, no se modificó" -ForegroundColor Yellow
}

# Instalar dependencias si no existen
if (-Not (Test-Path node_modules)) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules ya existe, ejecuta 'npm install' manualmente si necesitas actualizar" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Asegúrate de que el backend esté corriendo en http://localhost:8080"
Write-Host "2. Ejecuta: npm run dev"
Write-Host "3. Abre http://localhost:3000/login en tu navegador"
Write-Host ""
Write-Host "👤 Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "   Correo: admin@fis.edu.co"
Write-Host "   Contraseña: password123"
Write-Host ""
Write-Host "📚 Documentación completa en FRONTEND_README.md" -ForegroundColor Cyan
