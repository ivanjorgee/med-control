
import { MainLayout } from "@/layouts/MainLayout";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DistributionHeader } from "@/components/distribution/DistributionHeader";
import { DistributionFilters } from "@/components/distribution/DistributionFilters";
import { DistributionTable } from "@/components/distribution/DistributionTable";
import { DistributionForm } from "@/components/distribution/DistributionForm";
import { useMedicines } from "@/contexts/MedicineContext";
import { useLocations } from "@/hooks/use-locations";
import { useDistributions } from "@/hooks/use-distributions";

const DistributionPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { medicines } = useMedicines();
  const { locations } = useLocations();
  const { isAdmin } = useAuth();
  
  const {
    distributions,
    pendingRequests,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleCreateDistribution,
    handleApproveDistribution,
    handleDeliverDistribution,
    handleApproveRequest
  } = useDistributions();
  
  const handleCreateDistributionWithLocation = (distributionData: any) => {
    const { destinationLocationId } = distributionData;
    
    // Find the destination location name
    const destinationLocation = locations.find(loc => loc.id === destinationLocationId);
    if (!destinationLocation) return;
    
    // Create the distribution with the location name
    const success = handleCreateDistribution({
      ...distributionData,
      destinationLocation: destinationLocation.name
    });
    
    if (success) {
      setIsDialogOpen(false);
    }
  };
  
  return (
    <MainLayout>
      <DistributionHeader 
        onAddClick={() => setIsDialogOpen(true)} 
      />
      
      <DistributionFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <DistributionTable 
        distributions={distributions}
        onApprove={handleApproveDistribution}
        onDeliver={handleDeliverDistribution}
        isAdmin={isAdmin}
        pendingRequests={pendingRequests}
        onApproveRequest={handleApproveRequest}
      />
      
      <DistributionForm 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen}
        onCreateDistribution={handleCreateDistributionWithLocation}
        medicines={medicines}
        locations={locations}
      />
    </MainLayout>
  );
};

export default DistributionPage;
