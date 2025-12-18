#!/bin/bash

# Script para gerar favicons a partir do logo.png
# Requer ImageMagick instalado

SOURCE_LOGO="public/logo.png"
PUBLIC_DIR="public"

echo "🎨 Gerando favicons a partir de $SOURCE_LOGO..."

# Verificar se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não encontrado!"
    echo "   Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "   MacOS: brew install imagemagick"
    echo "   Ou use: https://realfavicongenerator.net/"
    exit 1
fi

# Verificar se logo existe
if [ ! -f "$SOURCE_LOGO" ]; then
    echo "❌ Arquivo $SOURCE_LOGO não encontrado!"
    exit 1
fi

echo "Gerando favicon-16x16.png..."
convert "$SOURCE_LOGO" -resize 16x16 "$PUBLIC_DIR/favicon-16x16.png"

echo "Gerando favicon-32x32.png..."
convert "$SOURCE_LOGO" -resize 32x32 "$PUBLIC_DIR/favicon-32x32.png"

echo "Gerando apple-touch-icon.png (180x180)..."
convert "$SOURCE_LOGO" -resize 180x180 "$PUBLIC_DIR/apple-touch-icon.png"

echo "Gerando android-chrome-192x192.png..."
convert "$SOURCE_LOGO" -resize 192x192 "$PUBLIC_DIR/android-chrome-192x192.png"

echo "Gerando android-chrome-512x512.png..."
convert "$SOURCE_LOGO" -resize 512x512 "$PUBLIC_DIR/android-chrome-512x512.png"

echo "Gerando favicon.ico (multi-size: 16, 32, 48)..."
convert "$SOURCE_LOGO" -resize 16x16 favicon-16.png
convert "$SOURCE_LOGO" -resize 32x32 favicon-32.png
convert "$SOURCE_LOGO" -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png "$PUBLIC_DIR/favicon.ico"
rm favicon-16.png favicon-32.png favicon-48.png

echo ""
echo "✅ Favicons gerados com sucesso!"
echo "   Arquivos criados em: $PUBLIC_DIR"
echo ""
echo "📋 Próximos passos:"
echo "   1. Executar: npm run build"
echo "   2. Fazer deploy para produção"
