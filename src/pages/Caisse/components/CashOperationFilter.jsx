import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { fr } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  HStack,
  NumberInput,
  NumberInputField,
  Button,
  // Button,
} from "@chakra-ui/react";

import { useCashOperation } from "./CashOperationZone"; 

function CashOperationFilter() {
  const { filters, setFilter, sortOrder, toggleSortOrder} = useCashOperation();

  // État local pour gérer la plage de dates
  const [dateRange, setDateRange] = useState([
    {
      startDate: filters.period?.from ? new Date(filters.period.from) : new Date(),
      endDate: filters.period?.to ? new Date(filters.period.to) : addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const handleDateRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]); // Met à jour l'état local
    setFilter("period", { from: startDate.toISOString().split("T")[0], to: endDate.toISOString().split("T")[0] });
  };

  const handleTypeChange = (e) => {
    setFilter("type", e.target.value);
  };

  const handleMinAmountChange = (value) => {
    setFilter("minAmount", value);
  };

//   const handleSearchChange = (e) => {
//     updateSearchTerm(e.target.value);
//   };

  return (
    <HStack spacing={4} align="stretch" flexWrap="nowrap" justifyContent="space-between" w="auto">
      {/* Filtrer par type */}
      <FormControl>
        <FormLabel>Type</FormLabel>
        <Select w={200} value={filters.type || ""} onChange={handleTypeChange} placeholder="Sélectionner un type">
          <option value="income">Entrée</option>
          <option value="expense">Sortie</option>
        </Select>
      </FormControl>

      {/* Filtrer par montant minimum */}
      <FormControl>
        <FormLabel>Montant minimum</FormLabel>
        <NumberInput
          value={filters.minAmount || ""}
          onChange={handleMinAmountChange}
          min={0}
          precision={2}
          step={0.01}
          w={200}
        >
          <NumberInputField placeholder="Montant minimum" />
        </NumberInput>
      </FormControl>

      {/* Recherche
      <FormControl>
        <FormLabel>Recherche</FormLabel>
        <Input
          type="text"
          placeholder="Rechercher dans la description ou le montant"
          value={filters.searchTerm || ""}
          onChange={handleSearchChange}
        />
      </FormControl> */}

      {/* Sélecteur de période */}
      <FormControl>
        <FormLabel>Période</FormLabel>
        <Popover>
          <PopoverTrigger>
            <Input
              readOnly
              value={`De ${dateRange[0].startDate.toISOString().split("T")[0]} à ${
                dateRange[0].endDate.toISOString().split("T")[0]
              }`}
              placeholder="Sélectionner une plage de dates"
              cursor="pointer"
            />
          </PopoverTrigger>
          <PopoverContent w="auto" maxW="100vw">
            <PopoverCloseButton />
            <PopoverBody p={4} display="flex" justifyContent="center">
              <DateRangePicker
                ranges={dateRange}
                onChange={handleDateRangeChange}
                locale={fr}
                rangeColors={["#4A90E2"]}
                dateDisplayFormat="yyyy-MM-dd"
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormControl>
      <FormLabel>Trier par montant</FormLabel>
      <Button w="auto" colorScheme="blue" onClick={toggleSortOrder} mb={4}>
       ({sortOrder === "asc" ? "Croissant" : "Décroissant"})
      </Button> 
      </FormControl>

      {/* Affichage de l'état du processus
      {processState.loading && <div>Chargement...</div>}
      {processState.success && <div style={{ color: "green" }}>{processState.success}</div>}
      {processState.error && <div style={{ color: "red" }}>{processState.error}</div>} */}
    </HStack>
  );
}

export default CashOperationFilter;
