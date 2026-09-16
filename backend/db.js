const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "audit_store.json");

const initialDb = {
  policies: [],
  auditLogs: [],
  fileEvents: [],
  alerts: [],
};

function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("[DB] Error loading database:", err);
    return initialDb;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[DB] Error saving database:", err);
  }
}

module.exports = {
  getDb: loadDb,

  addAuditLog: (log) => {
    const db = loadDb();
    db.auditLogs.unshift(log);
    if (db.auditLogs.length > 500) db.auditLogs.pop();
    saveDb(db);
  },

  addFileEvent: (evt) => {
    const db = loadDb();
    db.fileEvents.unshift(evt);
    if (db.fileEvents.length > 500) db.fileEvents.pop();
    saveDb(db);
  },

  addAlert: (alert) => {
    const db = loadDb();
    db.alerts.unshift(alert);
    if (db.alerts.length > 200) db.alerts.pop();
    saveDb(db);
  },

  savePolicies: (policies) => {
    const db = loadDb();
    db.policies = policies;
    saveDb(db);
  },

  addPolicy: (policy) => {
    const db = loadDb();
    db.policies.unshift(policy);
    saveDb(db);
    return policy;
  },

  removePolicy: (id) => {
    const db = loadDb();
    const before = db.policies.length;
    db.policies = db.policies.filter((p) => p.id !== id);
    saveDb(db);
    return db.policies.length !== before;
  },

  updatePolicy: (id, patch) => {
    const db = loadDb();
    const idx = db.policies.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    db.policies[idx] = { ...db.policies[idx], ...patch, updatedAt: new Date().toISOString() };
    saveDb(db);
    return db.policies[idx];
  },
};
