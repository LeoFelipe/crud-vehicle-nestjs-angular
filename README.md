# CRUD de Veículos - NestJS

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://github.com/your-username/crud-vehicle-nestjs" target="_blank">
    <img src="https://img.shields.io/badge/CRUD%20Veículos-NestJS-blue?style=for-the-badge&logo=nestjs" alt="CRUD Veículos NestJS" />
  </a>
  <a href="https://github.com/your-username/crud-vehicle-nestjs/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
  </a>
  <a href="https://github.com/your-username/crud-vehicle-nestjs" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://jestjs.io/" target="_blank">
    <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  </a>
  <a href="https://github.com/your-username/crud-vehicle-nestjs" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  </a>
</p>

<p align="center">
  📝 Licença: Este projeto está sob a licença MIT.
</p>

<p align="center">
  <strong>Sistema de gerenciamento de veículos desenvolvido em NestJS seguindo os princípios da Clean Architecture.</strong>
</p>

## 🎯 Sobre este projeto

Este projeto foi desenvolvido como parte do processo seletivo para a vaga de desenvolvedor, conforme os requisitos propostos no teste técnico.

### Requisitos atendidos

- **Backend em Node.js com NestJS:**  O projeto utiliza o framework NestJS, seguindo boas práticas de modularização, injeção de dependências e arquitetura limpa.
- **CRUD de veículos:**  Implementação completa do CRUD para veículos, com os campos: id, placa, chassi, renavam, modelo, marca e ano. Os dados são persistidos em banco de dados PostgreSQL.
- **Recursos RESTful:**  Todos os endpoints seguem o padrão REST, permitindo criar, listar, buscar por ID, atualizar e deletar veículos.
- **Testes automatizados com Jest:**  O projeto possui testes unitários e de integração para os principais casos de uso, garantindo a qualidade e a robustez da aplicação.
- **Documentação automática da API:**  A API está documentada com Swagger, disponível em `/api`, facilitando a visualização e o teste dos endpoints.
- **Containerização com Docker:**  Toda a aplicação pode ser executada via Docker Compose, incluindo banco de dados PostgreSQL e mensageria RabbitMQ.
- **Mensageria real com RabbitMQ:**  Eventos de domínio são publicados e consumidos via RabbitMQ, com consumers rodando como serviços independentes (microserviços parciais).
- **Tratamento padronizado de erros:**  Todas as respostas de erro seguem um padrão único, facilitando o consumo da API por clientes.
- **Código público:**  O projeto está disponível em repositório público no GitHub.

### Diferenciais implementados

- Clean Architecture e separação clara de camadas.
- Exception Filter global para padronização de erros.
- Testes de endpoints (integração) e cobertura de código.
- Uso real de RabbitMQ para mensageria.
- Documentação Swagger gerada automaticamente.

## 🚗 Funcionalidades

- **CRUD completo** de veículos (Create, Read, Update, Delete)
- **Validação robusta** de dados de entrada (DTOs com class-validator)
- **Clean Architecture** com separação clara de responsabilidades
- **Eventos de domínio** para desacoplamento
- **Cache em memória** para performance
- **RabbitMQ real** para mensageria (publicação e consumo de eventos)
- **PostgreSQL** como banco de dados relacional
- **Documentação automática da API com Swagger**
- **Tratamento padronizado de erros de validação e negócio**
- **Testes automatizados** com alta cobertura
- **Containerização com Docker e Docker Compose**
- **Consumers de eventos como serviços independentes (microserviços parciais)**

## 🏗️ Arquitetura

```
src/
├── domain/           # Regras de negócio, entidades, eventos de domínio
│   ├── entities/
│   ├── events/
│   ├── repositories/
│   └── value-objects/
├── application/      # Casos de uso, mapeadores, event-bus
│   ├── use-cases/
│   ├── mappers/
│   └── event-bus/
├── infrastructure/   # Implementações externas (DB, Cache, Messaging)
│   ├── database/
│   ├── cache/
│   └── messaging/
├── presentation/     # Controllers, DTOs de request/response, validações, filters, exceptions
│   ├── controllers/
│   ├── requests/
│   ├── responses/
│   ├── validators/
│   ├── filters/      # Exception filters globais
│   └── exceptions/   # Exceções customizadas de negócio
```
- **Exception Filter global** para padronização de respostas de erro
- **Consumers de eventos** (ativação/desativação) como serviços separados no Docker Compose

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados relacional
- **RabbitMQ** - Mensageria real
- **Jest** - Framework de testes
- **class-validator** - Validação de dados
- **Swagger** (`@nestjs/swagger`, `swagger-ui-express`) - Documentação automática da API
- **Docker & Docker Compose** - Containerização e orquestração

## 🚀 Execução

### Rodando com Docker Compose

```bash
docker-compose up --build
```
- A aplicação estará disponível em: http://localhost:3000
- A documentação Swagger estará em: http://localhost:3000/api
- O painel do RabbitMQ estará em: http://localhost:15672 (usuário/senha: guest/guest)

### Rodando localmente (sem Docker)

```bash
npm run start:dev
```

> **Observação:** O projeto depende de PostgreSQL e RabbitMQ. Recomenda-se usar o Docker Compose para facilitar o setup do ambiente.

## 🧪 Testes

O projeto possui uma estratégia completa de testes com diferentes níveis de cobertura:

### 1. Testes Unitários
Testam componentes isolados (entidades, casos de uso, mapeadores).

**Exemplos de testes unitários:**
- ✅ Entidade `Veiculo` (validações de domínio)
- ✅ Casos de uso (Create, Update, Delete, Get)
- ✅ Mapeadores (DTO ↔ Entidade)

### 2. Testes de Integração
Testam a integração entre componentes (controllers + casos de uso + validações), incluindo testes de endpoints HTTP.

**Exemplos de testes de integração:**
- ✅ Controllers (fluxo HTTP completo)
- ✅ Validação de DTOs
- ✅ Status HTTP corretos (200, 201, 400, 404, 500)
- ✅ Estrutura de resposta JSON
- ✅ Integração entre camadas (Presentation ↔ Application)

> **Observação:** Todos os testes (unitários e de integração) são executados juntos pelo comando padrão:

```bash
npm run test
```

Para cobertura de testes, utilize:

```bash
npm run test:cov
```

## 📋 Endpoints da API

### Veículos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/veiculos` | Criar novo veículo |
| `GET` | `/veiculos` | Listar todos os veículos |
| `GET` | `/veiculos/:id` | Buscar veículo por ID |
| `PUT` | `/veiculos/:id` | Atualizar veículo |
| `DELETE` | `/veiculos/:id` | Deletar veículo |

### Exemplo de Request/Response

**Criar Veículo:**
```bash
POST /veiculos
Content-Type: application/json

{
  "placa": "ABC1234",
  "chassi": "12345678901234567",
  "renavam": "12345678901",
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2023
}
```

**Response (201):**
```json
{
  "id": "uuid-gerado",
  "placa": "ABC1234",
  "chassi": "12345678901234567",
  "renavam": "12345678901",
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2023,
  "status": "ativo",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## 📨 Mensageria com RabbitMQ

O projeto utiliza **RabbitMQ real** para publicação e consumo de eventos de domínio.

- **Publicação de eventos:** A aplicação publica eventos de domínio (ex: VeiculoCriado, VeiculoEmDesativacao) nas filas do RabbitMQ.
- **Consumers como microserviços parciais:** Os consumers de ativação e desativação de veículos rodam como serviços separados no Docker Compose, processando eventos de suas respectivas filas.
- **Variáveis de ambiente:**
  - `RABBITMQ_URL`: URL de conexão do RabbitMQ (default: `amqp://localhost`)

### Executando os Consumers

Os consumers processam eventos de ativação e desativação de veículos publicados nas filas.

- **Ativar veículo (consumer):**
  ```sh
  node dist/infrastructure/messaging/consume-veiculo-em-ativacao.js
  ```
- **Desativar veículo (consumer):**
  ```sh
  node dist/infrastructure/messaging/consume-veiculo-em-desativacao.js
  ```

> **Dica:** Rode cada consumer em um terminal separado ou utilize o Docker Compose, que já sobe ambos automaticamente.

## 🗂️ Organização dos DTOs

- **presentation/requests/**: DTOs de entrada (RequestDto)
- **presentation/responses/**: DTOs de saída (ResponseDto)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Modo desenvolvimento com hot reload
npm run start:debug    # Modo debug
npm run start:prod     # Modo produção

# Testes
npm run test           # Testes unitários
npm run test:watch     # Testes em modo watch
npm run test:cov       # Testes com coverage
npm run test:debug     # Testes em modo debug

# Build
npm run build          # Compilar TypeScript
npm run format         # Formatar código
```


## 📊 Cobertura de Testes

```
Test Suites: 7 passed, 7 total
Tests:       52 passed, 52 total
Coverage:    95%+
```


## 🏛️ Clean Architecture

### Domain Layer
- **Entidades**: `Veiculo`, `StatusVeiculo`
- **Eventos**: `VeiculoCriado`, `VeiculoAtualizado`, `VeiculoEmDesativacao`
- **Interfaces**: `VeiculoRepository`

### Application Layer
- **Casos de Uso**: Create, Update, Delete, Get, GetById
- **Mapeadores**: VeiculoMapper
- **EventBus**: EventBus, Handlers

### Infrastructure Layer
- **Repositório**: SQLite em memória
- **Cache**: Cache em memória
- **Mensageria**: RabbitMQ (publicador e consumers)

### Presentation Layer
- **Controllers**: VeiculoController
- **DTOs**: Requests/Responses
- **Validações**: class-validator decorators


## 🐳 Docker Compose

Para rodar toda a stack (aplicação, RabbitMQ e consumers) via Docker Compose:

```sh
docker-compose up --build
```

- Acesse a aplicação em: http://localhost:3000
- Acesse o painel do RabbitMQ em: http://localhost:15672 (usuário/senha: guest/guest)

### Consumers

Os consumers de ativação e desativação de veículos sobem automaticamente como serviços no Docker Compose:
- `consumer-ativacao`: processa a fila de ativação de veículos
- `consumer-desativacao`: processa a fila de desativação de veículos

Você pode visualizar os logs de cada consumer com:

```sh
docker-compose logs -f consumer-ativacao
```

```sh
docker-compose logs -f consumer-desativacao
```

Não é necessário rodar manualmente os scripts de consumer.

## 📑 Tratamento de Erros

Todas as respostas de erro seguem o formato padronizado:

```json
{
  "success": false,
  "statusCode": 400,
  "response": [
    "mensagem de erro 1",
    "mensagem de erro 2"
  ]
}
```

- **Validações de DTO:** retornam 400 com lista de erros de validação.
- **Erros de negócio:** retornam 400 com lista de erros de regra de negócio.
- **Erros internos:** retornam 500 com mensagem genérica.

## 📖 Swagger - Documentação da API

A documentação interativa da API está disponível em:

```
http://localhost:3000/api
```

- Visualize e teste todos os endpoints.
- Veja exemplos de request/response e schemas dos DTOs.
- A documentação é gerada automaticamente a partir dos controllers e DTOs decorados com `@nestjs/swagger`.
