-- Script de Teste: Criar reserva com check_out no passado
-- Este script cria uma reserva "antiga" que já passou do check-out
-- para testar o sistema de marcação automática como "completed"

-- IMPORTANTE: Substitua os IDs abaixo por IDs válidos do seu banco!
-- property_id: ID de uma propriedade existente
-- user_id: ID de um usuário existente

INSERT INTO bookings (
  uuid,
  property_id,
  user_id,
  check_in,
  check_out,
  guests,
  nights,
  price_per_night,
  total_price,
  cleaning_fee,
  service_fee,
  final_price,
  status,
  guest_name,
  guest_email,
  guest_phone,
  guest_document,
  payment_status,
  created_at,
  updated_at,
  confirmed_at
) VALUES (
  gen_random_uuid(),                    -- uuid
  1,                                     -- property_id (ALTERE PARA UM ID VÁLIDO!)
  1,                                     -- user_id (ALTERE PARA UM ID VÁLIDO!)
  '2025-12-01',                          -- check_in: início de dezembro
  '2025-12-05',                          -- check_out: 5 de dezembro (JÁ PASSOU!)
  2,                                     -- guests
  4,                                     -- nights
  500.00,                                -- price_per_night
  2000.00,                               -- total_price
  50.00,                                 -- cleaning_fee
  200.00,                                -- service_fee
  2250.00,                               -- final_price
  'confirmed',                           -- status: CONFIRMADA (será mudada para completed pelo cron)
  'João da Silva',                       -- guest_name
  'joao@teste.com',                      -- guest_email
  '+5548999999999',                      -- guest_phone
  '12345678900',                         -- guest_document
  'paid',                                -- payment_status
  NOW() - INTERVAL '15 days',            -- created_at: 15 dias atrás
  NOW() - INTERVAL '15 days',            -- updated_at
  NOW() - INTERVAL '14 days'             -- confirmed_at: 14 dias atrás
);

-- Verificar a reserva criada
SELECT
  id,
  uuid,
  property_id,
  user_id,
  check_in,
  check_out,
  status,
  guest_name,
  completed_at
FROM bookings
WHERE check_out < CURRENT_DATE
  AND status = 'confirmed'
ORDER BY created_at DESC
LIMIT 5;
