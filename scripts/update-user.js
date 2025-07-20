const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const email = 'dc.medeiros@teste2.com';
const secretAnswer = 'teste';

db.run('UPDATE user SET secretAnswer = ? WHERE email = ?', [secretAnswer, email], function(err) {
  if (err) {
    console.error('Erro ao atualizar o usuário:', err.message);
    process.exit(1);
  }
  
  if (this.changes > 0) {
    console.log(`Usuário ${email} atualizado com sucesso!`);
    console.log(`SecretAnswer definida como: ${secretAnswer}`);
  } else {
    console.log(`Nenhum usuário encontrado com o e-mail: ${email}`);
  }
  
  db.close();
}); 