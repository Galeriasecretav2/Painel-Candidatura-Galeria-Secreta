/*
  # Criar tabela de usuários administrativos

  1. Nova Tabela
    - `admin_users`
      - `id` (uuid, primary key, referência ao auth.users)
      - `username` (text, nome de usuário único)
      - `full_name` (text, nome completo)
      - `role` (text, papel do usuário)
      - `is_active` (boolean, se o usuário está ativo)
      - `last_login` (timestamptz, último login)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `admin_users`
    - Adicionar políticas para usuários autenticados
</sql>

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Política para leitura (usuários podem ver apenas seu próprio perfil)
CREATE POLICY "Users can read own profile"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Política para atualização (usuários podem atualizar apenas seu próprio perfil)
CREATE POLICY "Users can update own profile"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (será criado após a configuração do auth)
-- Este será executado manualmente após configurar a autenticação