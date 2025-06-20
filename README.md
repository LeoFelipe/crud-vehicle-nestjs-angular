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
  <strong>Sistema de gerenciamento de veículos desenvolvido em NestJS seguindo os princípios da Clean Architecture.</strong>
</p>


## 🚗 Funcionalidades

- **CRUD completo** de veículos (Create, Read, Update, Delete)
- **Validação robusta** de dados de entrada
- **Clean Architecture** com separação clara de responsabilidades
- **Eventos de domínio** para desacoplamento
- **Cache em memória** para performance
- **RabbitMQ** para mensageria
- **Testes automatizados** com alta cobertura

## 🏗️ Arquitetura

```
src/
├── domain/           # Regras de negócio, entidades, eventos de domínio
│   ├── entities/
│   ├── events/
│   ├── repositories/
│   └── value-objects/
├── application/      # Casos de uso, mapeadores
│   ├── use-cases/
│   ├── mappers/
│   └── event-bus/
├── infrastructure/   # Implementações externas (DB, Cache, Messaging)
│   ├── database/
│   ├── cache/
│   └── messaging/
├── presentation/     # Controllers, DTOs de request/response, validações
│   ├── controllers/
│   ├── requests/
│   ├── responses/
│   └── validators/
```

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **SQLite** - Banco de dados (em memória)
- **Jest** - Framework de testes
- **class-validator** - Validação de dados
- **RabbitMQ** - Mensageria

## 📦 Instalação

```bash
npm install
```

## 🚀 Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

## 🧪 Testes

O projeto possui uma estratégia completa de testes com diferentes níveis de cobertura:

### 1. Testes Unitários
Testam componentes isolados (entidades, casos de uso, mapeadores).

```bash
# Executar todos os testes unitários
npm run test

# Executar testes unitários com coverage
npm run test:cov
```

**Exemplos de testes unitários:**
- ✅ Entidade `Veiculo` (validações de domínio)
- ✅ Casos de uso (Create, Update, Delete, Get)
- ✅ Mapeadores (DTO ↔ Entidade)

### 2. Testes de Integração
Testam a integração entre componentes (controllers + casos de uso + validações).

```bash
# Executar testes de integração
npm run test:integration
```

**Exemplos de testes de integração:**
- ✅ Controllers (fluxo HTTP completo)
- ✅ Validação de DTOs
- ✅ Status HTTP corretos (200, 201, 400, 404, 500)
- ✅ Estrutura de resposta JSON
- ✅ Integração entre camadas (Presentation ↔ Application)

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

O projeto utiliza RabbitMQ para publicação e consumo real de mensagens em filas para eventos de domínio.

### Variáveis de ambiente

- `RABBITMQ_URL`: URL de conexão do RabbitMQ (default: `amqp://localhost`)

### Executando os Consumers

Os consumers processam eventos de ativação e desativação de veículos publicados nas filas.

#### Ativar veículo (consumer):

```sh
node dist/infrastructure/messaging/consume-veiculo-em-ativacao.js
```

#### Desativar veículo (consumer):

```sh
node dist/infrastructure/messaging/consume-veiculo-em-desativacao.js
```

> **Dica:** Rode cada consumer em um terminal separado.

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


## 📝 Licença

Este projeto está sob a licença MIT.

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
