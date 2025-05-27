
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Medicine } from "@/types";

const MEDICINES_STORAGE_KEY = "medcontrol_medicines";

interface MedicineContextType {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  updateMedicines: (updatedMedicines: Medicine[]) => void;
  updateMedicine: (updatedMedicine: Medicine) => void;
  addMedicine: (medicine: Medicine) => void;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const MedicineProvider = ({ children }: { children: ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const loadMedicines = () => {
      try {
        const storedMedicines = localStorage.getItem(MEDICINES_STORAGE_KEY);
        if (storedMedicines) {
          setMedicines(JSON.parse(storedMedicines));
        } else {
          // Initialize with empty array if no data exists
          localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify([]));
          setMedicines([]);
        }
      } catch (error) {
        console.error("Erro ao carregar medicamentos:", error);
        setMedicines([]);
      }
    };
    
    loadMedicines();
  }, []);

  const updateMedicines = (updatedMedicines: Medicine[]) => {
    setMedicines(updatedMedicines);
    localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(updatedMedicines));
  };

  // Add new function to update a single medicine
  const updateMedicine = (updatedMedicine: Medicine) => {
    const updatedMedicines = medicines.map(med => 
      med.id === updatedMedicine.id ? updatedMedicine : med
    );
    setMedicines(updatedMedicines);
    localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(updatedMedicines));
  };

  // Add new function to add a medicine
  const addMedicine = (medicine: Medicine) => {
    const newMedicines = [...medicines, medicine];
    setMedicines(newMedicines);
    localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(newMedicines));
  };

  return (
    <MedicineContext.Provider value={{ 
      medicines, 
      setMedicines, 
      updateMedicines,
      updateMedicine,
      addMedicine
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
