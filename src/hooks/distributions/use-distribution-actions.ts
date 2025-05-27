
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
  const { authUser, isAdmin, isPharmacist } = useAuth();
  const { toast } = useToast();
  
  // Function to create a new distribution
  const handleCreateDistribution = (distributionData: any) => {
    const { medicineId, quantity, destinationLocationId } = distributionData;
    
    // Find the medicine and destination location
    const medicine = medicines.find(med => med.id === medicineId);
    
    if (!medicine) {
      toast({
        title: "Erro",
        description: "Medicamento não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar permissões baseadas no role
    if (isPharmacist && !isAdmin) {
      // Farmacêuticos só podem solicitar medicamentos (criar pendências)
      const newDistribution: DistributionRecord = {
        id: uuidv4(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        quantity: quantity,
        sourceLocation: "Central de Distribuição",
        destinationLocation: authUser?.locationName || "Unidade Solicitante",
        requestedBy: authUser?.name || "Farmacêutico",
        approvedBy: "",
        date: new Date().toISOString(),
        status: "pending",
        locationId: authUser?.locationId || ""
      };
      
      // Add to distributions as pending
      setDistributions(prev => [newDistribution, ...prev]);
      
      toast({
        title: "Solicitação registrada",
        description: `Solicitação de ${quantity} ${medicine.measureUnit} de ${medicine.name} foi enviada para aprovação.`
      });
      
      return true;
    }
    
    // Administradores podem distribuir diretamente
    if (isAdmin) {
      // Check if there's enough quantity
      if (medicine.quantity < quantity) {
        toast({
          title: "Estoque insuficiente",
          description: `Quantidade disponível: ${medicine.quantity} ${medicine.measureUnit}`,
          variant: "destructive"
        });
        return;
      }
      
      const newDistribution: DistributionRecord = {
        id: uuidv4(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        quantity: quantity,
        sourceLocation: "Central de Distribuição",
        destinationLocation: "Unidade de Destino",
        requestedBy: authUser?.name || "Administrador",
        approvedBy: authUser?.name || "Administrador",
        date: new Date().toISOString(),
        status: "approved",
        locationId: medicine.locationId
      };
      
      // Add to distributions
      setDistributions(prev => [newDistribution, ...prev]);
      
      // Update medicine quantity immediately
      const updatedMedicine = {
        ...medicine,
        quantity: medicine.quantity - quantity
      };
      updateMedicine(updatedMedicine);
      
      toast({
        title: "Distribuição criada",
        description: `Distribuição de ${quantity} ${medicine.measureUnit} de ${medicine.name} foi aprovada automaticamente.`
      });
      
      return true;
    }
    
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para criar distribuições.",
      variant: "destructive"
    });
    return false;
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
      if (dist.id === distributionId && dist.status === "pending") {
        // Find the medicine to update quantity
        const medicine = medicines.find(med => med.id === dist.medicineId);
        if (medicine && medicine.quantity >= dist.quantity) {
          // Update medicine quantity
          const updatedMedicine = {
            ...medicine,
            quantity: medicine.quantity - dist.quantity
          };
          updateMedicine(updatedMedicine);
          
          toast({
            title: "Distribuição aprovada",
            description: `Distribuição de ${dist.medicineName} foi aprovada e está pronta para entrega.`
          });
          
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
  };
  
  // Function to handle distribution delivery confirmation
  const handleDeliverDistribution = (distributionId: string) => {
    // Farmacêuticos podem confirmar entrega na sua unidade
    // Administradores podem confirmar qualquer entrega
    const distribution = distributions.find(d => d.id === distributionId);
    
    if (!distribution) return;
    
    // Verificar se o farmacêutico pode confirmar esta entrega
    if (isPharmacist && !isAdmin) {
      if (distribution.locationId !== authUser?.locationId) {
        toast({
          title: "Acesso negado",
          description: "Você só pode confirmar entregas da sua unidade.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setDistributions(prev => prev.map(dist => {
      if (dist.id === distributionId && dist.status === "approved") {
        toast({
          title: "Entrega confirmada",
          description: `Entrega de ${dist.medicineName} foi confirmada com sucesso.`
        });
        
        return {
          ...dist,
          status: "delivered"
        };
      }
      return dist;
    }));
  };
  
  // Function to handle request approval and conversion to distribution
  const handleApproveRequest = (requestId: string) => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem aprovar solicitações.",
        variant: "destructive"
      });
      return;
    }
    
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
      sourceLocation: "Central de Distribuição",
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
    const updatedRequests = pendingRequests.filter(req => req.id !== requestId);
    setPendingRequests(updatedRequests);
    localStorage.setItem('medcontrol_medication_requests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Solicitação aprovada",
      description: `Solicitação de ${request.medicationName} foi aprovada e está pronta para entrega.`
    });
  };

  return {
    handleCreateDistribution,
    handleApproveDistribution,
    handleDeliverDistribution,
    handleApproveRequest
  };
}
