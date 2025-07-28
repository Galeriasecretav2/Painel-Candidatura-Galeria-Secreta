# Painel Administrativo - Galeria Secreta

Sistema administrativo elegante para gerenciamento de candidaturas de modelos da Galeria Secreta.

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha os detalhes do projeto:
   - **Name**: Galeria Secreta Admin
   - **Database Password**: Crie uma senha segura
   - **Region**: Escolha a região mais próxima
6. Clique em "Create new project"

### 2. Configurar Variáveis de Ambiente

1. No dashboard do Supabase, vá para **Settings** > **API**
2. Copie a **Project URL** e **anon public key**
3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Executar Migrações do Banco de Dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute os scripts SQL na seguinte ordem:

#### 3.1. Criar Tabela de Candidaturas
Copie e execute o conteúdo do arquivo `supabase/migrations/create_candidaturas_table.sql`

#### 3.2. Criar Tabela de Usuários Admin
Copie e execute o conteúdo do arquivo `supabase/migrations/create_admin_users_table.sql`

### 4. Configurar Autenticação

1. No dashboard do Supabase, vá para **Authentication** > **Settings**
2. Configure as seguintes opções:
   - **Site URL**: `http://localhost:5173` (para desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/**`
3. Desabilite **Email Confirmations** para desenvolvimento
4. Em **Auth Providers**, mantenha apenas **Email** habilitado

### 5. Criar Usuário Administrador

1. Vá para **Authentication** > **Users**
2. Clique em **Add user**
3. Preencha:
   - **Email**: `galeriasecreta@admin.com`
   - **Password**: `admin123!`
   - **Auto Confirm User**: ✅ Habilitado
4. Clique em **Create user**
5. Copie o **User UID** gerado

6. No **SQL Editor**, execute o seguinte comando substituindo `USER_UID_AQUI`:

```sql
INSERT INTO admin_users (id, username, full_name, role, is_active)
VALUES ('USER_UID_AQUI', 'Galeriasecreta', 'Administrador Galeria Secreta', 'super_admin', true);
```

### 6. Configurar Storage (Opcional)

Para upload de fotos das candidatas:

1. Vá para **Storage**
2. Crie um novo bucket chamado `candidaturas-fotos`
3. Configure as políticas de acesso:
   - **Public**: Não
   - **Allowed MIME types**: `image/*`
   - **File size limit**: 10MB

### 7. Inserir Dados de Exemplo (Opcional)

Execute no **SQL Editor**:

```sql
INSERT INTO candidaturas (nome, idade, email, whatsapp, provincia, foto_url, status, experiencia, motivacao, disponibilidade) VALUES
('Sofia Maria Santos', 25, 'sofia@email.com', '+258 84 123 4567', 'nampula', 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=300', 'pendente', false, 'Desejo fazer parte de uma equipe profissional e crescer na área.', 'tempo_integral'),
('Isabella Costa', 28, 'isabella@email.com', '+258 85 987 6543', 'maputo', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300', 'aprovada', true, 'Tenho experiência na área e busco novas oportunidades.', 'flexivel'),
('Valentina Oliveira', 24, 'valentina@email.com', '+258 86 555 1234', 'sofala', 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=300', 'pendente', false, 'Sempre sonhei em trabalhar como modelo profissional.', 'meio_periodo');
```

## 🔐 Credenciais de Acesso

### Desenvolvimento (Local)
- **Usuário**: Galeriasecreta
- **Senha**: admin

### Produção (Supabase)
- **Email**: galeriasecreta@admin.com
- **Senha**: admin123!

## 🛠️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── lib/                # Configurações e utilitários
│   ├── supabase.ts     # Cliente Supabase
│   └── database.types.ts # Tipos TypeScript
└── App.tsx             # Componente principal

supabase/
└── migrations/         # Scripts SQL para o banco
```

## 🔧 Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Lista de candidaturas com filtros e busca
- ✅ Visualização detalhada de candidaturas
- ✅ Sistema de aprovação/rejeição
- ✅ Autenticação segura
- ✅ Interface responsiva e elegante
- ✅ Atualizações em tempo real
- ✅ Integração completa com Supabase

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Configure as variáveis de ambiente no seu provedor de hosting
2. Atualize a **Site URL** e **Redirect URLs** no Supabase
3. Execute `npm run build`
4. Faça deploy da pasta `dist`

## 📞 Suporte

Para dúvidas ou problemas:
- Email: galeriasecretamocambique@gmail.com
- WhatsApp: +258 853131185