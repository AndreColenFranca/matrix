# Eisenhower AI Matrix

[![Quality Gate](https://github.com/your-org/eisenhower-ai-matrix/workflows/Quality%20Gate/badge.svg)](https://github.com/your-org/eisenhower-ai-matrix/actions)
[![Tests](https://github.com/your-org/eisenhower-ai-matrix/workflows/Tests/badge.svg)](https://github.com/your-org/eisenhower-ai-matrix/actions)
[![codecov](https://codecov.io/gh/your-org/eisenhower-ai-matrix/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/eisenhower-ai-matrix)

Uma ferramenta inteligente de priorização de tarefas que utiliza **Google Gemini AI** para categorizar automaticamente suas atividades na Matriz de Eisenhower e permite compartilhar sua agenda organizada diretamente no WhatsApp.

## Funcionalidades

- ✨ **Categorização Inteligente**: Insira uma tarefa e a IA decide se você deve Fazer, Agendar, Delegar ou Eliminar com base em critérios de urgência e importância
- 📱 **Integração WhatsApp**: Envie sua lista de tarefas formatada para qualquer número instantaneamente via UAZAPI
- 🎨 **Interface Moderna**: Matriz visual responsiva com animações suaves e feedback em tempo real
- 💾 **Persistência**: Tarefas sincronizadas entre o navegador (localStorage) e banco de dados Supabase
- 👤 **Autenticação**: Login seguro via Supabase Auth
- 💡 **Sistema de Dicas**: Exemplos práticos integrados para melhorar a definição de prioridades
- 🚀 **Sem Backend Necessário**: Aplicação 100% client-side (frontend)

## Tecnologias

### Frontend

- **React 19** - Framework UI declarativo
- **TypeScript** - Type-safety e melhor DX
- **Tailwind CSS** - Styling utilitário moderno
- **Vite** - Build tool ultrarrápido

### Serviços

- **Google Generative AI** - Gemini 3 Flash para categorização de tarefas
- **Supabase** - Autenticação e banco de dados em tempo real
- **UAZAPI** - Integração WhatsApp para envio de mensagens

### Qualidade de Código

- **ESLint** - Linting com suporte React/TypeScript
- **Prettier** - Formatação automática de código
- **Vitest** - Testing framework de alta performance
- **TypeScript** - Type checking e documentação

## Instalação Rápida

### Pré-requisitos

- Node.js 18+ ou 20+
- npm ou yarn
- Git

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/your-org/eisenhower-ai-matrix.git
cd eisenhower-ai-matrix

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env.local
```

### Configuração de Variáveis de Ambiente

Edite `.env.local` e adicione:

```env
# Google Gemini API - https://ai.google.dev
VITE_GEMINI_API_KEY=sua_chave_api_aqui

# Supabase - https://app.supabase.com
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Rodando o Projeto

```bash
# Inicie o servidor de desenvolvimento
npm run dev
# A aplicação estará disponível em http://localhost:3000

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Servidor de desenvolvimento com hot reload
npm run build        # Build de produção
npm run preview      # Preview da build de produção
```

### Qualidade de Código

```bash
npm run lint         # Verificar estilo de código
npm run lint:fix     # Corrigir issues de linting automaticamente
npm run format       # Formatar código com Prettier
npm run format:check # Verificar formatação sem alterar
npm run typecheck    # Verificar tipos TypeScript
```

### Testes

```bash
npm run test         # Executar todos os testes
npm run test:ui      # Executar testes com interface visual
npm run test:coverage # Gerar relatório de cobertura
```

### Quality Gate Completo

```bash
npm run quality-gate # Executa: typecheck + lint + format:check + build
```

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ActivityInput.tsx    # Formulário de entrada de tarefas
│   ├── EisenhowerMatrix.tsx  # Matriz 2x2 de display
│   └── Auth/
│       └── Login.tsx       # Tela de autenticação
├── contexts/           # Context API para estado global
│   └── AuthContext.tsx     # Estado de autenticação
├── hooks/              # Custom React hooks
│   ├── useTasks.ts       # Gerenciamento de tarefas
│   └── useUserConfig.ts  # Configurações do usuário
├── lib/                # Utilitários e serviços
│   └── supabaseClient.ts # Cliente Supabase
├── types/              # Definições de tipos TypeScript
│   ├── database.types.ts # Tipos do banco de dados
│   └── index.ts
├── docs/               # Documentação do projeto
│   ├── ARCHITECTURE.md    # Design da arquitetura
│   ├── CODING_STANDARDS.md
│   ├── DEVELOPMENT.md
│   └── CONTRIBUTING.md
├── .github/
│   └── workflows/      # Pipelines CI/CD
│       ├── quality-gate.yml
│       └── tests.yml
├── App.tsx             # Componente principal
├── index.tsx           # Entry point React
├── types.ts            # Tipos principais
├── geminiService.ts    # Serviço de IA
└── index.css           # Estilos globais
```

## Fluxo de Uso

```
1. Usuário faz login
   ↓
2. Insere uma tarefa no campo de entrada
   ↓
3. AI categoriza a tarefa
   ↓
4. Tarefa aparece na Matriz de Eisenhower
   ↓
5. Usuário pode enviar para WhatsApp
   ↓
6. Matriz formatada chega no WhatsApp
```

## Conceito da Matriz de Eisenhower

A matriz divide tarefas em 4 quadrantes:

|                 | **Importante**        | **Não Importante** |
| --------------- | --------------------- | ------------------ |
| **Urgente**     | 🔥 FAZER (DO)         | 👤 DELEGAR         |
| **Não Urgente** | 📅 AGENDAR (SCHEDULE) | 🗑️ ELIMINAR        |

- **DO**: Urgente & Importante → Faça agora
- **SCHEDULE**: Importante & Não Urgente → Agende
- **DELEGATE**: Urgente & Não Importante → Delegue
- **ELIMINATE**: Nem urgente nem importante → Elimine

## Documentação

- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Guia de desenvolvimento local
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Design e arquitetura do sistema
- **[CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)** - Padrões e convenções de código
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Guia de contribuição

## CI/CD Pipeline

Este projeto usa GitHub Actions para automação:

### Quality Gate (`quality-gate.yml`)

- ✅ TypeScript type checking
- ✅ ESLint code linting
- ✅ Prettier formatting check
- ✅ Build verification

Triggers: push para main/master, pull requests

### Tests (`tests.yml`)

- ✅ Executa suite de testes
- ✅ Gera relatório de cobertura
- ✅ Upload para Codecov

Triggers: push para main/master, pull requests

## Contribuindo

Interessado em contribuir? Veja [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para:

- Como reportar bugs
- Como propor features
- Processo de pull request
- Padrões de commit
- Requisitos de testes

### Quick Start para Contribuidores

```bash
# 1. Crie uma feature branch
git checkout -b feature/minha-feature

# 2. Faça suas mudanças
# 3. Rode os testes e linting
npm run quality-gate
npm run test

# 4. Commit com mensagem descritiva
git commit -m "feat: descrição da feature"

# 5. Push e crie um Pull Request
git push origin feature/minha-feature
```

## Variáveis de Ambiente

### Requeridas

| Variable                 | Descrição                  | Fonte                                        |
| ------------------------ | -------------------------- | -------------------------------------------- |
| `VITE_GEMINI_API_KEY`    | Chave da API Google Gemini | [ai.google.dev](https://ai.google.dev)       |
| `VITE_SUPABASE_URL`      | URL do projeto Supabase    | [app.supabase.com](https://app.supabase.com) |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima Supabase     | Dashboard Supabase                           |

### Opcionais

| Variable                    | Descrição                              |
| --------------------------- | -------------------------------------- |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de service role (apenas backend) |
| `NODE_ENV`                  | `development` ou `production`          |

## Performance

- **Bundle Size**: ~869KB (minificado), ~222KB (gzipped)
- **Dev Server**: Inicia em ~500ms
- **Hot Reload**: < 100ms para mudanças
- **Build Time**: ~11s para produção

## Segurança

- ✅ Chaves de API em variáveis de ambiente
- ✅ Autenticação segura via Supabase
- ✅ Row-level security no banco de dados
- ✅ Sem exposição de dados sensíveis
- ✅ HTTPS em produção

## Troubleshooting

### Problema: "Cannot find module"

```bash
npm install
npm run typecheck
```

### Problema: Variáveis de ambiente não carregam

1. Verifique se arquivo é `.env.local` (não `.env`)
2. Reinicie o servidor: `npm run dev`
3. Limpe cache: `rm -rf node_modules && npm install`

### Problema: Testes falhando

```bash
npm run test -- --reporter=verbose
npm run test:ui  # Debug visual
```

### Problema: Build falha

```bash
npm run lint:fix
npm run format
npm run typecheck
npm run build
```

## Roadmap

- [ ] Filtros e busca de tarefas
- [ ] Histórico de tarefas
- [ ] Exportar para PDF/CSV
- [ ] Integração com calendário
- [ ] Modo offline com sync
- [ ] Categorias customizadas
- [ ] Análise de produtividade
- [ ] Aplicativo mobile (React Native)

## Licença

Este projeto é para fins educacionais e de produtividade pessoal.

## Suporte

- 📖 [Documentação](./docs/)
- 🐛 [Issues](https://github.com/your-org/eisenhower-ai-matrix/issues)
- 💬 [Discussions](https://github.com/your-org/eisenhower-ai-matrix/discussions)
- 📧 Email: support@example.com

## Créditos

Desenvolvido com foco em alta performance, UX e qualidade de código como parte do **Synkra AIOS** framework.

---

**Versão**: 0.0.1
**Última Atualização**: 2026-01-28
**Mantido por**: Alan & Equipe
