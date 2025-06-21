# 🎨 Frontend - Angular

> Este é o `README` específico do frontend. Para uma visão geral, consulte o [README principal](../README.md).

<p align="center">
  <a href="https://angular.io/" target="blank"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="120" alt="Angular Logo" /></a>
</p>

<p align="center">
  <strong>Uma interface de usuário reativa e moderna para o gerenciamento de veículos, construída com Angular e Material Design.</strong>
</p>

## ✨ Tecnologias

- **Framework**: [Angular](https://angular.io/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **UI Kit**: [Angular Material](https://material.angular.io/)
- **Cliente HTTP**: [HttpClientModule](https://angular.io/guide/http)
- **Estilização**: SCSS

## 🖼️ Funcionalidades da Interface

- **Listagem Completa**: Exibe todos os veículos cadastrados em uma tabela com paginação.
- **Busca Dinâmica**: Filtra veículos em tempo real por placa, modelo ou marca.
- **Visualização de Status**: Mostra o status atual de cada veículo (`Ativo`, `Em Ativação`, etc.) com *badges* coloridos.
- **Operações CRUD em Diálogos**:
    - **Cadastrar**: Abre um diálogo (`MatDialog`) para inserir os dados de um novo veículo.
    - **Editar**: Permite a atualização dos dados de um veículo existente.
    - **Excluir**: Apresenta um diálogo de confirmação antes de remover um veículo.
- **Notificações (Snackbar)**: Fornece feedback visual para o usuário após cada operação (sucesso ou erro).

## 📂 Estrutura de Componentes

O código-fonte está localizado em `src/app` e organizado da seguinte forma:

-   `app.routes.ts`: Define as rotas da aplicação (a rota principal aponta para `VehiclesListComponent`).
-   `vehicles-list.component.ts`: O componente principal, responsável por listar, buscar e gerenciar os veículos.
-   `vehicle-form-dialog.component.ts`: Componente de diálogo usado para os formulários de criação e edição de veículos.
-   `confirm-dialog.component.ts`: Um diálogo genérico para confirmação de ações, como a exclusão.
-   `material.module.ts`: Módulo que importa e exporta todos os componentes do Angular Material utilizados na aplicação.

## 🛠️ Scripts NPM

-   `npm start`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila a aplicação para produção.
-   `npm run test`: Executa os testes unitários com Karma e Jasmine.
