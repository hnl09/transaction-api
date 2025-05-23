# Transaction Statistics API - Desafio Técnico NestJS

API RESTful desenvolvida em **NestJS** com **TypeScript** para gerenciar transações financeiras e fornecer estatísticas em tempo real.

> **Arquitetura:** Clean Architecture  
> **Armazenamento:** Em memória  
> **Funcionalidades:** Logging estruturado, rate limiting, documentação Swagger, containerização com Docker.

---

## :rocket: Funcionalidades

- **Criar transação:** `POST /transactions`
- **Excluir todas as transações:** `DELETE /transactions`
- **Obter estatísticas dos últimos 60s:** `GET /transactions/statistics`
- **Health Check:** `GET /health`
- **Logging estruturado:** `nestjs-pino`
- **Validação de dados:** `class-validator`, `class-transformer`
- **Tratamento de erros HTTP**
- **Segurança:** `helmet`
- **Rate limiting:** `@nestjs/throttler`
- **Documentação Swagger**
- **Containerização:** Docker & Docker Compose
- **Testes:** Unitários e E2E com Jest

---

## :hammer_and_wrench: Tecnologias

- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Gerenciador de Pacotes:** pnpm
- **Logging:** nestjs-pino
- **Validação:** class-validator, class-transformer
- **Documentação:** @nestjs/swagger
- **Segurança:** helmet
- **Rate Limiting:** @nestjs/throttler
- **Testes:** Jest, Supertest
- **Containerização:** Docker
- **Configuração:** @nestjs/config

---

## :clipboard: Pré-requisitos

- Node.js 18.x ou superior
- pnpm (ou npm/yarn)
- Docker

---

## :gear: Configuração do Ambiente

A aplicação utiliza arquivos `.env` na raiz do projeto:

- `.env.dev` — Desenvolvimento
- `.env.prod` — Produção (Docker)
- `.env.example` — Exemplo de configuração

---

## :package: Instalação

```bash
git clone <url-desse-repositório>
cd transaction-api
pnpm install
```

---

## :computer: Executando a Aplicação

### Desenvolvimento

```bash
pnpm run start:dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

### Produção (local)

```bash
pnpm run build
pnpm run start:prod
```

### Docker

1. Certifique-se de que `.env.prod` existe na raiz.
2. Execute:

```bash
sudo docker compose up --build
```

- Acesse: [http://localhost:3000](http://localhost:3000) (ajuste conforme sua porta no `docker-compose.yml`)

**Comandos úteis:**
```bash
sudo docker compose down          # Parar containers
sudo docker compose logs -f api   # Ver logs da API
```

---

## :test_tube: Testes

- **Unitários:**  
  `pnpm run test`
- **Unitários em watch:**  
  `pnpm run test:watch`
- **Cobertura:**  
  `pnpm run test:cov`
- **E2E:**  
  `pnpm run test:e2e`

---

## :triangular_ruler: Lint & Formatação

```bash
pnpm run lint      # Lint
pnpm run format    # Prettier
```

---

## :bookmark_tabs: Documentação Swagger

Após iniciar a aplicação, acesse:

```
http://localhost:<PORTA_DA_API>/api/docs
```
Exemplo:  
- Desenvolvimento: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Docker: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)