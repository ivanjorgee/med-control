
import { useDistributionState } from "./use-distribution-state";
import { useDistributionActions } from "./use-distribution-actions";

export function useDistributions() {
  const {
    distributions,
    setDistributions,
    pendingRequests,
    setPendingRequests,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredDistributions
  } = useDistributionState();
  
  const {
    handleCreateDistribution,
    handleApproveDistribution,
    handleDeliverDistribution,
    handleApproveRequest
  } = useDistributionActions(distributions, setDistributions, pendingRequests, setPendingRequests);
  
  return {
    distributions: filteredDistributions,
    pendingRequests,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleCreateDistribution,
    handleApproveDistribution,
    handleDeliverDistribution,
    handleApproveRequest
  };
}
