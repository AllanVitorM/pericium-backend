# Pericium Backend

**Pericium Backend** é a API que dá suporte à plataforma web de **perícia odontolegal**.  
Responsável por gerenciar casos, laudos, evidências, usuários e autenticação, oferecendo uma comunicação segura e eficiente com o frontend.

O projeto foi desenvolvido utilizando **NestJS**, aplicando padrões modernos de segurança, autenticação e documentação via **Swagger**.

## 🚀 Tecnologias utilizadas

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Cloudinary](https://cloudinary.com/) (armazenamento de imagens)
- [Swagger](https://swagger.io/) (documentação da API)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [JWT Authentication](https://jwt.io/)
- [Docker (opcional)](https://www.docker.com/)
## 📦 Scripts disponíveis

No diretório do projeto, você pode rodar:

- `npm run start`  
  Inicia o servidor de desenvolvimento.

- `npm run start:dev`  
  Inicia o servidor com watch mode (hot reload).

- `npm run build`  
  Compila a aplicação para produção.

- `npm run test`  
  Executa os testes unitários.

- `npm run test:e2e`  
  Executa os testes End-to-End.

- `npm run lint`  
  Roda o linter para análise de qualidade do código.

---

## 🛠️ Configurações e dependências

O projeto inclui:

- `.prettierrc`: Configuração do Prettier para formatação de código
- `eslint.config.mjs`: Regras de linting
- `nest-cli.json`: Configurações do CLI do NestJS
- `package.json`: Dependências e scripts
- `tsconfig.build.json`: Configuração de build TypeScript
- `tsconfig.json`: Configuração principal do TypeScript
- `.gitignore`: Arquivos e pastas ignorados no repositório

---

## 📄 Documentação da API

A documentação interativa da API é gerada usando **Swagger** e pode ser acessada após subir o servidor em:
http://localhost:3000/api


---

## 🔒 Autenticação e Segurança

- **Guards** e **JWT** são utilizados para proteger rotas sensíveis.
- Tokens de autenticação são exigidos para acesso a funcionalidades administrativas como geração de laudos e anexação de evidências.

---

## 📋 Funcionalidades principais

- Cadastro e autenticação de usuários
- Gerenciamento de casos odontolegais
- Upload e gerenciamento de evidências (Cloudinary)
- Geração de laudos periciais
- Dashboard de processos
- Emissão de relatórios
- Proteção de rotas via JWT

---

## 👨‍💻 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature:

```bash
git checkout -b feature/nova-feature
git commit -m 'feat: adiciona nova feature'
git push origin feature/nova-feature


## 📁 Estrutura de Pastas

```plaintext
/src
  ├── auth/            # Autenticação e autorização
  ├── cases/           # Gerenciamento de casos
  ├── cloudinary/      # Upload e gestão de mídias
  ├── common/enums/    # Enums e constantes
  ├── config/          # Configurações da aplicação
  ├── dashboard/       # Dados do dashboard administrativo
  ├── evidencias/      # Controle de evidências
  ├── laudos/          # Geração e gestão de laudos
  ├── relatorios/      # Relatórios e documentos
  ├── types/           # Tipagens compartilhadas
  ├── user/            # Gerenciamento de usuários
  ├── utils/           # Funções utilitárias
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  └── main.ts          # Ponto de entrada da aplicação

/test
  ├── app.e2e-spec.ts  # Testes End-to-End
  └── jest-e2e.json    # Configuração de testes
