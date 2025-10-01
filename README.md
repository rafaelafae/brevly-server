# 🚀 Brev.ly - Encurtador de URL FullStack

## 📝 Sobre o Projeto

**Brev.ly** é uma aplicação FullStack de encurtador de URLs, desenvolvida como projeto final da pós-graduação em Tech Developer 360 da Rocketseat. O objetivo é consolidar conhecimentos em desenvolvimento front-end, back-end e DevOps, criando uma solução completa, performática e com ótima experiência de usuário.

A aplicação permite criar, listar, deletar e redirecionar links, além de exportar relatórios em CSV.

---

## ✨ Funcionalidades Principais

- **Criação de Links:** Encurte qualquer URL, com a opção de criar um código customizado.
- **Listagem Paginada:** Visualize todos os links criados.
- **Redirecionamento:** Links encurtados redirecionam para a URL original, contabilizando o acesso.
- **Deleção de Links:** Remova links encurtados facilmente.
- **Exportação em CSV:** Baixe um relatório completo de todos os links cadastrados.
- **Validação em Tempo Real:** Formulário com validação inteligente para uma melhor UX.
- **Feedback ao Usuário:** Notificações de sucesso e erro para todas as ações.
- **Design Responsivo:** Interface adaptada para uso em desktops e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi estruturado em um formato de monorepo, com duas subpastas principais:

### 🌐 Front-end (`/web`)

- **React com Vite:** Para uma base de desenvolvimento rápida e moderna.
- **TypeScript:** Para um código mais seguro e escalável.
- **Tailwind CSS:** Para estilização utilitária e um design system consistente.
- **TanStack Query (React Query):** Para gerenciamento de estado do servidor, cache e paginação.
- **React Hook Form & Zod:** Para construção e validação de formulários robustos.
- **Axios:** Para realizar as chamadas à API.
- **Phosphor Icons:** Para iconografia.
- **React Toastify:** Para notificações e feedback ao usuário.
- **Biome:** Para formatação e linting do código.

### ⚙️ Back-end (`/server`)

- **Node.js com Fastify:** Para um servidor web de alta performance.
- **TypeScript:** Para consistência e segurança de tipos no back-end.
- **Zod:** Para validação de requisições e respostas da API.
- **Drizzle ORM:** Para uma comunicação moderna e type-safe com o banco de dados.
- **PostgreSQL:** Como banco de dados relacional.
- **Docker:** Para containerização e facilidade no setup do ambiente de desenvolvimento.


### 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Desenvolvido com 💜 por Rafaela Faé.