const axios = require('axios');

async function testValidateAnswer() {
  try {
    const response = await axios.post('http://localhost:3000/auth/validate-answer', {
      email: 'dc.medeiros@teste3.com',
      secretAnswer: 'azul'
    });
    
    console.log('Resposta:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

testValidateAnswer(); 