# Acesso - Portal Institucional (Google Apps Script)

## Instalação (passo a passo)
1. Crie um projeto de **Google Apps Script**.
2. Adicione os arquivos deste repositório:
   - `Code.gs`
   - `Index.html`
3. Publique como **Web App**:
   - Deploy > New deployment > Web app.
   - Execute as: **User accessing the web app**.
   - Who has access: conforme sua política (ex.: organização).
4. Abra a URL gerada e valide o carregamento do dashboard.

## Configuração de permissões
- O app usa `Session.getActiveUser().getEmail()` para identificar o usuário atual.
- O app usa `DriveApp.getFolderById()` para listar conteúdos de pastas no modal.
- Para restringir administração, configure a propriedade de script:
  - Chave: `ADMIN_EMAILS`
  - Valor: e-mails separados por vírgula, exemplo:
    `admin1@empresa.com,admin2@empresa.com`
- Se `ADMIN_EMAILS` estiver vazio, o sistema permite administração para facilitar a configuração inicial.

## Funções principais (resumo)
- `getAdminData()`: retorna e-mail atual, permissão de admin e configuração.
- `saveConfigObject(configObj)`: valida e salva a configuração com histórico de alterações.
- `resetToDefault()`: restaura o modelo padrão.
- `getAuditLog(limit)`: retorna histórico recente de alterações.
- `undoLastChange()`: desfaz a última alteração salva.
- `getDriveFolderContents(folderId)`: lista arquivos e subpastas de uma pasta do Drive.

## Limitações conhecidas
- O histórico é salvo em `Script Properties` com retenção das últimas 20 entradas.
- Em ambientes com domínio externo, `Session.getActiveUser().getEmail()` pode retornar vazio conforme política da conta.
- IDs de pastas inválidos ou sem permissão não retornam conteúdo.
