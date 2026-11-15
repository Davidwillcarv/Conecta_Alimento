# Conecta Alimento

Sistema MVP para gestão de doações e cadastro de famílias em situação de vulnerabilidade, com autenticação via JWT e interface web para cadastro, consulta e manutenção dos dados.

## Visão geral

Este projeto foi desenvolvido em uma arquitetura simples com:

- Backend em Java com Spring Boot
- Frontend em React + Vite
- Banco de dados em MySQL
- Autenticação com JWT
- Controle de acesso para rotas protegidas

A aplicação permite:

- cadastrar, listar, editar e excluir doações
- cadastrar, listar, editar e excluir famílias
- autenticar usuários com login seguro
- consumir a API por meio de um frontend web

## Stack tecnológica

### Backend
- Java 17
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- MySQL Connector

### Frontend
- React 18
- Vite
- Axios
- Tailwind CSS
- Lucide React

## Estrutura do projeto

```text
MVP_Conecta_Alimentos/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── target/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.*
├── .env
├── docker-compose.yml
├── .gitignore
├── README.md
└── .vscode/
```

## Requisitos

Antes de rodar o projeto, verifique se os itens abaixo estão instalados:

- Java 17+
- Maven
- Node.js 18+
- npm
- MySQL 8.x ou Docker
- Git

## Configuração do banco de dados

O projeto está configurado para usar o banco MySQL local:

- host: `127.0.0.1`
- porta: `3306`
- banco: `conecta_alimento_db`
- usuário: `root`
- senha: vazia

Arquivo principal da configuração:

- `backend/src/main/resources/application.properties`

Configuração atual:

```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/conecta_alimento_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
server.port=8085
```

### Opção com Docker

O repositório já inclui um `docker-compose.yml` para subir o MySQL rapidamente:

```bash
docker-compose up -d mysql
```

A variável de ambiente do banco está em:

- `.env`

```env
DB_NAME=conecta_alimento_db
DB_PORT=3306
```

> Se o MySQL já estiver em execução localmente, você pode pular essa etapa.

## Credenciais de acesso

O login do sistema foi configurado com as seguintes credenciais:

- usuário: `admin`
- senha: `admin123`

Essas credenciais estão definidas em:

- `backend/src/main/resources/application.properties`

```properties
app.auth.username=admin
app.auth.password=admin123
app.jwt.secret=ConectaAlimentoJwtChaveSeguraMinimo32Caracteres2026
app.jwt.expiration-ms=86400000
```

## Execução do backend

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
mvn spring-boot:run
```

Se prefirir rodar o projeto já empacotado:

```bash
cd backend
mvn clean package
java -jar target/conecta-alimento-1.0.0.jar
```

O backend ficará disponível em:

- `http://localhost:8085`

### Endpoints principais

#### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Doações

```http
GET    /api/donations
GET    /api/donations/{id}
GET    /api/donations/search?name=...&category=...
POST   /api/donations
PUT    /api/donations/{id}
DELETE /api/donations/{id}
```

#### Famílias

```http
GET    /api/families
GET    /api/families/{id}
GET    /api/families/search?name=...&city=...
POST   /api/families
PUT    /api/families/{id}
DELETE /api/families/{id}
```

## Execução do frontend

Abra outro terminal e execute:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

O frontend ficará disponível em:

- `http://localhost:5173`

O cliente Axios do frontend usa a API no endereço:

- `http://localhost:8085/api`

## Funcionalidades implementadas

### Gestão de doações
- cadastro de itens doados
- listagem de doações
- busca por nome e categoria
- atualização e remoção

### Gestão de famílias
- cadastro de família
- levantamento de dados de responsáveis, endereço, cidade e telefone
- listagem e busca por nome ou cidade
- edição e exclusão

### Login e segurança
- autenticação por usuário e senha
- geração de token JWT
- proteção de rotas privadas
- envio de token no header `Authorization: Bearer ...`

## Observações importantes

- O backend usa `spring.jpa.hibernate.ddl-auto=update`, então as tabelas são criadas/atualizadas automaticamente pelo Hibernate.
- A aplicação já foi validada em execução local com sucesso.
- A porta do backend foi configurada como `8085` para evitar conflitos com outras aplicações locais.
- O frontend envia o token JWT em todas as requisições autenticadas via interceptor do Axios.

## Como usar o sistema

1. Suba o MySQL local ou via Docker.
2. Inicie o backend:

```bash
cd backend
mvn spring-boot:run
```

3. Inicie o frontend:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

4. Acesse o frontend em `http://localhost:5173`.
5. Faça login com:
   - usuário: `admin`
   - senha: `admin123`
6. Utilize as telas de cadastro e consulta para famílias e doações.

## Dicas de desenvolvimento

- Para gerar o build do frontend:

```bash
cd frontend
npm run build
```

- Para verificar o status do backend em desenvolvimento, acompanhe os logs do Spring Boot no terminal.
- Caso a porta `8085` estiver ocupada, ajuste a propriedade `server.port` em `application.properties`.

## Status do projeto

O MVP está funcional para uso local com:

- autenticação JWT
- cadastro e consulta de famílias
- cadastro e consulta de doações
- integração frontend/backend
- armazenamento no MySQL

## Licença

Este projeto foi desenvolvido como aplicação local de demonstração e estudo, sem uma licença comercial definida.
- **Status do Projeto:** Em desenvolvimento e estruturação de arquitetura.

**Autor: David WIllian de Carvalho