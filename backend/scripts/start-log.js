const { exec } = require('child_process');

// Logs iniciais do container
console.log('\n============================================');
console.log('🚀 Iniciando backend dentro do Docker...');
console.log('============================================\n');

// Aguarda 0.3s para clareza visual (opcional)
setTimeout(() => {
  console.log('🌐 Inicializando servidor...');
  require('../dist/server.js');
}, 300);
