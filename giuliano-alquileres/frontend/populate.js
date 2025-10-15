// populate.js
async function populateDatabase() {
  const API_URL = 'https://giulianoa-backend.onrender.com/api';
  
  console.log('🚀 Iniciando população do banco...');
  
  try {
    // 1. Adicionar cidades
    const cities = [
      { name: 'Balneário Camboriú', state: 'SC' },
      { name: 'Florianópolis', state: 'SC' },
      { name: 'Itajaí', state: 'SC' }
    ];
    
    console.log('📍 Adicionando cidades...');
    for (const city of cities) {
      await fetch(`${API_URL}/utilities/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city)
      }).catch(() => console.log(`Cidade ${city.name} já existe ou erro`));
    }
    
    // 2. Criar usuário admin (você precisa fazer login primeiro)
    console.log('👤 Criando usuário admin...');
    await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin',
        email: 'admin@giuliano.com',
        password: 'admin123',
        phone: '47999999999'
      })
    }).then(res => res.json())
      .then(data => console.log('✅ Admin criado:', data.message))
      .catch(err => console.log('Admin já existe ou erro:', err));
    
    console.log('🎉 Banco populado com dados iniciais!');
    console.log('📝 Agora faça login com admin@giuliano.com / admin123');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

populateDatabase();