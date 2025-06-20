# Frontend - Angular

Este diretório contém o frontend do projeto CRUD de Veículos, desenvolvido em Angular.

## 🚀 Como rodar

### Com Docker Compose (recomendado)

Na raiz do monorepo:
```bash
docker-compose up --build
```
Acesse: http://localhost:4200

### Build de produção

```bash
cd frontend
npm run build
```
Os arquivos finais estarão em `dist/`.

### Com Docker isolado

```bash
docker build -t crud-frontend ./frontend
# Depois
# docker run -p 4200:80 crud-frontend
```

## ℹ️ Integração com o backend
- O frontend consome a API REST do backend disponível em http://localhost:3000
- Certifique-se de que o backend está rodando (via Docker Compose ou manualmente)

## 📚 Mais informações
- [README principal do monorepo](../README.md)
- [Backend (NestJS)](../backend/README.md)
