
-- Habilitar RLS na tabela locations se não estiver habilitado
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer usuário autenticado possa visualizar locations
CREATE POLICY "Enable read access for all users" ON public.locations
FOR SELECT USING (true);

-- Política para permitir que qualquer usuário autenticado possa inserir locations
CREATE POLICY "Enable insert for authenticated users only" ON public.locations
FOR INSERT WITH CHECK (true);

-- Política para permitir que qualquer usuário autenticado possa atualizar locations
CREATE POLICY "Enable update for authenticated users only" ON public.locations
FOR UPDATE USING (true);

-- Política para permitir que qualquer usuário autenticado possa deletar locations
CREATE POLICY "Enable delete for authenticated users only" ON public.locations
FOR DELETE USING (true);
