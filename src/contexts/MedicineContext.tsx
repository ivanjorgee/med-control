
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Medicine } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface MedicineContextType {
  medicines: Medicine[];
  setMedicines: React.Dispatch<React.SetStateAction<Medicine[]>>;
  updateMedicines: (updatedMedicines: Medicine[]) => void;
  updateMedicine: (updatedMedicine: Medicine) => void;
  addMedicine: (medicine: Medicine) => void;
  loading: boolean;
  refetch: () => Promise<void>;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const MedicineProvider = ({ children }: { children: ReactNode }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchMedicines = async () => {
    if (!isAuthenticated) {
      setMedicines([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medicines:', error);
        return;
      }

      // Transform data to match existing Medicine interface
      const transformedMedicines: Medicine[] = data.map(med => ({
        id: med.id,
        name: med.name,
        description: med.description || '',
        category: med.category,
        measureUnit: med.measure_unit,
        batchNumber: med.batch_number,
        expirationDate: med.expiration_date,
        manufacturer: med.manufacturer,
        quantity: med.quantity,
        minQuantity: med.min_quantity,
        status: med.status as Medicine['status'],
        locationId: med.location_id || ''
      }));

      setMedicines(transformedMedicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [isAuthenticated]);

  const updateMedicines = async (updatedMedicines: Medicine[]) => {
    setMedicines(updatedMedicines);
  };

  const updateMedicine = async (updatedMedicine: Medicine) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .update({
          name: updatedMedicine.name,
          description: updatedMedicine.description,
          category: updatedMedicine.category,
          measure_unit: updatedMedicine.measureUnit,
          batch_number: updatedMedicine.batchNumber,
          expiration_date: updatedMedicine.expirationDate,
          manufacturer: updatedMedicine.manufacturer,
          quantity: updatedMedicine.quantity,
          min_quantity: updatedMedicine.minQuantity,
          status: updatedMedicine.status,
          location_id: updatedMedicine.locationId,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedMedicine.id);

      if (error) {
        console.error('Error updating medicine:', error);
        return;
      }

      setMedicines(prev => prev.map(med => 
        med.id === updatedMedicine.id ? updatedMedicine : med
      ));
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const addMedicine = async (medicine: Medicine) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert({
          id: medicine.id,
          name: medicine.name,
          description: medicine.description,
          category: medicine.category,
          measure_unit: medicine.measureUnit,
          batch_number: medicine.batchNumber,
          expiration_date: medicine.expirationDate,
          manufacturer: medicine.manufacturer,
          quantity: medicine.quantity,
          min_quantity: medicine.minQuantity,
          status: medicine.status,
          location_id: medicine.locationId
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding medicine:', error);
        return;
      }

      setMedicines(prev => [medicine, ...prev]);
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const refetch = fetchMedicines;

  // Legacy functions for compatibility
  const exportData = () => {
    return JSON.stringify({ medicines });
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.medicines) {
        setMedicines(parsed.medicines);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <MedicineContext.Provider value={{ 
      medicines, 
      setMedicines, 
      updateMedicines,
      updateMedicine,
      addMedicine,
      loading,
      refetch
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
