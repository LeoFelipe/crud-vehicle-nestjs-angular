# 💻 Backend - NestJS

> Este é o `README` específico do backend. Para uma visão geral, consulte o [README principal](../README.md).

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <strong>Um sistema de gerenciamento de veículos robusto, desenvolvido com NestJS e seguindo os princípios da Clean Architecture.</strong>
</p>

## ✨ Tecnologias

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Mensageria**: [RabbitMQ](https://www.rabbitmq.com/)
- **Testes**: [Jest](https://jestjs.io/)
- **Validação**: [class-validator](https://github.com/typestack/class-validator)
- **Documentação da API**: [Swagger (OpenAPI)](https://swagger.io/)

## 🏗️ Arquitetura

O projeto adota os princípios da **Clean Architecture** para garantir um código desacoplado, testável e de fácil manutenção. A estrutura de diretórios reflete essa separação de responsabilidades:

-   `src/domain`: Contém as regras de negócio, entidades (`Veiculo`), eventos de domínio e interfaces de repositório. É o núcleo da aplicação, sem dependências externas.
-   `src/application`: Orquestra o fluxo de dados através dos casos de uso (use cases), interagindo com o domínio e as camadas externas.
-   `src/infrastructure`: Implementa as interfaces definidas no domínio, como repositórios de banco de dados (Prisma) e serviços de mensageria (RabbitMQ).
-   `src/presentation`: A camada mais externa, responsável por expor a API (controllers), definir os DTOs e tratar as requisições HTTP.

## 🧪 Testes

O projeto possui uma estratégia completa de testes para garantir a qualidade e a estabilidade do código, com alta cobertura.

### Tipos de Teste

-   **Testes de Unidade**: Focados em isolar e validar as menores partes do código, como as regras de negócio em entidades de domínio e a lógica dos casos de uso.
-   **Testes de Integração**: Verificam a interação entre diferentes camadas da aplicação, especialmente os controllers, garantindo que o fluxo de uma requisição HTTP funcione corretamente desde a entrada até a resposta.

### Como executar

-   **Executar todos os testes (unitários e integração):**
    ```bash
    npm run test
    ```
-   **Gerar relatório de cobertura de testes:**
    ```bash
    npm run test:cov
    ```

## 📋 Endpoints da API

A documentação completa e interativa da API está disponível via **Swagger** no endpoint `/api` após iniciar a aplicação.

-   **URL do Swagger**: [http://localhost:3000/api](http://localhost:3000/api)

| Método   | Endpoint        | Descrição              |
| :------- | :-------------- | :--------------------- |
| `POST`   | `/veiculos`     | Cria um novo veículo.  |
| `GET`    | `/veiculos`     | Lista todos os veículos. |
| `GET`    | `/veiculos/:id` | Busca um veículo por ID. |
| `PUT`    | `/veiculos/:id` | Atualiza um veículo.   |
| `DELETE` | `/veiculos/:id` | Desativa um veículo.   |

### Exemplo de Criação

**Request:** `POST /veiculos`
```json
{
  "placa": "BRA2E19",
  "chassi": "1234567890ABCDEFG",
  "renavam": "12345678901",
  "modelo": "HB20",
  "marca": "Hyundai",
  "ano": 2023
}
```

**Response (201 Created):**
```json
{
    "id": "cfa3f2a8-1b2c-4d5e-9f6a-7b8c9d0e1f2a",
    "placa": "BRA2E19",
    "chassi": "1234567890ABCDEFG",
    "renavam": "12345678901",
    "modelo": "HB20",
    "marca": "Hyundai",
    "ano": 2023,
    "status": "EM_ATIVACAO",
    "createdAt": "2024-06-21T00:00:00.000Z",
    "updatedAt": "2024-06-21T00:00:00.000Z"
}
```

## ⚡ Arquitetura Orientada a Eventos

O projeto utiliza uma **Arquitetura Orientada a Eventos (Event-Driven Architecture)** para promover o desacoplamento entre diferentes partes do sistema.

-   **Eventos de Domínio**: Ocorrencias significativas no negócio são capturadas como **Eventos de Domínio** (ex: `VeiculoCriadoEvent`). Isso permite que múltiplos *listeners* reajam a uma ação sem que o código original precise conhecê-los.
-   **Event Bus**: Um barramento de eventos (`EventBus`) centraliza a publicação de eventos, permitindo que *handlers* registrados sejam notificados.
-   **Integração com Mensageria**: Os event handlers podem utilizar o `QueuePublisher` para enviar mensagens assíncronas quando eventos de domínio ocorrem, mas a mensageria não está limitada apenas aos eventos - pode ser usada em qualquer parte da aplicação.

### 📨 Mensageria Assíncrona com RabbitMQ

Para operações que podem ser executadas de forma assíncrona, o projeto utiliza o **RabbitMQ**.

-   **Publicação de Mensagens**: O `QueuePublisher` é responsável por publicar mensagens nas filas do RabbitMQ. Esta é uma ferramenta independente que pode ser utilizada em qualquer parte da aplicação (use cases, event handlers, services, etc.) para enviar mensagens de forma assíncrona, separando a lógica de negócio da responsabilidade de enviar uma mensagem.
-   **Consumers**: Serviços independentes (`consumers`) escutam as filas e processam as mensagens de forma assíncrona. Por exemplo, um consumer é responsável por finalizar a ativação de um veículo.
-   **Orquestração com Docker Compose**: O `docker-compose.yml` já gerencia a execução dos consumers como serviços separados, garantindo que o ecossistema de mensageria funcione de forma integrada.

## 📑 Tratamento de Erros

A API possui um `ExceptionFilter` global que padroniza todas as respostas de erro, garantindo consistência para o cliente.

-   **Erros de Validação (400)**: Ocorrem quando os dados de entrada (DTOs) não atendem às regras definidas (ex: placa com formato inválido).
-   **Erros de Negócio (400)**: Ocorrem quando uma regra de negócio é violada (ex: tentar cadastrar uma placa que já existe).
-   **Erros de Servidor (500)**: Para exceções não tratadas, uma resposta genérica é enviada.
