/*
  # Criar tabela de candidaturas

  1. Nova Tabela
    - `candidaturas`
      - `id` (uuid, primary key)
      - `nome` (text, nome completo da candidata)
      - `idade` (integer, idade da candidata)
      - `email` (text, email único)
      - `whatsapp` (text, número do WhatsApp)
      - `provincia` (text, província de residência)
      - `foto_url` (text, URL da foto principal)
      - `status` (text, status da candidatura: pendente, aprovada, rejeitada)
      - `experiencia` (boolean, se tem experiência anterior)
      - `motivacao` (text, motivação para se candidatar)
      - `disponibilidade` (text, disponibilidade de trabalho)
      - `data_submissao` (timestamptz, data de submissão)
      - `data_atualizacao` (timestamptz, data da última atualização)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `candidaturas`
    - Adicionar políticas para usuários autenticados
</sql>

CREATE TABLE IF NOT EXISTS candidaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  idade integer NOT NULL CHECK (idade >= 18 AND idade <= 65),
  email text UNIQUE NOT NULL,
  whatsapp text NOT NULL,
  provincia text NOT NULL,
  foto_url text,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  experiencia boolean DEFAULT false,
  motivacao text,
  disponibilidade text CHECK (disponibilidade IN ('tempo_integral', 'meio_periodo', 'fins_semana', 'flexivel')),
  data_submissao timestamptz DEFAULT now(),
  data_atualizacao timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE candidaturas ENABLE ROW LEVEL SECURITY;

-- Política para leitura (usuários autenticados podem ver todas as candidaturas)
CREATE POLICY "Authenticated users can read candidaturas"
  ON candidaturas
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para inserção (usuários autenticados podem criar candidaturas)
CREATE POLICY "Authenticated users can insert candidaturas"
  ON candidaturas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para atualização (usuários autenticados podem atualizar candidaturas)
CREATE POLICY "Authenticated users can update candidaturas"
  ON candidaturas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_candidaturas_updated_at
  BEFORE UPDATE ON candidaturas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON candidaturas(status);
CREATE INDEX IF NOT EXISTS idx_candidaturas_provincia ON candidaturas(provincia);
CREATE INDEX IF NOT EXISTS idx_candidaturas_data_submissao ON candidaturas(data_submissao);
CREATE INDEX IF NOT EXISTS idx_candidaturas_email ON candidaturas(email);