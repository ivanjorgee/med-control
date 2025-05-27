
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando processo de build...');

try {
  // 1. Build da aplicação React
  console.log('📦 Fazendo build da aplicação React...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Build do Electron
  console.log('⚡ Fazendo build do Electron...');
  execSync('npx tsc -p electron/tsconfig.json', { stdio: 'inherit' });

  // 3. Empacotar com electron-builder
  console.log('📱 Empacotando aplicação...');
  execSync('npx electron-builder', { stdio: 'inherit' });

  console.log('✅ Build concluído com sucesso!');
  console.log('📁 Arquivos gerados na pasta dist-electron/');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error);
  process.exit(1);
}
