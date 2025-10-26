-- Garante que a extensão pgcrypto está ativa (necessária para hash de senha)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cria o usuário admin_master
INSERT INTO users (
    uuid,
    name,
    email,
    phone,
    country,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at,         -- adiciona aqui
    user_type,
    status
)
VALUES (
    gen_random_uuid(),               -- gera UUID automaticamente
    'Administrador Master',          -- nome
    'admin@site.com',                -- email
    '+55 47 99999-9999',             -- telefone opcional
    'Brasil',                        -- país
    crypt('123456', gen_salt('bf')), -- senha (criptografada)
    'admin_master',                  -- role de administrador
    TRUE,                            -- ativo
    NOW(),                           -- data de criação
    NOW(),                           -- data de atualização
    'admin_master',                         -- tipo de usuário
    'approved'                       -- status aprovado
);
