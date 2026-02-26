// =============================================
// Code.gs - Portal Institucional (Versão Atualizada 2026)
// =============================================

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portal Institucional')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  let configStr = props.getProperty('DASHBOARD_CONFIG');
  if (!configStr) {
    configStr = JSON.stringify(getDefaultConfig());
    props.setProperty('DASHBOARD_CONFIG', configStr);
  }
  return JSON.parse(configStr);
}

function saveConfig(configStr) {
  try {
    const parsed = JSON.parse(configStr);
    PropertiesService.getScriptProperties().setProperty('DASHBOARD_CONFIG', configStr);
    return { success: true, message: "✅ Configuração salva com sucesso!" };
  } catch (e) {
    return { success: false, message: "❌ JSON inválido: " + e.toString() };
  }
}

function resetToDefault() {
  const defaultConfig = getDefaultConfig();
  PropertiesService.getScriptProperties().setProperty('DASHBOARD_CONFIG', JSON.stringify(defaultConfig));
  return { success: true, message: "✅ Configuração restaurada para o padrão original!" };
}

function getDefaultConfig() {
  return {
    appName: "Portal Institucional",
    primaryColor: "#1e40af",
    categories: [
      {
        id: "crp",
        name: "CRP - Controle de Recursos Públicos",
        icon: "fa-landmark",
        color: "#1e40af",
        subtopics: [
          { title: "Planilhas", icon: "fa-file-excel", items: [] },
          { title: "Formulários", icon: "fa-file-lines", items: [] },
          { title: "Documentos", icon: "fa-file-word", items: [] },
          { title: "Pastas Drive", icon: "fa-folder-open", items: [] }
        ]
      }
    ]
  };
}

function getDriveFolderContents(folderId) {
  if (!folderId) throw new Error('ID da pasta não informado');
  try {
    const folder = DriveApp.getFolderById(folderId);
    const contents = [];
    const files = folder.getFiles();
    while (files.hasNext()) {
      const f = files.next();
      contents.push({ name: f.getName(), url: f.getUrl(), type: 'file' });
    }
    const folders = folder.getFolders();
    while (folders.hasNext()) {
      const f = folders.next();
      contents.push({ name: f.getName() + ' 📁', url: f.getUrl(), type: 'folder' });
    }
    return contents.length ? contents : [];
  } catch (e) {
    console.error(e);
    throw new Error('Não foi possível acessar a pasta.');
  }
}
