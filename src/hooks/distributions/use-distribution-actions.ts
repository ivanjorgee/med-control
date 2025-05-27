
import { Medicine, DistributionRecord } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicines } from "@/contexts/MedicineContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

type SetDistributionsFunction = React.Dispatch<React.SetStateAction<DistributionRecord[]>>;
type SetPendingRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export function useDistributionActions(
  distributions: DistributionRecord[],
  setDistributions: SetDistributionsFunction,
  pendingRequests: any[],
  setPendingRequests: SetPendingRequestsFunction
) {
  const { medicines, updateMedicine } = useMedicines();
  const { authUser, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Function to create a new distribution
  const handleCreateDistribution = (distributionData: any) => {
    const { medicineId, quantity, destinationLocationId } = distributionData;
    
    // Find the medicine and destination location
    const medicine = medicines.find(med => med.id === medicineId);
    const destinationLocation = { id: destinationLocationId, name: "" }; // Will be populated in the page component
    
    if (!medicine || !destinationLocation) {
      toast({
        title: "Erro",
        description: "Medicamento ou unidade de destino não encontrados.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if there's enough quantity
    if (medicine.quantity < quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Quantidade disponível: ${medicine.quantity} ${medicine.measureUnit}`,
        variant: "destructive"
      });
      return;
    }
    
    // Create the distribution record
    const newDistribution: DistributionRecord = {
      id: uuidv4(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      batchNumber: medicine.batchNumber,
      quantity: quantity,
      sourceLocation: "Farmácia Central",
      destinationLocation: destinationLocation.name,
      requestedBy: authUser?.name || "Sistema",
      approvedBy: isAdmin ? (authUser?.name || "Administrador") : "",
      date: new Date().toISOString(),
      status: isAdmin ? "approved" : "pending",
      locationId: medicine.locationId
    };
    
    // Add to distributions
    setDistributions(prev => [newDistribution, ...prev]);
    
    // If admin, update medicine quantity immediately
    if (isAdmin) {
      const updatedMedicine = {
        ...medicine,
        quantity: medicine.quantity - quantity
      };
      updateMedicine(updatedMedicine);
    }
    
    toast({
      title: "Distribuição criada",
      description: `Distribuição de ${quantity} ${medicine.measureUnit} de ${medicine.name} para ${destinationLocation.name} foi registrada.`
    });
    
    return true;
  };
  
  // Function to handle distribution approval
  const handleApproveDistribution = (distributionId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem aprovar distribuições.",
        variant: "destructive"
      });
      return;
    }
    
    setDistributions(prev => prev.map(dist => {
      if (dist.id === distributionId) {
        // Find the medicine to update quantity
        const medicine = medicines.find(med => med.id === dist.medicineId);
        if (medicine && medicine.quantity >= dist.quantity) {
          // Update medicine quantity
          const updatedMedicine = {
            ...medicine,
            quantity: medicine.quantity - dist.quantity
          };
          updateMedicine(updatedMedicine);
          
          return {
            ...dist,
            status: "approved",
            approvedBy: authUser?.name || "Administrador"
          };
        } else {
          toast({
            title: "Estoque insuficiente",
            description: "Não há quantidade suficiente para aprovar esta distribuição.",
            variant: "destructive"
          });
          return dist;
        }
      }
      return dist;
    }));
    
    toast({
      title: "Distribuição aprovada",
      description: "A distribuição foi aprovada com sucesso."
    });
  };
  
  // Function to handle distribution delivery confirmation
  const handleDeliverDistribution = (distributionId: string) => {
    setDistributions(prev => prev.map(dist => {
      if (dist.id === distributionId) {
        return {
          ...dist,
          status: "delivered"
        };
      }
      return dist;
    }));
    
    toast({
      title: "Entrega confirmada",
      description: "A entrega da distribuição foi confirmada com sucesso."
    });
  };
  
  // Function to handle request approval and conversion to distribution
  const handleApproveRequest = (requestId: string) => {
    // Find the request
    const request = pendingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Create a distribution from the request
    const newDistribution: DistributionRecord = {
      id: uuidv4(),
      medicineId: medicines.find(m => m.name === request.medicationName)?.id || "",
      medicineName: request.medicationName,
      batchNumber: "Auto",
      quantity: Number(request.quantity),
      sourceLocation: "Farmácia Central",
      destinationLocation: request.unitName || "Unidade Solicitante",
      requestedBy: request.requesterName,
      approvedBy: authUser?.name || "Administrador",
      date: new Date().toISOString(),
      status: "approved",
      locationId: authUser?.locationId || ""
    };
    
    // Add to distributions
    setDistributions(prev => [newDistribution, ...prev]);
    
    // Remove from pending requests
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    localStorage.setItem('medcontrol_medication_requests', JSON.stringify(
      pendingRequests.filter(req => req.id !== requestId)
    ));
    
    toast({
      title: "Solicitação aprovada",
      description: `Solicitação de ${request.medicationName} foi aprovada e convertida em distribuição.`
    });
  };

  return {
    handleCreateDistribution,
    handleApproveDistribution,
    handleDeliverDistribution,
    handleApproveRequest
  };
}
