
-- Permite qualquer usuário autenticado inserir usuários no banco de dados
CREATE POLICY "Permitir insert de usuários autenticados"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Você pode revisar e ajustar a política de acordo com regras mais restritas depois.
