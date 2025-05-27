
import { useState } from "react";
import { Medicine, MedicineStatus, Location } from "@/types";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useMedicines } from "@/contexts/MedicineContext";
import { useLocations } from "@/hooks/use-locations";

export function useStock() {
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('locationId');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(locationParam);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    locationParam ? [locationParam] : []
  );
  
  const { medicines, setMedicines, updateMedicine, addMedicine: addMedicineToContext } = useMedicines();
  const { locations } = useLocations();
  const { authUser, isAdmin } = useAuth();
  const { toast } = useToast();

  // Extract unique categories from medicines
  const categories = [...new Set(medicines.map(med => med.category))];

  // Get location name if a specific location is selected
  const getSelectedLocationName = () => {
    if (!selectedLocation) return null;
    
    const location = locations.find(loc => loc.id === selectedLocation);
    return location ? location.name : null;
  };
  
  const selectedLocationName = getSelectedLocationName();
  
  // Filter medicines based on search, category, status, and selected locations
  const filteredMedicines = medicines.filter(med => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === "all" || med.category === categoryFilter;
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || med.status === statusFilter;
    
    // Filter by locations (multiple selection)
    const matchesLocations = selectedLocations.length === 0 || 
      selectedLocations.includes(med.locationId);
    
    // Se não for admin, apenas vê medicamentos da sua unidade
    const matchesUserLocation = isAdmin || 
      med.locationId === authUser?.locationId;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocations && matchesUserLocation;
  });

  // Função para editar medicamentos
  const handleEditMedicine = (medicineId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem editar medicamentos.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the medicine to edit
    const medicineToEdit = medicines.find(med => med.id === medicineId);
    if (!medicineToEdit) {
      toast({
        title: "Erro",
        description: "Medicamento não encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    // For this implementation, we'll use a prompt to update quantity
    // In a real app, you'd use a form dialog
    const newQuantity = prompt(
      `Informe a nova quantidade para ${medicineToEdit.name}:`,
      medicineToEdit.quantity.toString()
    );
    
    if (newQuantity === null) return; // User canceled
    
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: "Erro",
        description: "Quantidade inválida.",
        variant: "destructive",
      });
      return;
    }
    
    // Update medicine with the correct status type
    const updatedMedicine = { 
      ...medicineToEdit,
      quantity,
      // Update status based on quantity - ensuring correct MedicineStatus type
      status: updateMedicineStatus(medicineToEdit, quantity)
    };
    
    updateMedicine(updatedMedicine);
    
    toast({
      title: "Medicamento atualizado",
      description: `${medicineToEdit.name} atualizado com sucesso.`,
    });
  };

  // Helper function to determine medicine status
  const updateMedicineStatus = (medicine: Medicine, quantity: number): MedicineStatus => {
    // Check expiration
    const today = new Date();
    const expirationDate = new Date(medicine.expirationDate);
    
    if (expirationDate < today) {
      return "expired";
    }
    
    if (quantity === 0) {
      return "critical";
    } else if (quantity < medicine.minQuantity) {
      return "low";
    } else {
      return "available";
    }
  };

  // Function to add a new medicine
  const addMedicine = (medicine: Omit<Medicine, "id">) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: uuidv4(),
      status: updateMedicineStatus(medicine as Medicine, medicine.quantity)
    };
    
    addMedicineToContext(newMedicine);
    
    toast({
      title: "Medicamento adicionado",
      description: `${newMedicine.name} adicionado com sucesso.`,
    });
  };

  // Function to delete a medicine
  const deleteMedicine = (medicineId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem excluir medicamentos.",
        variant: "destructive",
      });
      return;
    }
    
    const filteredMedicines = medicines.filter(med => med.id !== medicineId);
    setMedicines(filteredMedicines);
    localStorage.setItem("medcontrol_medicines", JSON.stringify(filteredMedicines));
    
    toast({
      title: "Medicamento excluído",
      description: "Medicamento excluído com sucesso.",
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    selectedLocation,
    setSelectedLocation,
    selectedLocations,
    setSelectedLocations,
    categories,
    locations,
    selectedLocationName,
    filteredMedicines,
    medicines,
    isAdmin,
    handleEditMedicine,
    addMedicine,
    deleteMedicine,
  };
}
