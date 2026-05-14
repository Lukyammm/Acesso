// =============================================
// Code.gs - Portal Nugesp
// =============================================

const CONFIG_PROPERTY = 'DASHBOARD_CONFIG';
const ADMIN_EMAILS_PROPERTY = 'ADMIN_EMAILS';
const AUDIT_LOG_PROPERTY = 'DASHBOARD_AUDIT';
const CONFIG_FILE_ID_PROPERTY = 'DASHBOARD_CONFIG_FILE_ID';
const AUDIT_FILE_ID_PROPERTY = 'DASHBOARD_AUDIT_FILE_ID';
const MAX_AUDIT_ENTRIES = 20;
const CONFIG_FILE_NAME = 'acesso-dashboard-config.json';
const AUDIT_FILE_NAME = 'acesso-dashboard-audit.json';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portal Nugesp')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getUserEmail() {
  return Session.getActiveUser().getEmail();
}

function getAdminData() {
  const email = getUserEmail();
  return {
    email: email,
    isAdmin: isAdminUser(email),
    config: getConfig(),
    adminEmails: getAdminEmailsList(),
  };
}

function getConfig() {
  const fileConfig = readJsonFromFileProperty(CONFIG_FILE_ID_PROPERTY);
  if (fileConfig && typeof fileConfig === 'object') {
    return sanitizeConfig(fileConfig);
  }

  const props = PropertiesService.getScriptProperties();
  let configStr = props.getProperty(CONFIG_PROPERTY);

  if (!configStr) {
    const defaultConfig = getDefaultConfig();
    configStr = JSON.stringify(defaultConfig);
    props.setProperty(CONFIG_PROPERTY, configStr);
    return defaultConfig;
  }

  const parsed = JSON.parse(configStr);
  return sanitizeConfig(parsed);
}

function saveConfig(configStr) {
  try {
    const parsed = JSON.parse(configStr);
    return saveConfigObject(parsed);
  } catch (e) {
    return { success: false, message: '❌❌❌ JSON inválido: ' + e.toString() };
  }
}

function saveConfigObject(configObj) {
  const email = getUserEmail();
  if (!isAdminUser(email)) {
    return { success: false, message: '❌❌❌ Acesso negado. Apenas administradores podem salvar.' };
  }

  try {
    const current = getConfig();
    const sanitized = sanitizeConfig(configObj);
    const validation = validateConfig(sanitized);

    if (!validation.success) {
      return validation;
    }

    const serialized = JSON.stringify(sanitized);
    writeJsonToFileProperty(CONFIG_FILE_ID_PROPERTY, CONFIG_FILE_NAME, sanitized);
    PropertiesService.getScriptProperties().setProperty(CONFIG_PROPERTY, serialized);

    const auditResult = appendAuditSafe('save', email, current, sanitized);
    if (!auditResult.success) {
      return {
        success: true,
        message: '✅✅✅ Configuração salva com sucesso! ⚠️⚠️⚠️ Histórico de auditoria reduzido por limite de armazenamento.'
      };
    }

    return { success: true, message: '✅✅✅ Configuração salva com sucesso!' };
  } catch (e) {
    const message = String(e && e.message ? e.message : e);
    if (message.toLowerCase().indexOf('quota') !== -1 || message.toLowerCase().indexOf('cota') !== -1) {
      return {
        success: false,
        message: '❌❌❌ Erro ao salvar: limite de armazenamento do Script Properties atingido. Reduza a quantidade/tamanho de itens e tente novamente.'
      };
    }
    return { success: false, message: '❌❌❌ Erro ao salvar: ' + message };
  }
}

function resetToDefault() {
  const email = getUserEmail();
  if (!isAdminUser(email)) {
    return { success: false, message: '❌❌❌ Acesso negado. Apenas administradores podem restaurar.' };
  }

  const current = getConfig();
  const defaultConfig = getDefaultConfig();
  writeJsonToFileProperty(CONFIG_FILE_ID_PROPERTY, CONFIG_FILE_NAME, defaultConfig);
  PropertiesService.getScriptProperties().setProperty(CONFIG_PROPERTY, JSON.stringify(defaultConfig));
  appendAudit('reset', email, current, defaultConfig);
  return { success: true, message: '✅✅✅ Configuração restaurada para o padrão original!' };
}

function getAuditLog(limit) {
  const email = getUserEmail();
  if (!isAdminUser(email)) {
    return [];
  }

  const parsedLimit = Number(limit) || 10;
  const logs = getAuditEntries();
  return logs.slice(0, parsedLimit);
}

function undoLastChange() {
  const email = getUserEmail();
  if (!isAdminUser(email)) {
    return { success: false, message: '❌❌❌ Acesso negado. Apenas administradores podem desfazer.' };
  }

  const logs = getAuditEntries();
  if (!logs.length) {
    return { success: false, message: '⚠️⚠️⚠️ Não há alterações para desfazer.' };
  }

  const last = logs.shift();
  writeJsonToFileProperty(CONFIG_FILE_ID_PROPERTY, CONFIG_FILE_NAME, last.before);
  PropertiesService.getScriptProperties().setProperty(CONFIG_PROPERTY, JSON.stringify(last.before));
  writeJsonToFileProperty(AUDIT_FILE_ID_PROPERTY, AUDIT_FILE_NAME, logs);
  PropertiesService.getScriptProperties().setProperty(AUDIT_LOG_PROPERTY, JSON.stringify(logs));

  return {
    success: true,
    message: '✅✅✅ Última alteração desfeita com sucesso!',
  };
}

function getDefaultConfig() {
  return {
    appName: 'Portal Nugesp',
    primaryColor: '#1e40af',
    iconStyle: 'solid',
    categories: [
      {
        id: 'crp',
        name: 'CRP - Controle de Recursos Públicos',
        icon: 'fa-landmark',
        color: '#1e40af',
        subtopics: [
          { id: 'planilhas', title: 'Planilhas', icon: 'fa-file-excel', items: [] },
          { id: 'formularios', title: 'Formulários', icon: 'fa-file-lines', items: [] },
          { id: 'documentos', title: 'Documentos', icon: 'fa-file-word', items: [] },
          { id: 'pastas-drive', title: 'Pastas Drive', icon: 'fa-folder-open', items: [] },
        ],
      },
    ],
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

    return contents;
  } catch (e) {
    throw new Error('Não foi possível acessar a pasta.');
  }
}


function normalizeItemType(type, item) {
  const raw = String(type || '').trim().toLowerCase();
  if (['link', 'sheet', 'folder'].includes(raw)) {
    return raw;
  }

  // Compatibilidade com configurações legadas.
  if (['form', 'forms', 'formulario', 'formulário'].includes(raw)) {
    return 'link';
  }

  if (['planilha', 'planilhas', 'spreadsheet'].includes(raw)) {
    return 'sheet';
  }

  if (['pasta', 'pastas', 'drive-folder', 'drive_folder'].includes(raw)) {
    return 'folder';
  }

  const hasFolderId = String(item && item.folderId || '').trim();
  if (hasFolderId) {
    return 'folder';
  }

  return 'link';
}

function sanitizeConfig(configObj) {
  const base = configObj || {};
  const categories = Array.isArray(base.categories) ? base.categories : [];

  return {
    appName: String(base.appName || 'Portal Nugesp').trim(),
    primaryColor: String(base.primaryColor || '#1e40af').trim(),
    iconStyle: String(base.iconStyle || 'solid').trim(),
    categories: categories.map(function (cat, catIndex) {
      const subtopics = Array.isArray(cat.subtopics) ? cat.subtopics : [];
      return {
        id: slugify(cat.id || cat.name || 'categoria-' + (catIndex + 1)),
        name: String(cat.name || '').trim(),
        icon: String(cat.icon || 'fa-folder').trim(),
        color: String(cat.color || '#1e40af').trim(),
        subtopics: subtopics.map(function (sub, subIndex) {
          const items = Array.isArray(sub.items) ? sub.items : [];
          return {
            id: slugify(sub.id || sub.title || 'subtopico-' + (subIndex + 1)),
            title: String(sub.title || '').trim(),
            icon: String(sub.icon || 'fa-link').trim(),
            items: items.map(function (item) {
              return {
                name: String(item.name || '').trim(),
                desc: String(item.desc || '').trim(),
                type: normalizeItemType(item.type || 'link', item),
                url: String(item.url || '').trim(),
                folderId: String(item.folderId || '').trim(),
              };
            }),
          };
        }),
      };
    }),
  };
}

function validateConfig(configObj) {
  if (!configObj.appName) {
    return { success: false, message: '❌ Nome do app é obrigatório.' };
  }

  if (!Array.isArray(configObj.categories) || !configObj.categories.length) {
    return { success: false, message: '❌ É necessário ao menos 1 categoria.' };
  }

  for (let i = 0; i < configObj.categories.length; i++) {
    const cat = configObj.categories[i];
    if (!cat.name) {
      return { success: false, message: '❌ Categoria #' + (i + 1) + ' sem nome.' };
    }

    if (!Array.isArray(cat.subtopics) || !cat.subtopics.length) {
      return { success: false, message: '❌ A categoria "' + cat.name + '" precisa de ao menos 1 seção.' };
    }

    for (let j = 0; j < cat.subtopics.length; j++) {
      const sub = cat.subtopics[j];
      if (!sub.title) {
        return { success: false, message: '❌ Seção #' + (j + 1) + ' da categoria "' + cat.name + '" sem título.' };
      }

      for (let k = 0; k < sub.items.length; k++) {
        const item = sub.items[k];
        if (!item.name) {
          return { success: false, message: '❌ Item #' + (k + 1) + ' da seção "' + sub.title + '" sem nome.' };
        }

        if (!['link', 'sheet', 'folder'].includes(item.type)) {
          return { success: false, message: '❌ Tipo inválido no item "' + item.name + '".' };
        }

        if (item.type === 'folder' && !item.folderId) {
          return { success: false, message: '❌ Informe o ID da pasta no item "' + item.name + '".' };
        }

        if (item.type !== 'folder' && !item.url) {
          return { success: false, message: '❌ Informe a URL no item "' + item.name + '".' };
        }
      }
    }
  }

  return { success: true };
}

function isAdminUser(email) {
  const admins = getAdminEmailsList();
  if (!admins.length) {
    return true;
  }
  return admins.indexOf(String(email || '').toLowerCase()) !== -1;
}

function getAdminEmailsList() {
  const raw = PropertiesService.getScriptProperties().getProperty(ADMIN_EMAILS_PROPERTY) || '';
  return raw
    .split(',')
    .map(function (v) { return v.trim().toLowerCase(); })
    .filter(function (v) { return !!v; });
}

function appendAuditSafe(action, email, beforeConfig, afterConfig) {
  try {
    appendAudit(action, email, beforeConfig, afterConfig);
    return { success: true };
  } catch (e) {
    const logs = getAuditEntries().slice(0, 3);
    try {
      PropertiesService.getScriptProperties().setProperty(AUDIT_LOG_PROPERTY, JSON.stringify(logs));
      appendAudit(action, email, beforeConfig, afterConfig);
      return { success: true };
    } catch (retryError) {
      return { success: false };
    }
  }
}

function appendAudit(action, email, beforeConfig, afterConfig) {
  const logs = getAuditEntries();
  logs.unshift({
    action: action,
    email: email,
    timestamp: new Date().toISOString(),
    before: beforeConfig,
    after: afterConfig,
  });

  const trimmed = logs.slice(0, MAX_AUDIT_ENTRIES);
  writeJsonToFileProperty(AUDIT_FILE_ID_PROPERTY, AUDIT_FILE_NAME, trimmed);
  PropertiesService.getScriptProperties().setProperty(AUDIT_LOG_PROPERTY, JSON.stringify(trimmed));
}

function getAuditEntries() {
  const fileLogs = readJsonFromFileProperty(AUDIT_FILE_ID_PROPERTY);
  if (Array.isArray(fileLogs)) {
    return fileLogs;
  }

  const raw = PropertiesService.getScriptProperties().getProperty(AUDIT_LOG_PROPERTY) || '[]';
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function readJsonFromFileProperty(fileIdPropertyName) {
  const props = PropertiesService.getScriptProperties();
  const fileId = String(props.getProperty(fileIdPropertyName) || '').trim();
  if (!fileId) return null;

  try {
    const file = DriveApp.getFileById(fileId);
    const content = file.getBlob().getDataAsString('UTF-8');
    if (!content) return null;
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

function writeJsonToFileProperty(fileIdPropertyName, fileName, data) {
  const props = PropertiesService.getScriptProperties();
  let fileId = String(props.getProperty(fileIdPropertyName) || '').trim();
  const json = JSON.stringify(data);

  try {
    if (fileId) {
      const file = DriveApp.getFileById(fileId);
      file.setContent(json);
      return;
    }
  } catch (e) {
    fileId = '';
  }

  try {
    const file = DriveApp.createFile(fileName, json, MimeType.PLAIN_TEXT);
    props.setProperty(fileIdPropertyName, file.getId());
  } catch (e) {
    // Sem permissão de escrita no Drive: mantém persistência no Script Properties.
  }
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}
