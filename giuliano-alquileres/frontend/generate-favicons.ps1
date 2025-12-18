# Script PowerShell para gerar favicons a partir do logo.png
# Requer ImageMagick instalado: https://imagemagick.org/script/download.php

$sourceLogo = "public/logo.png"
$publicDir = "public"

Write-Host "🎨 Gerando favicons a partir de $sourceLogo..." -ForegroundColor Cyan

# Verificar se ImageMagick está instalado
try {
    $null = magick --version
} catch {
    Write-Host "❌ ImageMagick não encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    Write-Host "   Ou use: https://realfavicongenerator.net/" -ForegroundColor Yellow
    exit 1
}

# Verificar se logo existe
if (!(Test-Path $sourceLogo)) {
    Write-Host "❌ Arquivo $sourceLogo não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "Gerando favicon-16x16.png..." -ForegroundColor Green
magick $sourceLogo -resize 16x16 "$publicDir/favicon-16x16.png"

Write-Host "Gerando favicon-32x32.png..." -ForegroundColor Green
magick $sourceLogo -resize 32x32 "$publicDir/favicon-32x32.png"

Write-Host "Gerando apple-touch-icon.png (180x180)..." -ForegroundColor Green
magick $sourceLogo -resize 180x180 "$publicDir/apple-touch-icon.png"

Write-Host "Gerando android-chrome-192x192.png..." -ForegroundColor Green
magick $sourceLogo -resize 192x192 "$publicDir/android-chrome-192x192.png"

Write-Host "Gerando android-chrome-512x512.png..." -ForegroundColor Green
magick $sourceLogo -resize 512x512 "$publicDir/android-chrome-512x512.png"

Write-Host "Gerando favicon.ico (multi-size: 16, 32, 48)..." -ForegroundColor Green
magick $sourceLogo -resize 16x16 favicon-16.png
magick $sourceLogo -resize 32x32 favicon-32.png
magick $sourceLogo -resize 48x48 favicon-48.png
magick favicon-16.png favicon-32.png favicon-48.png "$publicDir/favicon.ico"
Remove-Item favicon-16.png, favicon-32.png, favicon-48.png

Write-Host ""
Write-Host "✅ Favicons gerados com sucesso!" -ForegroundColor Green
Write-Host "   Arquivos criados em: $publicDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Executar: npm run build" -ForegroundColor White
Write-Host "   2. Fazer deploy para produção" -ForegroundColor White
