
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Medicine } from "@/types";
import { DataManager } from "@/utils/dataManager";

const MEDICINES_STORAGE_KEY = "medcontrol_medicines";

interface MedicineContextType {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  updateMedicines: (updatedMedicines: Medicine[]) => void;
  updateMedicine: (updatedMedicine: Medicine) => void;
  addMedicine: (medicine: Medicine) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const MedicineProvider = ({ children }: { children: ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const loadMedicines = () => {
      try {
        console.log("=== CARREGANDO MEDICAMENTOS ===");
        
        // Verificar e migrar dados se necessário
        DataManager.migrateDataIfNeeded();
        
        // Validar integridade dos dados
        if (!DataManager.validateData()) {
          console.warn('Dados corrompidos detectados, criando backup de emergência...');
          DataManager.createAutoBackup();
        }
        
        const storedMedicines = localStorage.getItem(MEDICINES_STORAGE_KEY);
        console.log("Medicamentos brutos do localStorage:", storedMedicines);
        
        if (storedMedicines) {
          const parsedMedicines = JSON.parse(storedMedicines);
          console.log("✅ Medicamentos parseados:", parsedMedicines);
          console.log("Total de medicamentos carregados:", parsedMedicines.length);
          setMedicines(parsedMedicines);
        } else {
          // Initialize with empty array if no data exists
          console.log("Nenhum medicamento encontrado, inicializando array vazio");
          localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify([]));
          setMedicines([]);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar medicamentos:", error);
        setMedicines([]);
      }
    };
    
    loadMedicines();
    
    // Criar backup automático na inicialização
    DataManager.createAutoBackup();
  }, []);

  const updateMedicines = (updatedMedicines: Medicine[]) => {
    console.log("=== ATUALIZANDO LISTA DE MEDICAMENTOS ===");
    console.log("Novos medicamentos:", updatedMedicines);
    
    try {
      setMedicines(updatedMedicines);
      localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(updatedMedicines));
      
      // Verificar se foi salvo corretamente
      const saved = localStorage.getItem(MEDICINES_STORAGE_KEY);
      console.log("✅ Medicamentos salvos no localStorage:", saved);
      
      // Criar backup após grandes alterações
      DataManager.createAutoBackup();
      
    } catch (error) {
      console.error("❌ Erro ao atualizar medicamentos:", error);
    }
  };

  // Add new function to update a single medicine
  const updateMedicine = (updatedMedicine: Medicine) => {
    console.log("=== ATUALIZANDO MEDICAMENTO INDIVIDUAL ===");
    console.log("Medicamento atualizado:", updatedMedicine);
    
    try {
      const updatedMedicines = medicines.map(med => 
        med.id === updatedMedicine.id ? updatedMedicine : med
      );
      
      setMedicines(updatedMedicines);
      localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(updatedMedicines));
      
      console.log("✅ Medicamento atualizado com sucesso");
      
    } catch (error) {
      console.error("❌ Erro ao atualizar medicamento individual:", error);
    }
  };

  // Add new function to add a medicine
  const addMedicine = (medicine: Medicine) => {
    console.log("=== ADICIONANDO NOVO MEDICAMENTO ===");
    console.log("Medicamento a ser adicionado:", medicine);
    console.log("Lista atual de medicamentos:", medicines);
    
    try {
      const newMedicines = [...medicines, medicine];
      console.log("Nova lista de medicamentos:", newMedicines);
      
      setMedicines(newMedicines);
      localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(newMedicines));
      
      // Verificar se foi salvo corretamente
      const saved = localStorage.getItem(MEDICINES_STORAGE_KEY);
      console.log("✅ Medicamentos salvos após adição:", saved);
      
      console.log("=== MEDICAMENTO ADICIONADO COM SUCESSO ===");
      
    } catch (error) {
      console.error("❌ Erro ao adicionar medicamento:", error);
    }
  };

  // Funções de export/import
  const exportData = () => {
    console.log("Exportando dados do sistema...");
    return DataManager.exportAllData();
  };

  const importData = (data: string) => {
    console.log("Importando dados do sistema...");
    const success = DataManager.importAllData(data);
    if (success) {
      // Recarregar dados após import
      const storedMedicines = localStorage.getItem(MEDICINES_STORAGE_KEY);
      if (storedMedicines) {
        setMedicines(JSON.parse(storedMedicines));
      }
      console.log("✅ Dados importados com sucesso");
    } else {
      console.log("❌ Falha ao importar dados");
    }
    return success;
  };

  return (
    <MedicineContext.Provider value={{ 
      medicines, 
      setMedicines, 
      updateMedicines,
      updateMedicine,
      addMedicine,
      exportData,
      importData
    }}>
      {children}
    </MedicineContext.Provider>
  );
};

export const useMedicines = () => {
  const context = useContext(MedicineContext);
  if (context === undefined) {
    throw new Error("useMedicines must be used within a MedicineProvider");
  }
  return context;
};
