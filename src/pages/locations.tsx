
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LocationsHeader } from "@/components/locations/LocationsHeader";
import { LocationsFilter } from "@/components/locations/LocationsFilter";
import { LocationsTable } from "@/components/locations/LocationsTable";
import { useLocations } from "@/hooks/use-locations";

const LocationsPage = () => {
  const { 
    locations, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    typeFilter, 
    setTypeFilter,
    handleDelete,
    handleLocationSaved,
    locationTypeLabels
  } = useLocations();
  
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // If not admin, redirect to dashboard
  if (!isAdmin) {
    navigate("/");
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto space-y-6">
        <LocationsHeader onLocationSaved={handleLocationSaved} />
        
        <LocationsFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <Card>
          <CardContent className="p-0">
            <LocationsTable 
              locations={locations}
              isLoading={isLoading}
              onDelete={handleDelete}
              onLocationSaved={handleLocationSaved}
              locationTypeLabels={locationTypeLabels}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LocationsPage;
