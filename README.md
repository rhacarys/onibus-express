# 🚌 OniBus Express

**Sistema Completo de Venda de Passagens Rodoviárias (MVP)**

Este repositório contém a solução Full Stack para o desafio técnico **OniBus Express**. O projeto foi arquitetado como um **Monorepo** (usando `pnpm workspaces`), unificando o Backend (.NET 8) e o Frontend (React), com foco em performance, código limpo (SOLID), resiliência e facilidade de execução para avaliação.

---

## 🎯 Destaques da Avaliação (Plus Atingidos)

Para facilitar a correção, aqui estão os pontos extras implementados conforme os critérios de avaliação:

- ✅ **Full Stack Integrado:** API e Cliente rodando em sincronia total.
- ✅ **Docker com 1 Comando:** `docker-compose up --build` sobe todo o ecossistema.
- ✅ **Documentação Viva:** Swagger OpenAPI implementado e exposto nativamente.
- ✅ **Tratamento de Erros e UX:** Proteção por `ErrorBoundary`, validação de formulários com Zod/MUI, e proxy reverso local para evitar problemas de CORS.
- ✅ **Testes Automatizados:** Testes unitários de Frontend e E2E isolados (Playwright).

---

## 🛠️ Tecnologias e Decisões de Arquitetura

### 🖥️ Backend (.NET 8)

- **Arquitetura:** ASP.NET Core Minimal APIs.
- _Por quê?_ Reduz drasticamente o boilerplate de Controllers, entregando rotas mais rápidas e código altamente coeso para o escopo de um MVP.

- **Banco de Dados:** Entity Framework Core + **SQLite In-Memory** (`Cache=Shared`).
- _Por quê?_ Permite que o avaliador rode o projeto instantaneamente sem precisar configurar um servidor de banco de dados. O SQLite em memória suporta mapeamentos relacionais complexos nativamente (diferente do `InMemoryProvider` padrão), garantindo segurança em requisições assíncronas concorrentes.

### 🎨 Frontend (ReactJS)

- **Core:** React 19 + Vite + TypeScript.
- **Gerenciamento de Estado:** Zustand (Estado Global) e TanStack Query (Estado de Servidor).
- _Por quê?_ Separa a lógica de _data-fetching_ (cache, retries, loading states) da lógica de UI, mantendo os componentes puros e performáticos.

- **Formulários:** React Hook Form + Zod.
- _Por quê?_ Validação estrita e tipada em tempo de compilação e execução, com renderizações otimizadas.

- **UI/UX:** Material UI (MUI).
- **Testes:** Vitest (Unitários) + Playwright (E2E).

---

## 🚀 Como Executar o Projeto

Você pode rodar a aplicação através do Docker (recomendado) ou localmente em ambiente de desenvolvimento.

### Opção 1: Via Docker (Recomendado)

A abordagem mais rápida. Utiliza _Multi-Stage Builds_ para compilar e servir as aplicações em containers Alpine extremamente leves (Backend exposto pelo Kestrel e Frontend pelo Nginx).

1. Na raiz do repositório, execute:

```bash
docker-compose up --build

```

2. **Acesse as aplicações:**

- **Frontend:** [http://localhost](https://www.google.com/search?q=http://localhost)
- **Swagger API:** [http://localhost:5000/swagger](https://www.google.com/search?q=http://localhost:5000/swagger)

### Opção 2: Localmente (Modo Dev)

Ideal para inspecionar o código e ver o _Hot Module Replacement_ em ação. O `package.json` raiz está configurado para gerenciar ambas as pontas simultaneamente.

**Pré-requisitos:** Node.js 20+, pnpm 9+ e SDK do .NET 8.

1. Instale as dependências do workspace:

```bash
pnpm install

```

2. Inicie o Backend e o Frontend paralelamente:

```bash
pnpm dev

```

> **Nota de Arquitetura:** O Vite está configurado com um _Proxy Reverso_ (`/api` -> `http://localhost:5000`). Isso significa que o frontend roda na porta `5173`, interage com a própria porta, e o Vite roteia as chamadas para o .NET de forma invisível.

---

## 🧪 Como Rodar os Testes

### Testes do Frontend (Integração e E2E)

Executa validações de UI e fluxos de navegação completos.

```bash
# Executa testes unitários/componentes (Vitest)
pnpm test

# Executa testes End-to-End simulando navegador real (Playwright)
pnpm test:e2e

```

---

## 📚 Documentação da API (Swagger)

A API documenta a si mesma utilizando OpenAPI. Com o projeto em execução, acesse `/swagger` na porta da API (geralmente `http://localhost:5000/swagger`).

**Principais Endpoints Implementados:**

| Método  | Endpoint                | Descrição                                                    |
| ------- | ----------------------- | ------------------------------------------------------------ |
| `GET`   | `/api/v1/cidades`       | Lista origens e destinos dinamicamente.                      |
| `GET`   | `/api/v1/viagens`       | Filtra viagens por rota e data exata.                        |
| `GET`   | `/api/v1/viagens/{id}`  | Retorna dados da viagem e array de assentos ocupados.        |
| `POST`  | `/api/v1/reservas`      | Processa checkout e valida concorrência ("Assento Ocupado"). |
| `GET`   | `/api/v1/reservas`      | Consulta por `codigoReserva` gerado.                         |
| `PATCH` | `/api/v1/reservas/{id}` | Altera o status para "cancelada" validando prazo de 2h.      |

---

## 🔮 O que ficou de fora e Próximos Passos (Evolução)

Dado o escopo de tempo, algumas decisões foram tomadas para priorizar a entrega de valor contínuo. Caso o projeto escalasse, estas seriam as próximas implementações:

1. **Persistência Definitiva (PostgreSQL):** Trocar o SQLite in-memory por um banco relacional robusto.
2. **Autenticação e Autorização (JWT):** Implementar fluxos de login para que usuários possam listar o histórico de suas próprias viagens e um painel de Admin para criação de novas rotas e horários.
3. **Idempotência no Checkout:** Adicionar idempotência nos headers de reserva para evitar compras duplicadas caso o cliente perca a conexão na tela de pagamento.
4. **Mensageria (RabbitMQ/Kafka):** Desacoplar o envio de e-mails de confirmação do fluxo de requisição HTTP principal utilizando processamento assíncrono (_Background Services_).
