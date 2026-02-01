const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'super-secret-key';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Load DB
function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    return { entries: [] };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Login
app.post('/auth/login', (req, res) => {
  // Mock login - accept any credentials
  const user = { name: 'Admin', email: 'admin@sistema.com' };
  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: '24h' });
  res.json({ accessToken, user });
});

// Get Entries (with pagination and filters)
app.get('/entries', authenticateToken, (req, res) => {
  const db = getDb();
  let results = db.entries;

  // Filtering
  const { q, tipo, status, startDate, endDate, _page, _limit, _sort, _order } = req.query;

  if (q) {
    const lowerQ = q.toLowerCase();
    results = results.filter(e => 
      e.historico.toLowerCase().includes(lowerQ) || 
      e.documento.toLowerCase().includes(lowerQ) ||
      e.conta.toLowerCase().includes(lowerQ)
    );
  }

  if (tipo) {
    results = results.filter(e => e.tipo === tipo);
  }

  if (status) {
    results = results.filter(e => e.status === status);
  }

  if (startDate) {
    results = results.filter(e => e.data >= startDate);
  }

  if (endDate) {
    results = results.filter(e => e.data <= endDate);
  }

  // Sorting
  if (_sort) {
    results.sort((a, b) => {
      if (a[_sort] < b[_sort]) return _order === 'desc' ? 1 : -1;
      if (a[_sort] > b[_sort]) return _order === 'desc' ? -1 : 1;
      return 0;
    });
  } else {
    // Default sort by date desc
    results.sort((a, b) => new Date(b.data) - new Date(a.data));
  }

  // Pagination
  const totalCount = results.length;
  const page = parseInt(_page) || 1;
  const limit = parseInt(_limit) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    data: paginatedResults,
    meta: {
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
});

// Get Summary (Balancete)
app.get('/dashboard/summary', authenticateToken, (req, res) => {
  const db = getDb();
  const entries = db.entries;

  const totalDebitos = entries
    .filter(e => e.tipo === 'DEBITO' && e.status !== 'CANCELADO')
    .reduce((sum, e) => sum + e.valor, 0);

  const totalCreditos = entries
    .filter(e => e.tipo === 'CREDITO' && e.status !== 'CANCELADO')
    .reduce((sum, e) => sum + e.valor, 0);

  res.json({
    totalDebitos,
    totalCreditos,
    saldo: totalCreditos - totalDebitos,
    count: entries.length
  });
});

// Create Entry
app.post('/entries', authenticateToken, (req, res) => {
  const db = getDb();
  const newEntry = {
    id: uuidv4(),
    ...req.body
  };
  
  // Basic validation
  if (!newEntry.data || !newEntry.tipo || !newEntry.valor || !newEntry.conta) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.entries.unshift(newEntry);
  saveDb(db);
  res.status(201).json(newEntry);
});

// Update Entry
app.put('/entries/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const index = db.entries.findIndex(e => e.id === req.params.id);
  
  if (index === -1) return res.status(404).json({ message: 'Entry not found' });

  db.entries[index] = { ...db.entries[index], ...req.body };
  saveDb(db);
  res.json(db.entries[index]);
});

// Delete Entry
app.delete('/entries/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const initialLength = db.entries.length;
  db.entries = db.entries.filter(e => e.id !== req.params.id);
  
  if (db.entries.length === initialLength) {
    return res.status(404).json({ message: 'Entry not found' });
  }

  saveDb(db);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API Mock running on http://localhost:${PORT}`);
});
