#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando configurações dos ícones...\n');

// Verificar se a extensão está instalada
const extensionsPath = path.join(process.env.APPDATA || process.env.HOME, '.vscode', 'extensions');
const materialIconPath = path.join(extensionsPath, 'pkief.material-icon-theme-*');

console.log('📁 Verificando extensão Material Icon Theme...');
if (fs.existsSync(extensionsPath)) {
  const extensions = fs.readdirSync(extensionsPath);
  const materialIcon = extensions.find(ext => ext.startsWith('pkief.material-icon-theme-'));
  
  if (materialIcon) {
    console.log('✅ Material Icon Theme encontrado:', materialIcon);
  } else {
    console.log('❌ Material Icon Theme não encontrado');
    console.log('💡 Instale a extensão: https://marketplace.visualstudio.com/items?itemName=pkief.material-icon-theme');
  }
} else {
  console.log('❌ Diretório de extensões não encontrado');
}

// Verificar configurações do projeto
const projectSettingsPath = path.join(__dirname, '.vscode', 'settings.json');
console.log('\n📋 Verificando configurações do projeto...');

if (fs.existsSync(projectSettingsPath)) {
  const settings = JSON.parse(fs.readFileSync(projectSettingsPath, 'utf8'));
  
  if (settings['workbench.iconTheme'] === 'material-icon-theme') {
    console.log('✅ Tema de ícones configurado corretamente');
  } else {
    console.log('❌ Tema de ícones não configurado');
  }
  
  if (settings['material-icon-theme.activeIconPack'] === 'nest') {
    console.log('✅ Pack de ícones NestJS configurado');
  } else {
    console.log('❌ Pack de ícones NestJS não configurado');
  }
  
  if (settings['explorer.decorations.colors']) {
    console.log('✅ Cores dos ícones habilitadas');
  } else {
    console.log('❌ Cores dos ícones desabilitadas');
  }
  
  if (settings['explorer.decorations.badges']) {
    console.log('✅ Badges dos ícones habilitados');
  } else {
    console.log('❌ Badges dos ícones desabilitados');
  }
} else {
  console.log('❌ Arquivo de configurações não encontrado');
}

// Verificar estrutura do projeto
console.log('\n📂 Verificando estrutura do projeto...');
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  const srcContents = fs.readdirSync(srcPath);
  console.log('✅ Estrutura src/ encontrada com:', srcContents.join(', '));
} else {
  console.log('❌ Diretório src/ não encontrado');
}

console.log('\n🎯 Próximos passos:');
console.log('1. Reinicie o VS Code/Cursor');
console.log('2. Pressione Ctrl+Shift+P e digite "Material Icons: Activate Icon Theme"');
console.log('3. Pressione Ctrl+Shift+P e digite "Material Icons: Change Icon Pack" e selecione "NestJS"');
console.log('4. Se ainda não funcionar, pressione Ctrl+Shift+P e digite "Developer: Reload Window"');

console.log('\n📖 Para mais informações, consulte: .vscode/README.md'); 