
-- Limpar todos os dados do banco de dados
-- Desabilitar temporariamente as verificações de chave estrangeira para evitar erros de dependência

-- Limpar todas as tabelas principais
DELETE FROM public.dispensations;
DELETE FROM public.dispensings;
DELETE FROM public.distributions;
DELETE FROM public.medications;
DELETE FROM public.medicines;
DELETE FROM public.profiles;
DELETE FROM public.users;
DELETE FROM public.locations;

-- Resetar sequências se necessário (para garantir que os IDs comecem do zero)
-- Como estamos usando UUID, não há sequências para resetar

-- Mensagem de confirmação
SELECT 'Banco de dados limpo com sucesso! Todas as tabelas foram esvaziadas.' as status;
