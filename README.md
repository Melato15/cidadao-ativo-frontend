# Cidadão Ativo - Frontend

Uma plataforma de participação cidadã e engajamento cívico desenvolvida com React, TypeScript e TailwindCSS.

## 🚀 Características

- **Interface Responsiva**: Design mobile-first com TailwindCSS
- **TypeScript**: Tipagem estática para maior robustez
- **Componentes Modulares**: Arquitetura componentizada e reutilizável
- **Next.js**: Framework React com App Router

## 🎯 Funcionalidades

### Header

- Logo e identidade visual
- Campo de busca de projetos
- Botões de autenticação (Entrar/Cadastrar)

### Sidebar

- Menu de navegação principal
- Filtros por bairro, categoria e status
- Design responsivo

### Dashboard Stats

- Total de votos
- Projetos ativos
- Taxa de participação

### Cards de Projetos

- Status coloridos por categoria
- Informações do vereador responsável
- Botões de apoio/rejeição
- Contadores de votos
- Sistema de denúncias

## 🛠️ Tecnologias

- **React 18**: Biblioteca para interfaces de usuário
- **TypeScript**: Superset do JavaScript com tipagem
- **Next.js 15**: Framework React com App Router
- **TailwindCSS**: Framework CSS utilitário
- **PostCSS**: Processador CSS

## 📦 Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositorio]
cd cidadao-ativo-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter ESLint

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── globals.css          # Estilos globais e TailwindCSS
│   ├── layout.tsx           # Layout principal da aplicação
│   └── page.tsx            # Página inicial
├── components/
│   ├── Header.tsx          # Cabeçalho com logo e busca
│   ├── Sidebar.tsx         # Menu lateral e filtros
│   ├── ProjectCard.tsx     # Card individual de projeto
│   └── DashboardStats.tsx  # Estatísticas do dashboard
```

## 🎨 Design System

### Cores Principais

- **Azul**: `blue-600` - Elementos primários e botões
- **Verde**: `green-600` - Ações positivas (apoiar)
- **Vermelho**: `red-600` - Ações negativas (rejeitar)
- **Cinza**: `gray-*` - Textos e backgrounds neutros

### Componentes

- Cards com `shadow-sm` e `rounded-lg`
- Botões com estados hover e transições suaves
- Layout responsivo com breakpoints `md:` e `lg:`

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**:
  - `md:` - Tablets (768px+)
  - `lg:` - Desktops (1024px+)
  - `xl:` - Telas grandes (1280px+)

## 🔄 Próximos Passos

- [ ] Integração com API backend
- [ ] Autenticação de usuários
- [ ] Sistema de notificações
- [ ] Filtros avançados
- [ ] Página de detalhes do projeto
- [ ] Sistema de comentários
- [ ] Dashboard administrativo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
