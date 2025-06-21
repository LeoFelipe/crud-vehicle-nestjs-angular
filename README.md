# 🚗 CRUD de Veículos - Monorepo

[![Status](https://img.shields.io/badge/status-concluído-green)]()
[![Tecnologia](https://img.shields.io/badge/backend-NestJS-red)]()
[![Tecnologia](https://img.shields.io/badge/frontend-Angular-blue)]()
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-brightgreen)](LICENSE)

## 🎯 Sobre este projeto

Este projeto é um sistema completo de **CRUD (Create, Read, Update, Delete) de veículos**, desenvolvido como parte de um teste técnico. Ele engloba um backend robusto com **NestJS** e um frontend reativo com **Angular**, ambos containerizados com Docker e orquestrados via Docker Compose para um ambiente de desenvolvimento simplificado.

### ✨ Funcionalidades

- **Backend em Node.js com NestJS** seguindo os princípios de **Clean Architecture**.
- **CRUD completo de veículos** com os campos: `id`, `placa`, `chassi`, `renavam`, `modelo`, `marca`, `ano` e `status`.
- **API RESTful** com tratamento de erros padronizado e validações.
- **Mensageria com RabbitMQ** para processamento assíncrono de status de veículos.
- **Banco de dados PostgreSQL** com migrations gerenciadas pelo **Prisma ORM**.
- **Testes automatizados** no backend com Jest.
- **Documentação da API** gerada automaticamente com **Swagger (OpenAPI)**.
- **Frontend em Angular** com interface moderna utilizando **Angular Material**.
- **Containerização completa** com **Docker** e orquestração com **Docker Compose**.

## 🚀 Como executar o projeto

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.

Com tudo pronto, execute o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```

O comando irá construir as imagens e iniciar todos os contêineres. Após a conclusão, os serviços estarão disponíveis nos seguintes endereços:

-   **Frontend (Angular)**: [http://localhost:4200](http://localhost:4200)
-   **Backend (NestJS API)**: [http://localhost:3000](http://localhost:3000)
-   **Documentação da API (Swagger)**: [http://localhost:3000/api](http://localhost:3000/api)
-   **RabbitMQ Management**: [http://localhost:15672](http://localhost:15672) (login: `guest` / senha: `guest`)

## 📚 Documentação detalhada

Para mais informações sobre cada parte do projeto, consulte os `README` específicos:

-   **📄 [Backend (NestJS)](./backend/README.md)**
-   **📄 [Frontend (Angular)](./frontend/README.md)** 