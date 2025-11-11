-- Migration: Adicionar colunas cloudinary_url e url à tabela property_photos
-- Data: 2025-01-11
-- Descrição: Adiciona suporte para URLs do Cloudinary nas fotos das propriedades

-- Verificar se a coluna cloudinary_url existe, se não, adicionar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'property_photos'
        AND column_name = 'cloudinary_url'
    ) THEN
        ALTER TABLE property_photos
        ADD COLUMN cloudinary_url VARCHAR(500);

        RAISE NOTICE 'Coluna cloudinary_url adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna cloudinary_url já existe';
    END IF;
END $$;

-- Verificar se a coluna url existe, se não, adicionar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'property_photos'
        AND column_name = 'url'
    ) THEN
        ALTER TABLE property_photos
        ADD COLUMN url VARCHAR(500);

        RAISE NOTICE 'Coluna url adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna url já existe';
    END IF;
END $$;

-- Verificar estrutura final da tabela
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'property_photos'
ORDER BY ordinal_position;
