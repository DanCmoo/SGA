#!/bin/bash

# Script de inicialización rápida del frontend
# Ejecutar: bash setup-frontend.sh

echo "🚀 Iniciando configuración del frontend..."

# Verificar si existe .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creando archivo .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
    echo "✅ Archivo .env.local creado"
else
    echo "⚠️  .env.local ya existe, no se modificó"
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
else
    echo "⚠️  node_modules ya existe, ejecuta 'npm install' manualmente si necesitas actualizar"
fi

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Asegúrate de que el backend esté corriendo en http://localhost:8080"
echo "2. Ejecuta: npm run dev"
echo "3. Abre http://localhost:3000/login en tu navegador"
echo ""
echo "👤 Credenciales de prueba:"
echo "   Correo: admin@fis.edu.co"
echo "   Contraseña: password123"
echo ""
echo "📚 Documentación completa en FRONTEND_README.md"
