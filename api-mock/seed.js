const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const COUNT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

const TIPOS = ['DEBITO', 'CREDITO'];
const STATUSES = ['PROVISORIO', 'CONFIRMADO', 'CANCELADO'];
const CONTAS = [
  '1.1.01 - Caixa Geral',
  '1.1.02 - Banco Conta Movimento',
  '2.1.01 - Fornecedores a Pagar',
  '3.1.01 - Receita de Vendas',
  '4.1.01 - Despesas Administrativas',
  '4.1.02 - Salários e Ordenados',
  '4.1.03 - Aluguéis',
  '4.1.04 - Energia Elétrica'
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEntries() {
  const entries = [];
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date();

  for (let i = 0; i < COUNT; i++) {
    const tipo = TIPOS[Math.floor(Math.random() * TIPOS.length)];
    const conta = CONTAS[Math.floor(Math.random() * CONTAS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    
    entries.push({
      id: uuidv4(),
      data: randomDate(startDate, endDate).toISOString().split('T')[0],
      tipo,
      conta,
      valor: parseFloat((Math.random() * 10000).toFixed(2)),
      historico: `Lançamento referente a ${conta.split(' - ')[1]} - Nota ${Math.floor(Math.random() * 1000)}`,
      documento: `DOC-${Math.floor(Math.random() * 100000)}`,
      status
    });
  }

  return entries;
}

const data = {
  entries: generateEntries()
};

fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
console.log(`Generated ${COUNT} entries in ${DB_PATH}`);
