# 🎯 TrendSniper

**Plataforma SaaS para extração, análise e exibição de tendências de criativos da Meta Ads Library**

TrendSniper é uma ferramenta poderosa que ajuda especialistas em tráfego pago a identificar tendências de criativos em tempo real, analisando anúncios do Facebook e Instagram por nicho, gancho, formato e CTA.

## 🚀 Funcionalidades

### 📊 Dashboard Inteligente
- **Visualização de tendências** em tempo real
- **Análise de ganchos** com IA (OpenAI GPT-4)
- **Filtros avançados** por nicho, formato, plataforma e CTA
- **Alertas automáticos** de padrões emergentes

### 🔍 Busca Avançada
- **Pesquisa por palavra-chave** em headlines e descrições
- **Filtros combinados** para análise granular
- **Histórico de criativos** com deduplicação automática
- **Exportação** em CSV/JSON

### 🤖 Análise de IA
- **Classificação automática** de tipos de gancho
- **Análise de sentimento** e urgência
- **Sugestões de melhorias** baseadas em tendências
- **Tags automáticas** para categorização

### 📈 Métricas e Relatórios
- **Dashboard executivo** com KPIs
- **Análise de performance** por período
- **Insights preditivos** sobre tendências futuras
- **Relatórios personalizados**

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TailwindCSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Firebase** - Banco de dados e autenticação
- **OpenAI GPT-4** - Análise de IA

### Scraping & Análise
- **Puppeteer** - Automação de browser
- **Cheerio** - Parsing HTML
- **Node-cron** - Agendamento de tarefas
- **Winston** - Logging

### Infraestrutura
- **Vercel** - Deploy do frontend
- **Render/Railway** - Deploy do backend
- **Firebase** - Banco de dados e autenticação
- **Stripe** - Pagamentos

## 🏗️ Arquitetura

```
trendsniper/
├── packages/
│   ├── frontend/          # Next.js App
│   ├── backend/           # Express API
│   └── shared/            # Tipos e utilitários compartilhados
├── docs/                  # Documentação
└── scripts/               # Scripts de setup e deploy
```

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase
- Chave OpenAI API
- Conta Stripe (opcional)

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/trendsniper.git
cd trendsniper

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Inicie o desenvolvimento
npm run dev
```

### Configuração Detalhada

1. **Configure o Firebase**
   ```bash
   # Crie um projeto no Firebase Console
   # Ative Firestore e Authentication
   # Baixe a chave de serviço e configure no .env
   ```

2. **Configure o OpenAI**
   ```bash
   # Obtenha sua API key em https://platform.openai.com/
   # Adicione OPENAI_API_KEY no .env
   ```

3. **Configure o Stripe (opcional)**
   ```bash
   # Crie uma conta no Stripe
   # Adicione STRIPE_SECRET_KEY no .env
   ```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend e backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build           # Build completo
npm run build:frontend  # Build frontend
npm run build:backend   # Build backend

# Testes
npm run test            # Executa todos os testes
npm run test:frontend   # Testes do frontend
npm run test:backend    # Testes do backend

# Linting
npm run lint            # Verifica código
npm run lint:fix        # Corrige problemas automaticamente

# Scraping
npm run scraper         # Executa scraper manualmente
npm run scheduler       # Inicia agendador de tarefas
```

## 📋 Configuração do Ambiente

### Variáveis de Ambiente Essenciais

```env
# Firebase
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_...

# JWT
JWT_SECRET=seu-jwt-secret-muito-seguro
```

### Estrutura do Banco de Dados

```
Firestore Collections:
├── users/              # Dados dos usuários
├── creatives/          # Criativos coletados
├── alerts/             # Alertas configurados
├── alert_triggers/     # Histórico de alertas
├── scraping_jobs/      # Jobs de scraping
└── trending_analysis/  # Análises de tendências
```

## 🎯 Planos de Uso

### Free Trial
- ✅ 30 criativos por mês
- ✅ 1 alerta
- ✅ 10 buscas por dia
- ✅ Análise básica de ganchos

### Pro Plan
- ✅ 10.000 criativos por mês
- ✅ 50 alertas
- ✅ 1.000 buscas por dia
- ✅ Análise avançada de ganchos
- ✅ Exportação CSV/JSON
- ✅ API de acesso
- ✅ Suporte prioritário

## 📊 Métricas do Sistema

### Performance
- ⚡ Tempo de resposta da API: < 500ms
- 🔄 Processamento de scraping: > 200 criativos/execução
- 🤖 Análise de IA: < 1.5s por criativo
- 📈 Disponibilidade: 99.9%

### Limites
- 📄 Arquivo de upload: 10MB
- 🔍 Resultados por busca: 100 itens
- ⏰ Rate limit: 100 req/15min por IP
- 📊 Retenção de dados: 12 meses

## 🔒 Segurança

- 🔐 **Autenticação Firebase** com JWT
- 🛡️ **Rate limiting** por IP
- 🔒 **Validação de dados** com Zod
- 🔍 **Logs de auditoria** completos
- 🚫 **Proteção CORS** configurada

## 📚 Documentação da API

### Endpoints Principais

```
GET    /api/creatives          # Listar criativos
GET    /api/creatives/:id      # Obter criativo
POST   /api/creatives/search   # Buscar criativos
GET    /api/dashboard/stats    # Estatísticas
POST   /api/alerts             # Criar alerta
GET    /api/alerts/triggers    # Histórico de alertas
```

### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "creatives": [...],
    "total": 1250,
    "page": 1,
    "hasNext": true
  }
}
```

## 🚀 Deploy

### Frontend (Vercel)
```bash
# Conecte o repositório no Vercel
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### Backend (Render)
```bash
# Crie um novo Web Service no Render
# Configure as variáveis de ambiente
# Deploy automático a cada push
```

### Firebase Setup
```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Configure o projeto
firebase login
firebase init

# Deploy das regras
firebase deploy --only firestore:rules
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@trendsniper.com
- 💬 Discord: [TrendSniper Community](https://discord.gg/trendsniper)
- 📖 Documentação: [docs.trendsniper.com](https://docs.trendsniper.com)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/trendsniper/issues)

## 🎉 Agradecimentos

- **OpenAI** pela API GPT-4
- **Meta** pela Ads Library
- **Vercel** pela hospedagem
- **Comunidade** de desenvolvedores

---

**Desenvolvido com ❤️ pela equipe TrendSniper**