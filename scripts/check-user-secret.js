const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Verificar todos os usuários e seus campos secret
db.all('SELECT email, secretQuestion, secretAnswer FROM user', (err, rows) => {
  if (err) {
    console.error('Erro ao consultar o banco:', err.message);
    process.exit(1);
  }
  
  console.log('=== VERIFICAÇÃO DOS CAMPOS SECRET ===');
  console.log(`Total de usuários: ${rows.length}`);
  console.log('');
  
  rows.forEach((row, index) => {
    console.log(`Usuário ${index + 1}:`);
    console.log(`  Email: ${row.email}`);
    console.log(`  SecretQuestion: ${row.secretQuestion || 'NÃO DEFINIDA'}`);
    console.log(`  SecretAnswer: ${row.secretAnswer ? 'DEFINIDA (hash)' : 'NÃO DEFINIDA'}`);
    console.log('');
  });
  
  db.close();
}); 