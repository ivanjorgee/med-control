
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useStock } from "@/hooks/use-stock";
import { StockHeader } from "@/components/stock/StockHeader";
import { StockFilters } from "@/components/stock/StockFilters";
import { StockTable } from "@/components/stock/StockTable";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const StockPage = () => {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('locationId');
  
  const {
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
    isAdmin,
    handleEditMedicine,
    deleteMedicine
  } = useStock();
  
  // Sincronizar selectedLocations com locationId do URL
  useEffect(() => {
    if (locationId) {
      setSelectedLocations([locationId]);
      setSelectedLocation(locationId);
    }
  }, [locationId, setSelectedLocations, setSelectedLocation]);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <StockHeader selectedLocationName={selectedLocationName} />

        <StockFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          categories={categories}
          locations={locations}
        />

        <Card>
          <CardContent className="p-0">
            <StockTable 
              medicines={filteredMedicines} 
              isAdmin={isAdmin} 
              onEdit={handleEditMedicine}
              onDelete={deleteMedicine}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StockPage;
