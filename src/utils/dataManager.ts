
import { Medicine } from "@/types";

export class DataManager {
  private static readonly STORAGE_KEYS = {
    medicines: 'medcontrol_medicines',
    distributions: 'medcontrol_distributions',
    requests: 'medcontrol_medication_requests',
    auth: 'medcontrol-auth',
    user: 'medcontrol-user'
  };

  // Exportar todos os dados para backup
  static exportAllData(): string {
    const data = {
      medicines: localStorage.getItem(this.STORAGE_KEYS.medicines),
      distributions: localStorage.getItem(this.STORAGE_KEYS.distributions),
      requests: localStorage.getItem(this.STORAGE_KEYS.requests),
      auth: localStorage.getItem(this.STORAGE_KEYS.auth),
      user: localStorage.getItem(this.STORAGE_KEYS.user),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Importar dados de backup
  static importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // Validar estrutura básica
      if (!data.exportDate || !data.version) {
        throw new Error('Formato de backup inválido');
      }
      
      // Restaurar dados
      Object.entries(this.STORAGE_KEYS).forEach(([key, storageKey]) => {
        if (data[key]) {
          localStorage.setItem(storageKey, data[key]);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // Criar backup automático
  static createAutoBackup(): void {
    const backupData = this.exportAllData();
    const backupKey = `medcontrol_backup_${Date.now()}`;
    
    try {
      localStorage.setItem(backupKey, backupData);
      
      // Manter apenas os 5 backups mais recentes
      this.cleanOldBackups();
    } catch (error) {
      console.error('Erro ao criar backup automático:', error);
    }
  }

  // Limpar backups antigos
  private static cleanOldBackups(): void {
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys
      .filter(key => key.startsWith('medcontrol_backup_'))
      .sort((a, b) => {
        const timeA = parseInt(a.split('_')[2]);
        const timeB = parseInt(b.split('_')[2]);
        return timeB - timeA; // Mais recente primeiro
      });
    
    // Remover backups além dos 5 mais recentes
    backupKeys.slice(5).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Verificar integridade dos dados
  static validateData(): boolean {
    try {
      const medicinesData = localStorage.getItem(this.STORAGE_KEYS.medicines);
      if (medicinesData) {
        const medicines = JSON.parse(medicinesData);
        if (!Array.isArray(medicines)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro na validação dos dados:', error);
      return false;
    }
  }

  // Migrar dados entre versões se necessário
  static migrateDataIfNeeded(): void {
    const currentVersion = localStorage.getItem('medcontrol_data_version');
    const targetVersion = '1.0.0';
    
    if (currentVersion !== targetVersion) {
      console.log('Migrando dados para nova versão...');
      
      // Criar backup antes da migração
      this.createAutoBackup();
      
      // Aplicar migrações se necessário
      // (adicionar lógica de migração aqui conforme necessário)
      
      localStorage.setItem('medcontrol_data_version', targetVersion);
      console.log('Migração concluída');
    }
  }
}
