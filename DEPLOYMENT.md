
# Guia de Empacotamento e Distribuição

## 📦 Como Empacotar a Aplicação

### Pré-requisitos
- Node.js instalado
- npm ou yarn
- Git (para versionamento e releases)

### Passo a Passo

1. **Instalar dependências**
```bash
npm install
```

2. **Fazer build completo**
```bash
npm run build:complete
```
Ou manualmente:
```bash
# Build da aplicação React
npm run build

# Build do Electron
npx tsc -p electron/tsconfig.json

# Empacotar
npx electron-builder
```

3. **Encontrar os arquivos**
Os arquivos empacotados estarão em `dist-electron/`:
- Windows: `.exe` (instalador NSIS)
- macOS: `.dmg`
- Linux: `.AppImage` e `.deb`

## 🔄 Sistema de Atualizações Automáticas

### Configuração do GitHub Releases

1. **Criar repositório no GitHub**
2. **Configurar no electron-builder.json**:
```json
"publish": {
  "provider": "github",
  "owner": "seu-usuario",
  "repo": "med-control",
  "private": true
}
```

3. **Gerar token do GitHub**:
   - Ir em Settings > Developer settings > Personal access tokens
   - Criar token com permissões de `repo`
   - Adicionar como variável de ambiente: `GH_TOKEN=seu_token`

4. **Publicar release**:
```bash
npx electron-builder --publish=always
```

### Como Funciona

- A aplicação verifica atualizações automaticamente na inicialização
- Downloads são feitos em segundo plano
- Usuário é notificado quando atualização está pronta
- Dados são preservados durante atualizações

## 💾 Preservação de Dados

### Backup Automático
- Backups são criados automaticamente na inicialização
- Mantém os 5 backups mais recentes
- Dados são validados quanto à integridade

### Export/Import Manual
```javascript
// Exportar dados
const data = DataManager.exportAllData();

// Importar dados
const success = DataManager.importAllData(jsonData);
```

### Dados Preservados
- Medicamentos cadastrados
- Distribuições realizadas
- Solicitações de medicamentos
- Dados de autenticação
- Configurações do usuário

## 🚀 Distribuição

### Para Instalação Local
1. Envie o arquivo instalador (`.exe`, `.dmg`, `.deb`) para os computadores
2. Execute o instalador
3. A aplicação estará disponível no menu/desktop

### Para Atualizações
1. Publique nova versão no GitHub Releases
2. As aplicações instaladas verificarão automaticamente
3. Usuários serão notificados sobre atualizações disponíveis

## 🔧 Troubleshooting

### Problemas Comuns

**Build falha:**
- Verificar se todas as dependências estão instaladas
- Verificar se o TypeScript compila sem erros

**Auto-updater não funciona:**
- Verificar configuração do GitHub
- Verificar se o token tem permissões corretas
- Verificar se a aplicação foi assinada (para produção)

**Dados perdidos:**
- Verificar se os backups automáticos existem
- Usar função de import para restaurar dados

### Logs de Debug
```bash
# Para ver logs do auto-updater
DEBUG=electron-updater npm start
```

## 📋 Checklist de Release

- [ ] Testar build local
- [ ] Verificar se dados são preservados
- [ ] Testar instalação limpa
- [ ] Verificar auto-updater em ambiente de teste
- [ ] Criar release notes
- [ ] Publicar no GitHub Releases
- [ ] Notificar usuários sobre nova versão
