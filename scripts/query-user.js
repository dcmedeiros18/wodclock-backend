const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const email = 'dc.medeiros@teste2.com';

db.get('SELECT email, secretAnswer FROM user WHERE email = ?', [email], (err, row) => {
  if (err) {
    console.error('Erro ao consultar o banco:', err.message);
    process.exit(1);
  }
  if (!row) {
    console.log(`Nenhum usuário encontrado com o e-mail: ${email}`);
  } else {
    console.log('Dados do usuário:');
    console.log(row);
  }
  db.close();
}); 