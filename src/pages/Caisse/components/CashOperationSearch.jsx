import React from 'react';
import { Input,} from '@chakra-ui/react';
import { useCashOperation } from './CashOperationZone';


function CashOperationSearch() {
  const { searchTerm, updateSearchTerm } = useCashOperation();

  const handleSearchChange = (e) => {
    updateSearchTerm(e.target.value);
  };

  return (
    <Input
    placeholder="Rechercher une opération par description, montant"
    value={searchTerm || ""}
    onChange={handleSearchChange}
    variant="outline"
    mb={4}
  />
  );
}

export default CashOperationSearch;
