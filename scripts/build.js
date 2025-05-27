
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando processo de build...');

try {
  // Build da aplicação React
  console.log('📦 Fazendo build da aplicação React...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build da aplicação web concluído com sucesso!');
  console.log('📁 Arquivos gerados na pasta dist/');
  console.log('💡 Para criar o app desktop, use as ferramentas de empacotamento Electron separadamente.');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error);
  process.exit(1);
}
