
-- Primeiro, vamos verificar se existem referências que impedem a exclusão
-- Se houver medicamentos ou outras tabelas referenciando as locations, 
-- vamos limpar essas referências primeiro

-- Limpar medicamentos que referenciam locations que serão removidas
DELETE FROM public.medicines WHERE location_id IS NOT NULL;

-- Limpar distribuições que referenciam locations que serão removidas  
DELETE FROM public.distributions WHERE source_location IS NOT NULL OR target_location IS NOT NULL;

-- Limpar dispensações que referenciam locations
DELETE FROM public.dispensations WHERE location_id IS NOT NULL;

-- Limpar dispensings que referenciam locations
DELETE FROM public.dispensings WHERE location_id IS NOT NULL;

-- Limpar users que referenciam locations (exceto admin)
UPDATE public.users SET location_id = NULL WHERE email != 'smss.sjapa@gmail.com' AND email != 'ivanjfm15@gmail.com';

-- Agora limpar todas as locations existentes
DELETE FROM public.locations;

-- Inserir apenas a Unidade Central de Saúde como secretaria principal
INSERT INTO public.locations (
  id,
  name,
  type,
  address,
  city,
  state,
  phone,
  email,
  coordinator,
  status,
  created_at
) VALUES (
  gen_random_uuid(),
  'Secretaria Municipal de Saúde - Unidade Central',
  'health_unit',
  'Rua Principal, 123 - Centro',
  'São Paulo',
  'SP',
  '(11) 3333-4444',
  'central@medcontrol.com',
  'Administrador do Sistema',
  'active',
  now()
);
