
// Utility para limpar dados antigos do localStorage
export const cleanupLocalStorage = () => {
  try {
    // Limpar dados antigos que podem estar conflitando
    const keysToClean = [
      'medcontrol_medicines',
      'medcontrol_distributions', 
      'medcontrol_medication_requests',
      'medcontrol_dispensations'
    ];
    
    keysToClean.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log(`Limpando ${parsedData.length} registros antigos de ${key}`);
            localStorage.setItem(key, JSON.stringify([]));
          }
        } catch (error) {
          console.log(`Removendo chave inválida: ${key}`);
          localStorage.removeItem(key);
        }
      }
    });
    
    console.log("✅ Limpeza do localStorage concluída");
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
  }
};
