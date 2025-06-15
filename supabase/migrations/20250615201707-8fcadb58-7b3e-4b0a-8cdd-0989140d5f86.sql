
-- Adiciona o campo CNES (7 dígitos, texto) à tabela locations
ALTER TABLE public.locations
ADD COLUMN cnes VARCHAR(7);

-- Opcional: cria um índice para performance em buscas por CNES
CREATE INDEX idx_locations_cnes ON public.locations(cnes);

-- (Opcional) Garante unicidade do CNES entre as unidades
CREATE UNIQUE INDEX idx_locations_cnes_unique ON public.locations(cnes);

