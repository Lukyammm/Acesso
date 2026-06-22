# Institutional Access Governance Portal

Sistema web administrativo em **Google Apps Script + Google Sheets/Properties + Google Drive**, criado para centralizar links, planilhas, formulários, documentos e pastas operacionais em um portal institucional com controle administrativo e trilha de auditoria.

## Fit de portfólio

Este projeto demonstra desenvolvimento de ferramenta interna para times operacionais que precisam reduzir dependência de links soltos, padronizar acesso a documentos e manter governança sobre recursos digitais.

**Palavras-chave:** Google Apps Script, Google Workspace, Google Sheets, Google Drive, workflow automation, internal tools, access governance, audit trail, JavaScript, HTML/CSS.

## Problema que o sistema resolve

Em rotinas institucionais, recursos importantes costumam ficar espalhados entre chats, e-mails, favoritos pessoais e planilhas paralelas. Isso gera retrabalho, perda de tempo, risco de uso de versões desatualizadas e dependência de pessoas específicas para localizar documentos.

O portal cria um ponto único de acesso, com estrutura por categorias, painel administrativo e histórico de alterações para dar mais rastreabilidade ao que está publicado.

## Principais funcionalidades

- Dashboard institucional com categorias, seções e itens clicáveis.
- Painel administrativo para editar estrutura, conteúdo e aparência.
- Controle de acesso por administradores via e-mail (`ADMIN_EMAILS`).
- Persistência de configuração em propriedades do script e arquivo JSON no Drive.
- Auditoria de alterações com histórico limitado por configuração.
- Desfazer última alteração para recuperação rápida em caso de erro.
- Duplicação de categoria para acelerar criação de estruturas semelhantes.
- Restauração de configuração padrão para contingência.
- Leitura de conteúdo de pastas do Google Drive por ID.
- Interface responsiva com temas visuais e foco em uso recorrente.

## Tecnologias utilizadas

### Backend

- Google Apps Script (V8)
- HtmlService para publicação como Web App
- PropertiesService para configurações e auditoria
- Session API para identificação de usuário
- DriveApp para integração com pastas e arquivos do Google Drive

### Frontend

- HTML5, CSS3 e JavaScript Vanilla
- Design system próprio com variáveis de tema
- Lucide Icons via CDN
- Google Fonts (Inter)

## Estrutura do projeto

```text
.
├── Code.gs       # Backend: rotas, regras, persistência e integrações Google
├── Index.html    # Frontend: layout, estilos e comportamento da interface
└── README.md     # Documentação técnica e de portfólio
```

## Fluxo de funcionamento

1. O usuário acessa a URL do Web App.
2. `doGet()` entrega a interface principal do portal.
3. O frontend solicita os dados administrativos e a configuração atual.
4. O backend valida permissões do usuário autenticado.
5. O sistema renderiza categorias, seções e itens disponíveis.
6. Administradores editam a estrutura no painel.
7. Ao salvar, a configuração é validada, sanitizada, persistida e auditada.
8. Em caso de incidente, o administrador pode desfazer a última mudança.

## Evidências técnicas

- Separação clara entre interface (`Index.html`) e regras/persistência (`Code.gs`).
- Uso de propriedades do Apps Script para configuração operacional.
- Integração com Google Drive para leitura de pastas e arquivos por ID.
- Histórico de alterações para rastreabilidade administrativa.
- Fluxo de contingência com restauração de configuração padrão.

## Como executar

### Pré-requisitos

- Conta Google com acesso ao Apps Script.
- Permissão para usar Google Drive na organização.

### Passo a passo

1. Crie um novo projeto em [Google Apps Script](https://script.google.com/).
2. Copie os arquivos deste repositório para o projeto:
   - `Code.gs`
   - `Index.html`
3. Configure administradores em **Project Settings > Script properties**:
   - Chave: `ADMIN_EMAILS`
   - Valor: `email1@dominio.com,email2@dominio.com`
4. Faça o deploy:
   - **Deploy > New deployment > Web app**
   - **Execute as**: User accessing the web app
   - **Who has access**: conforme política interna
5. Abra a URL gerada e valide o carregamento inicial.

## Melhorias futuras

- Controle de permissões por perfil (admin, editor, leitura).
- Versionamento completo de configuração com rollback por ponto.
- Busca global com filtros por tipo de recurso.
- Indicadores de uso para itens mais acessados e últimas atualizações.
- Exportação/importação de configuração com assinatura de integridade.
- Integração com logs externos para observabilidade.

## Privacidade

Este repositório deve ser usado com dados fictícios, sintéticos ou anonimizados. IDs de pastas, e-mails administrativos, links internos e nomes de instituições devem ser substituídos antes de qualquer publicação pública.

## Autor

Projeto de portfólio por **Lukyam Madeira**, com foco em automação de processos internos, governança de acesso e ferramentas operacionais em Google Workspace.
