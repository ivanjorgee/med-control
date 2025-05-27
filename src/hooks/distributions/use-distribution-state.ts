
import { useState, useEffect } from "react";
import { DistributionRecord } from "@/types";

export function useDistributionState() {
  const [distributions, setDistributions] = useState<DistributionRecord[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Load saved distributions from localStorage
  useEffect(() => {
    const savedDistributions = localStorage.getItem('medcontrol_distributions');
    if (savedDistributions) {
      setDistributions(JSON.parse(savedDistributions));
    }
    
    // Load pending medication requests
    const savedRequests = localStorage.getItem('medcontrol_medication_requests');
    if (savedRequests) {
      setPendingRequests(JSON.parse(savedRequests));
    }
  }, []);
  
  // Save distributions to localStorage whenever it changes
  useEffect(() => {
    if (distributions.length > 0) {
      localStorage.setItem('medcontrol_distributions', JSON.stringify(distributions));
    }
  }, [distributions]);

  const filteredDistributions = distributions.filter((distribution) => {
    const matchesSearch = 
      distribution.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      distribution.destinationLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distribution.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || distribution.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return {
    distributions,
    setDistributions,
    pendingRequests, 
    setPendingRequests,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredDistributions
  };
}
