# CRUD de Veículos - Monorepo

## 🎯 Sobre este projeto

Este projeto foi desenvolvido como parte de um teste técnico para vaga de desenvolvedor. Ele engloba um backend (NestJS) e um frontend (Angular), ambos containerizados e orquestrados via Docker Compose.

### Requisitos atendidos
- **Backend em Node.js com NestJS**
- **CRUD de veículos** (id, placa, chassi, renavam, modelo, marca, ano)
- **Recursos RESTful**
- **Testes automatizados com Jest**
- **Documentação automática da API (Swagger)**
- **Containerização com Docker Compose**
- **Mensageria real com RabbitMQ**
- **Tratamento padronizado de erros**
- **Frontend Angular (opcional, diferencial)**
- **Código público**

### Diferenciais implementados
- Clean Architecture
- Exception Filter global
- Testes de endpoints (integração)
- Uso real de RabbitMQ
- Documentação Swagger

## 📁 Estrutura do Monorepo

```
/
├── README.md           # Visão geral do projeto (este arquivo)
├── docker-compose.yml  # Orquestração de todos os serviços
├── backend/            # Backend NestJS (API, testes, docs)
│   └── README.md
├── frontend/           # Frontend Angular
│   └── README.md
```

## 🚀 Como executar tudo com Docker Compose

```bash
docker-compose up --build
```
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api
- Frontend: http://localhost:4200
- RabbitMQ: http://localhost:15672 (guest/guest)

## 📚 Documentação detalhada
- [Backend (NestJS)](./backend/README.md)
- [Frontend (Angular)](./frontend/README.md) 