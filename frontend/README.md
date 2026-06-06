# OniBus Express - Frontend

Este repositório contém o frontend da aplicação **OniBus Express**, desenvolvido em React e otimizado para alta performance, acessibilidade e resiliência.

---

## 🛠️ Tecnologias Core

* **UI/State:** React 19, Vite, Material UI (MUI), Zustand (Estado Global Semântico).
* **Data Fetching:** TanStack Query v5 (React Query) & Axios.
* **Formulários:** React Hook Form + Zod (Validação estrita).
* **Testes:** Playwright (E2E) & Vitest (Unitários/Integração).

---

## 📐 Diretrizes de Arquitetura e Código

### 1. Padronização de Idioma (Clean Code)

* **Domínio do Negócio:** Sempre em **Português** (Ex: `PassageiroForm.tsx`, `useReservaStore.ts`, `viagemId`, `assento`).
* **Infraestrutura/Biblioteca:** Mantido o padrão das ferramentas em **Inglês** (Ex: `isLoading`, `isPending`, `error`, `mutationFn`).

### 2. Resiliência (Tratamento de Erros)

* **Global:** Proteção contra quebras catastróficas da árvore DOM utilizando `ErrorBoundary` na raiz da aplicação.
* **Granular:** Erros de requisições de mutação/redirecionamentos são interceptados contextualmente usando `Alert` e `Snackbar` do Material UI sem desmontar componentes.

---

## 🚀 Inicialização Local

### Pré-requisitos

* Node.js 20+
* pnpm 9+

### Instalação de Dependências

A partir da raiz do repositório (Monorepo):

```bash
pnpm install

```

### Executar em Desenvolvimento

```bash
pnpm --filter frontend dev

```

---

## 🌐 Gerenciamento de Mocks (MSW)

O ecossistema utiliza o **Mock Service Worker (MSW v2)** para simulação de APIs. Por segurança, os mocks vêm **desabilitados** por padrão no arquivo `.env` para evitar vazamento em produção.

Para ativar os mocks no desenvolvimento local:

1. Crie o arquivo `.env.local` dentro da pasta `frontend/`:

```env
VITE_USE_MSW=true

```

2. Reinicie o servidor local. O Service Worker interceptará as requisições na aba *Network*.

---

## 🧪 Suíte de Testes

### 1. Testes Unitários e de Integração (Vitest)

Focados em hooks customizados, utilitários e regras de validação.

```bash
pnpm --filter frontend test:ci

```

### 2. Testes End-to-End (Playwright + MSW)

Os testes E2E simulam a jornada completa de compra e fluxos de exceção (assento ocupado, validação de formulários e rotas protegidas).

A arquitetura de testes injeta automaticamente `VITE_USE_MSW=false` no servidor do Playwright. O tráfego de rede é interceptado nativamente no nível do Node através do arquivo `fixtures.ts`, garantindo isolamento total.

```bash
# Execução headless
pnpm --filter frontend test:e2e

# Execução com Interface Gráfica (UI Mode)
pnpm --filter frontend test:e2e:ui

```

---

## 🐳 Docker & Orquestração

O projeto está modularizado para rodar em containers isolados utilizando **Multi-Stage Builds** para garantir imagens leves de produção rodando sob o **Nginx**.

### Inicializar todo o ecossistema (Backend + Frontend)

A partir da raiz do projeto:

```bash
docker-compose up --build

```

*O frontend aguardará o healthcheck positivo do backend (`http://localhost:3000`) antes de liberar a porta `80` para navegação.*

---

## 🔄 Esteira de CI/CD (GitHub Actions)

O workflow configurado em `.github/workflows/playwright.yml` é disparado a cada `push` ou `pull_request` nas branches principais e executa rigorosamente os seguintes passos:

1. **Instalação e Cache:** Configura o Node.js, instala o pnpm e aplica cache agressivo do store global do pnpm.
2. **Qualidade:** Roda o Linter (`eslint`).
3. **Segurança de Regressão:** Executa toda a suíte de testes do Vitest.
4. **Isolamento E2E:** Instala as dependências binárias dos navegadores do Playwright e roda os testes E2E injetando a flag de isolamento de rede.
5. **Artefatos:** Consolida e armazena relatórios HTML do Playwright por 30 dias em caso de falhas na esteira.
