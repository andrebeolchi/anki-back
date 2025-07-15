# Projeto Tinnki

**Índice**

- [Projeto Tinnki](#projeto-tinnki)
  - [Arquitetura da Aplicação](#arquitetura-da-aplicação)
    - [Diagrama de Componentes](#diagrama-de-componentes)
    - [Fluxo de Dados e Interações](#fluxo-de-dados-e-interações)
  - [Estrutura](#estrutura)
    - [/adapters](#adapters)
    - [/models](#models)
    - [/env](#env)
    - [/repositories](#repositories)
    - [/services](#services)
    - [/http](#http)
    - [app.ts](#appts)
    - [server.ts](#serverts)
  - [Instalação e configuração](#instalação-e-configuração)
    - [Instalação de dependências](#instalação-de-dependências)
    - [Inicialização do banco](#inicialização-do-banco)
    - [Configuração do banco](#configuração-do-banco)
    - [Atualização do banco](#atualização-do-banco)
    - [Configurar variáveis de ambiente](#configurar-variáveis-de-ambiente)
  - [Inicialização do projeto](#inicialização-do-projeto)
    - [Ambiente de desenvolvimento](#ambiente-de-desenvolvimento)
    - [Ambiente de produção](#ambiente-de-produção)
  - [CI/CD](#cicd)
  - [Autores](#autores)

## Arquitetura da Aplicação

### Diagrama de Componentes

O sistema é dividido atualmente em dois componentes principais:

- **Backend**: Contém a lógica de negócios e a API, construído com Node.js (fastify).
- **Banco de Dados**: Gerenciamento de dados com PostgreSQL.

### Fluxo de Dados e Interações

O fluxo de dados ocorre da seguinte forma:

1. É feita uma requisição á API
2. Middlewares são usados para fazer a validação de autenticação
3. Os controladores fazem a associação da rota e método da requisição ao respectivo serviço
4. Os serviços realizam ações e alterações necessárias ao repositório
5. O repositório armazena a informação e persiste em um banco postgresql

## Estrutura

### /adapters

- **db**: inicialização do client do prisma (banco postgres)

### /models

Definição de tipagem

### /env

Garante a configuração correta das variáveis de ambiente

### /repositories

Definição de interfaces dos repositórios base

- **/in-memory**: Definição de classe de repositório "em memória" para gerenciamento de dados locais sem persistência
- **/prisma**: Definição de classe de repositório integrado ao prisma para gerenciamento de dados persistidos no banco

### /services

Definição de serviços para interação com modelos

- **/\_errors**: Definição de classes customizadas de erro, e handler que mapeia o erro à sua classe adequada a partir do código de status
- **/factory**: Definição de funções que acoplam o repositório do prisma aos serviços para uso simplificado na aplicação

### /http

- **/controllers**: Definição das rotas da API, utilizando os serviços definidos em /services
- **/middlewares**: Definição de middlewares para interceptar e validar requisições

### app.ts

Configura o servidor fastify e acopla rotas ao app, além de incluir a inicialização do swagger para documentação da API.

### server.ts

Inicializa o servidor

## Instalação e configuração

### Instalação de dependências

```bash
yarn
```

### Inicialização do banco

```bash
docker compose up -d
```

<small>Argumento "-d" usado para rodar o container em background</small>

### Configuração do banco

```bash
yarn prisma generate
```

### Atualização do banco

```bash
yarn prisma migrate dev
```

<small>Esse comando deve ser utilizado em caso de alterações ao schema do prisma</small>

### Configurar variáveis de ambiente

Seguir exemplo demonstrado em `.env.example`, criando um arquivo `.env` na raiz do projeto

## Inicialização do projeto

### Ambiente de desenvolvimento

```bash
yarn dev
```

### Ambiente de produção

<small>Gera versão de build da aplicação</small>

```bash
yarn build
```

<small>Inicializa versão de build</small>

```bash
yarn start
```

## CI/CD

Foi configurado um fluxo utilizando GithubActions para validação do projeto com testes unitários automatizados

## Autores

<img src="https://avatars.githubusercontent.com/u/61586777" width="16" height="16"> [André Beolchi](https://github.com/andrebeolchi) (RM 359648)
<br><img src="https://avatars.githubusercontent.com/u/34667580" width="16" height="16"> [Fellipe Corominas](https://github.com/LeFelps) (RM 359677)
