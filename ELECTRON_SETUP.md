
# Guia de Configuração do Electron

## 📱 Como Transformar em App Desktop

### Passo 1: Preparar o Build Web
```bash
npm run build
```

### Passo 2: Configurar Electron (Em projeto separado)

1. **Criar pasta separada para Electron:**
```bash
mkdir med-control-electron
cd med-control-electron
npm init -y
```

2. **Instalar dependências do Electron:**
```bash
npm install electron electron-builder electron-updater
npm install --save-dev @types/electron
```

3. **Copiar arquivos de configuração:**
- Copie `electron/main.ts` para `src/main.ts`
- Copie `electron-builder.json` para a raiz
- Copie a pasta `dist/` do build web para `dist/`

4. **Configurar package.json:**
```json
{
  "main": "dist/main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "electron . --dev",
    "build": "tsc && electron-builder",
    "dist": "electron-builder",
    "publish": "electron-builder --publish=always"
  }
}
```

### Passo 3: Compilar e Empacotar
```bash
# Compilar TypeScript
npx tsc

# Criar instalador
npm run dist
```

## 🔄 Fluxo de Atualizações

1. Faça alterações no código web
2. Execute `npm run build`
3. Copie a pasta `dist/` para o projeto Electron
4. Execute `npm run publish` no projeto Electron

## 📋 Estrutura Recomendada
```
projeto-web/          # Este projeto (React/Vite)
├── src/
├── dist/             # Build web
└── package.json

med-control-electron/  # Projeto Electron separado
├── src/main.ts
├── dist/             # Cópia do build web
├── electron-builder.json
└── package.json
```

Esta separação evita conflitos de dependências e mantém o projeto web limpo.
