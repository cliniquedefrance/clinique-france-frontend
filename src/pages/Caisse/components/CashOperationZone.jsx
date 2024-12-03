import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import CashOperationState from "./CashOperationState";

const CashOperationContext = createContext();

export const useCashOperation = () => useContext(CashOperationContext);

function CashOperationZone({ api, r, children }) {
  const [operations, setOperations] = useState([]);
  const [filters, setFilters] = useState({
    period: { from: null, to: null },
    type: null, // "income" or "expense"
    minAmount: null,
  });
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [searchTerm, setSearchTerm] = useState("");
  const [processState, setProcessState] = useState({
    loading: false,
    success: null,
    error: null,
  });

  // Fetch all operations
  const fetchOperations = useCallback(async () => {
    setProcessState({ loading: true, success: null, error: null });
    try {
      const data = await api.getAll();
      setOperations(data);
      setProcessState({ loading: false, success: "Données chargées avec succès.", error: null });
    } catch (error) {
      setProcessState({ loading: false, success: null, error: "Erreur lors du chargement des données." });
    }
  }, [api]);

  // Filtered operations based on filters, search, and sort
  const filteredOperations = useMemo(() => {
    let filtered = [...operations];

    // Filter by period
    if (filters.period.from || filters.period.to) {
      filtered = filtered.filter((op) => {
        const date = new Date(op.date);
        const from = filters.period.from ? new Date(filters.period.from) : null;
        const to = filters.period.to ? new Date(filters.period.to) : null;

        return (!from || date >= from) && (!to || date <= to);
      });
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((op) => op.type === filters.type);
    }

    // Filter by minimum amount
    if (filters.minAmount !== null) {
      filtered = filtered.filter((op) => op.amount >= filters.minAmount);
    }

    // Search in description and amount
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((op) =>{
        const description = op?.description?.toLowerCase() || "";
        const amount = op?.amount?.toString().toLowerCase() || "";
        return description.includes(term) || amount.includes(term)
      }
       
      );
    }

    // Sort by amount
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    );

    return filtered;
  }, [operations, filters, sortOrder, searchTerm]);

  // Update filters
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update sorting
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Update search term
//   const updateSearchTerm = useCallback((term) => {
//     setSearchTerm(term);
//   }, []);

  // Effect to fetch operations on mount
  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    operations: filteredOperations,
    filters,
    sortOrder,
    searchTerm,
    processState,
    totalOperations : filteredOperations.length, 
    setFilter,
    toggleSortOrder,
    updateSearchTerm : setSearchTerm,
    refreshOperations: fetchOperations,
  }), [filteredOperations, filters, sortOrder, searchTerm, processState, fetchOperations]);

  useEffect(() => {
   fetchOperations()
  }, [r]);

  return (
    <CashOperationContext.Provider value={contextValue}>
        <CashOperationState process={processState} retryFunction={fetchOperations} setProcess={setProcessState}/>
      {children}
    </CashOperationContext.Provider>
  );
}

export default CashOperationZone;
