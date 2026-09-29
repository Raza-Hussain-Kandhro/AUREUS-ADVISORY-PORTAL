// Mock-mode storage for advisor-contact messages and public consultation
// leads, shared between the controllers that write to it (leadController,
// syncController) and the one that reads it back (advisorController). This
// only backs mock mode — real deployments read from MongoDB (Lead + SyncTask
// collections) instead.

let messages = [];
let leads = [];
let counter = 0;

function nextId(prefix) {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

export function addMockMessage({ userId, userName, message, preferredTime }) {
  const record = {
    id: nextId('msg'),
    type: 'message',
    from: userName,
    userId,
    message,
    preferredTime: preferredTime ?? null,
    createdAt: Date.now(),
    status: 'new',
  };
  messages.push(record);
  return record;
}

export function addMockLead({ name, email, phone, investableAssets, message }) {
  const record = {
    id: nextId('lead'),
    type: 'lead',
    from: name,
    email,
    phone: phone ?? null,
    investableAssets: investableAssets ?? null,
    message,
    createdAt: Date.now(),
    status: 'new',
  };
  leads.push(record);
  return record;
}

export function listMockInbox() {
  return [...messages, ...leads].sort((a, b) => b.createdAt - a.createdAt);
}

export function markMockItemHandled(type, id) {
  const list = type === 'message' ? messages : leads;
  const item = list.find((i) => i.id === id);
  if (item) item.status = 'handled';
  return item ?? null;
}
