const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./database.sqlite');

async function setupUserSecret() {
  const email = 'dc.medeiros@teste3.com'; // Altere para o email desejado
  const secretQuestion = 'Qual sua cor favorita?';
  const secretAnswer = 'azul';

  try {
    // Hash da resposta secreta
    const hashedAnswer = await bcrypt.hash(secretAnswer, 10);
    
    // Atualizar o usuário
    db.run('UPDATE user SET secretQuestion = ?, secretAnswer = ? WHERE email = ?', 
      [secretQuestion, hashedAnswer, email], 
      function(err) {
        if (err) {
          console.error('Erro ao atualizar o usuário:', err.message);
          process.exit(1);
        }
        
        if (this.changes > 0) {
          console.log(`Usuário ${email} atualizado com sucesso!`);
          console.log(`SecretQuestion: ${secretQuestion}`);
          console.log(`SecretAnswer: ${secretAnswer} (hash: ${hashedAnswer.substring(0, 20)}...)`);
        } else {
          console.log(`Nenhum usuário encontrado com o e-mail: ${email}`);
        }
        
        db.close();
      }
    );
  } catch (error) {
    console.error('Erro:', error);
    db.close();
  }
}

setupUserSecret(); 