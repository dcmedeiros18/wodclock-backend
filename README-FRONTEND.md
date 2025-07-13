# WodClock Frontend - Sistema de Gerenciamento de Aulas e Reservas

## 🚀 Funcionalidades Implementadas

### 📅 Gerenciamento de Aulas (Classes)
- **Visualizar Aulas**: Lista todas as aulas com informações detalhadas
- **Criar Nova Aula**: Adicionar aulas com data, horário, vagas e WOD associado
- **Editar Aula**: Modificar informações de aulas existentes
- **Excluir Aula**: Remover aulas do sistema
- **Filtrar por Data**: Buscar aulas por data específica

### 📋 Gerenciamento de Reservas (Bookings)
- **Visualizar Reservas**: Lista todas as reservas com informações do usuário e aula
- **Criar Nova Reserva**: Fazer reservas vinculando usuário e aula
- **Cancelar Reserva**: Remover reservas do sistema
- **Filtrar Reservas**: Por usuário e/ou data da aula

### 💪 Gerenciamento de WODs
- **Visualizar WODs**: Lista todos os WODs disponíveis
- **Criar Novo WOD**: Adicionar WODs com título, descrição e data
- **Editar WOD**: Modificar informações de WODs existentes
- **Excluir WOD**: Remover WODs do sistema

## 🎨 Interface do Usuário

### Design Moderno
- Interface responsiva que funciona em desktop e mobile
- Design com gradientes e efeitos de vidro (glassmorphism)
- Animações suaves e transições elegantes
- Ícones Font Awesome para melhor experiência visual

### Navegação por Abas
- **Aulas**: Gerenciamento completo de aulas
- **Reservas**: Controle de reservas dos usuários
- **WODs**: Administração dos WODs

### Componentes Interativos
- **Modais**: Para criação e edição de dados
- **Filtros**: Para busca e organização de informações
- **Cards**: Exibição organizada das informações
- **Toast Notifications**: Feedback visual para ações do usuário

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com Flexbox e Grid
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones
- **Fetch API**: Comunicação com o backend

### Backend Integration
- **REST API**: Comunicação com endpoints do NestJS
- **CORS**: Configurado para permitir requisições do frontend
- **Static Files**: Servindo arquivos estáticos do diretório `public`

## 📁 Estrutura de Arquivos

```
public/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
└── script.js           # Lógica JavaScript
```

## 🚀 Como Executar

### 1. Iniciar o Backend
```bash
# Na pasta do projeto
npm run start:dev
```

### 2. Acessar o Frontend
Abra seu navegador e acesse:
```
http://localhost:3000
```

## 📱 Funcionalidades por Seção

### Seção Aulas
- **Visualização**: Cards com informações da aula (ID, data, horário, vagas, WOD)
- **Criação**: Modal com formulário para nova aula
- **Edição**: Modal pré-preenchido com dados da aula
- **Exclusão**: Confirmação antes de remover
- **Filtro**: Por data específica

### Seção Reservas
- **Visualização**: Cards com usuário, aula e data da reserva
- **Criação**: Modal com seleção de usuário e aula
- **Exclusão**: Cancelamento de reservas
- **Filtros**: Por usuário e/ou data da aula

### Seção WODs
- **Visualização**: Cards com título, descrição e data
- **Criação**: Modal para novo WOD
- **Edição**: Modal para modificar WOD existente
- **Exclusão**: Remoção de WODs

## 🔧 Configurações

### API Endpoints Utilizados
- `GET /user` - Listar usuários
- `GET /class` - Listar aulas
- `POST /class` - Criar aula
- `PATCH /class/:id` - Atualizar aula
- `DELETE /class/:id` - Excluir aula
- `GET /bookings` - Listar reservas
- `POST /bookings` - Criar reserva
- `DELETE /bookings/:id` - Excluir reserva
- `GET /api/wods` - Listar WODs

### CORS Configuration
O backend está configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://localhost:8100`
- `http://localhost:8102`

## 🎯 Recursos de UX/UI

### Feedback Visual
- **Loading States**: Indicadores de carregamento
- **Empty States**: Mensagens quando não há dados
- **Toast Notifications**: Feedback para ações do usuário
- **Hover Effects**: Interações visuais nos elementos

### Responsividade
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para diferentes tamanhos de tela
- **Touch Friendly**: Botões e elementos adequados para toque

### Acessibilidade
- **Semantic HTML**: Estrutura semântica adequada
- **Keyboard Navigation**: Navegação por teclado
- **Focus States**: Estados de foco visíveis
- **ARIA Labels**: Labels para leitores de tela

## 🔄 Fluxo de Dados

1. **Carregamento Inicial**: Dados de usuários, WODs, aulas e reservas
2. **Navegação**: Troca entre abas carrega dados específicos
3. **Criação**: Modal → API → Atualização da lista
4. **Edição**: Modal pré-preenchido → API → Atualização
5. **Exclusão**: Confirmação → API → Remoção da lista
6. **Filtros**: Aplicação de filtros na interface

## 🎨 Paleta de Cores

- **Primary**: `#667eea` (Azul)
- **Secondary**: `#764ba2` (Roxo)
- **Success**: `#28a745` (Verde)
- **Danger**: `#dc3545` (Vermelho)
- **Warning**: `#ffc107` (Amarelo)
- **Info**: `#17a2b8` (Azul claro)

## 📝 Próximas Melhorias

- [ ] Autenticação e autorização
- [ ] Dashboard com estatísticas
- [ ] Exportação de dados
- [ ] Notificações em tempo real
- [ ] Tema escuro
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste todas as funcionalidades
5. Envie um pull request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento 