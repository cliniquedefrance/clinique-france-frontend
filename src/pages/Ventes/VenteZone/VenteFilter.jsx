import React, { useContext, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { fr } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // CSS de base
import "react-date-range/dist/theme/default.css"; // Thème par défaut
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
} from "@chakra-ui/react";
import { VenteContext } from "./VenteComponnents";

function VenteFilter({ showUniqueDatePicker = false, showClientType = true }) {
  const { filters, setFilters } = useContext(VenteContext);

  // État local pour gérer la plage de dates
  const [dateRange, setDateRange] = useState([
    {
      startDate: filters.dateRange?.startDate
        ? new Date(filters.dateRange.startDate)
        : new Date(),
      endDate: filters.dateRange?.endDate
        ? new Date(filters.dateRange.endDate)
        : addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // Met à jour les plages de dates dans le contexte
  const handleDateRangeChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]); // Met à jour l'état local
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
    }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      status,
    }));
  };

  const handleClientTypeChange = (e) => {
    const clientType = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      clientType,
    }));
  };

  const handleDateChange = (e) => {
    const saleDate = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      saleDate,
    }));
  };

  return (
    
      <HStack
        spacing={4}
        align="stretch"
        flexWrap="nowrap"
        justifyContent="space-between"
        w='auto'
      >
        {/* Filtrer par statut */}
        <FormControl>
          <FormLabel>Statut de paiement</FormLabel>
          <Select
            placeholder="Sélectionner un statut"
            onChange={handleStatusChange}
            value={filters.status || ""}
          >
            <option value="payé">Payé</option>
            <option value="partiel">Partiel</option>
            <option value="impayé">Impayé</option>
          </Select>
        </FormControl>

        {/* Filtrer par type de client */}
        {showClientType && (
          <FormControl>
            <FormLabel>Type de client</FormLabel>
            <Select
              placeholder="Sélectionner un type de client"
              onChange={handleClientTypeChange}
              value={filters.clientType || ""}
            >
              <option value="patient">Patient enregistré</option>
              <option value="nonEnregistre">Client non enregistré</option>
            </Select>
          </FormControl>
        )}

        {/* Sélecteur de plage de dates dans un menu déroulant */}
        <FormControl>
          <FormLabel>Période</FormLabel>
          <Popover>
            <PopoverTrigger>
              <Input
                readOnly
                value={` De ${dateRange[0].startDate.toISOString().split("T")[0]} à ${
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

        {/* Filtrer par date exacte (si activé) */}
        {showUniqueDatePicker && (
          <FormControl>
            <FormLabel>Date de vente exacte</FormLabel>
            <Input
              type="date"
              onChange={handleDateChange}
              value={filters.saleDate || ""}
            />
          </FormControl>
        )}
      </HStack>

  );
}

export default VenteFilter;
