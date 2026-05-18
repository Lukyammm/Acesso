# 🚀 Portal NUGESP — Caso real de organização operacional

> Um WebApp institucional para transformar links dispersos em um fluxo operacional confiável, rastreável e fácil de usar.

---

## ✨ Visão estratégica

O **Portal NUGESP** foi pensado como produto interno: uma camada de experiência sobre recursos que já existiam (planilhas, formulários, documentos e pastas), mas que estavam fragmentados.

A proposta não era “criar mais uma tela”, e sim entregar:

- **acesso padronizado** ao que é crítico no dia a dia;
- **governança de conteúdo** com controle administrativo;
- **redução de erro manual** causado por links e versões incorretas;
- **melhor experiência para equipes não técnicas**.

---

## 🏥 Contexto do problema operacional

Em rotinas administrativas intensas (incluindo cenários institucionais/hospitalares), o fluxo costuma sofrer com:

- dependência de memória individual (“quem sabe onde está cada arquivo”);
- múltiplos canais de distribuição de links sem controle;
- dificuldade de atualização rápida quando processos mudam;
- baixa rastreabilidade de alterações.

Resultado: retrabalho, atrasos e risco operacional desnecessário.

---

## ✅ Como o sistema melhorou o processo

Com o portal em produção, a operação passa a ter:

- **ponto único de consulta** para recursos oficiais;
- **estrutura por contexto** (categoria → seção → item) que reduz atrito;
- **edição centralizada** por administradores, sem depender de deploy técnico;
- **auditoria + rollback** para manter segurança de mudanças;
- **integração com Drive** para navegação rápida em pastas institucionais.

Na prática: menos tempo procurando informação e mais tempo executando o trabalho certo.

---

## 🧠 Diferenciais técnicos e funcionais

- Arquitetura serverless com **Google Apps Script** (baixo custo operacional).
- Frontend customizado com visual de produto (não “cara de planilha”).
- Sanitização e validação de configuração antes de persistir.
- Controle de administradores por propriedade (`ADMIN_EMAILS`).
- Persistência redundante (Script Properties + arquivo JSON no Drive).
- Histórico de mudanças com capacidade de reversão rápida.

---

## 🤖 Principais automações

- Salvamento estruturado de configuração com validações.
- Registro automático de auditoria por operação.
- Recurso de desfazer última alteração sem intervenção manual no código.
- Duplicação inteligente de categorias para escalar estrutura.
- Leitura dinâmica de conteúdos de pasta no Drive via ID.

---

## 📊 Resultados e impacto percebido

### Eficiência operacional
- Redução de tempo gasto na busca por links e documentos críticos.
- Menor dependência de “usuários-chave” para localizar recursos.

### Qualidade do processo
- Queda na incidência de uso de links desatualizados.
- Mais previsibilidade na comunicação de recursos oficiais.

### Governança
- Mudanças com rastro e possibilidade de reversão.
- Maior segurança para evoluir a estrutura sem interromper a operação.

> Observação: os indicadores quantitativos podem ser adicionados com métricas reais da instituição (tempo médio de busca, chamados internos, etc.).

---

## 🛠️ Tecnologias utilizadas

- **Google Apps Script**
- **Google Drive API (DriveApp)**
- **Script Properties / Session**
- **HTML, CSS, JavaScript (Vanilla)**
- **Lucide Icons + tipografia Inter**

---

## 🖼️ Prints / mockups destacados

> Espaço preparado para materiais visuais de apresentação.

- `Dashboard principal`  
  ![Dashboard](./docs/images/dashboard.png)

- `Gestão administrativa de conteúdo`  
  ![Admin](./docs/images/admin-panel.png)

- `Exploração de pasta no Drive`  
  ![Drive](./docs/images/drive-modal.png)

---

## 🧩 Conclusão (produto e solução real)

O Portal NUGESP demonstra como uma solução enxuta, construída com ecossistema Google, pode gerar **ganho real de operação** quando combina:

- boa arquitetura,
- clareza de fluxo,
- automação de tarefas críticas,
- e uma interface orientada ao usuário final.

Mais do que centralizar links, o sistema institucionaliza conhecimento operacional e reduz falhas humanas em processos que precisam de confiabilidade todos os dias. 💼
