# 🛡️ Portal NUGESP — Acesso Institucional

Sistema web administrativo desenvolvido com **Google Apps Script + Google Sheets/Properties + Google Drive**, focado em centralizar links, planilhas, formulários, documentos e pastas operacionais em um único portal institucional.

---

## 📌 Descrição objetiva

O **Portal NUGESP** organiza os principais recursos digitais de uma equipe (setores, coordenações e núcleos) em uma interface web moderna, com navegação por categorias, controle administrativo e histórico de alterações.

Na prática, ele funciona como um **hub operacional**: reduz perda de tempo com links dispersos, melhora o acesso padronizado a documentos e dá mais governança sobre o que está publicado para a equipe.

---

## 🚨 Problema que o sistema resolve

Em ambientes institucionais, é comum encontrar:

- links importantes espalhados entre chats, e-mails e favoritos pessoais;
- versões desatualizadas de planilhas e formulários circulando em paralelo;
- dependência de pessoas específicas para “saber onde está cada coisa”;
- retrabalho e erros por acesso a arquivos incorretos.

O portal resolve isso ao criar um **ponto único de acesso**, com curadoria administrativa e estrutura clara por contexto de uso.

---

## ⚙️ Principais funcionalidades

- **Dashboard institucional** com categorias, seções e itens clicáveis.
- **Painel administrativo** para editar estrutura, conteúdo e aparência.
- **Controle de acesso por administradores** via e-mail (`ADMIN_EMAILS`).
- **Persistência de configuração** em propriedades do script e arquivo JSON no Drive.
- **Auditoria de alterações** (histórico com limite configurado).
- **Desfazer última alteração** para recuperação rápida em caso de erro.
- **Duplicação de categoria** para acelerar criação de estruturas semelhantes.
- **Restauração de configuração padrão** para contingência.
- **Leitura de conteúdo de pastas do Google Drive** por ID.
- **Interface responsiva** com temas visuais e foco em usabilidade.

---

## 🧱 Tecnologias utilizadas

### Backend
- **Google Apps Script (V8)**
- **HtmlService** para publicação como Web App
- **PropertiesService** para configurações e auditoria
- **Session API** para identificação de usuário
- **DriveApp** para integração com pastas/arquivos do Google Drive

### Frontend
- **HTML5 + CSS3 + JavaScript Vanilla**
- **Design system próprio** com variáveis de tema
- **Lucide Icons (CDN)**
- **Google Fonts (Inter)**

---

## 🗂️ Estrutura do projeto

```bash
.
├── Code.gs       # Backend (rotas, regras, persistência e integrações Google)
├── Index.html    # Frontend (layout, estilos e comportamento da interface)
└── README.md     # Documentação técnica principal
```

> Sugestão: para evolução do projeto, separar `Index.html` em arquivos parciais (`CSS.html`, `JS.html`) pode facilitar manutenção em times maiores.

---

## 🔄 Fluxo de funcionamento

1. O usuário acessa a URL do Web App.
2. `doGet()` entrega a interface principal do portal.
3. O frontend solicita dados administrativos e configuração atual.
4. O backend valida permissões do usuário autenticado.
5. O sistema renderiza categorias, seções e itens disponíveis.
6. Administradores podem editar a estrutura no painel.
7. Ao salvar, a configuração é validada, sanitizada, persistida e auditada.
8. Em caso de incidente, o admin pode desfazer a última mudança.

---

## 🖼️ Capturas de tela

> Substitua os caminhos abaixo pelos prints reais do projeto.

### Dashboard
![Dashboard do Portal](./docs/images/dashboard.png)

### Painel administrativo
![Painel administrativo](./docs/images/admin-panel.png)

### Modal de conteúdo do Drive
![Conteúdo de pasta Drive](./docs/images/drive-modal.png)

---

## ▶️ Como executar

### Pré-requisitos
- Conta Google com acesso ao **Apps Script**.
- Permissão para usar o **Google Drive** da organização.

### Passo a passo

1. Crie um novo projeto em [Google Apps Script](https://script.google.com/).
2. Copie os arquivos deste repositório para o projeto:
   - `Code.gs`
   - `Index.html`
3. (Opcional, recomendado) Configure administradores:
   - Em **Project Settings > Script properties**
   - Chave: `ADMIN_EMAILS`
   - Valor: `email1@dominio.com,email2@dominio.com`
4. Faça o deploy:
   - **Deploy > New deployment > Web app**
   - **Execute as**: User accessing the web app
   - **Who has access**: conforme política interna
5. Abra a URL gerada e valide o carregamento inicial.

---

## 🧭 Melhorias futuras

- Controle de permissões por perfil (admin, editor, leitura).
- Versionamento completo de configuração com rollback por ponto.
- Busca global com filtros por tipo (link, planilha, pasta).
- Indicadores de uso (itens mais acessados, últimas atualizações).
- Exportação/importação de configuração com assinatura de integridade.
- Integração com logs externos (BigQuery/Looker Studio) para observabilidade.

---

## 👤 Autor

Desenvolvido por **Acesso / NUGESP**.

Se desejar, posso adaptar este README para o seu nome, empresa, contato e padrão visual da sua organização.
