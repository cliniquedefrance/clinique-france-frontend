/* eslint-disable consistent-return */
import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle,  Button,   IconButton, Input, List, ListItem, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
import { LuRefreshCcw } from 'react-icons/lu';
import { ChevronDownIcon } from '@chakra-ui/icons';



const VenteContext = createContext(null);



// Fonction pour mettre en gras les caractères recherchés
const highlightSearchTerm = (text ='', term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text?.split(regex).map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <strong style={{color:'green'}} key={index}>{part}</strong> : part
    );
  };

  // Composant MontureState pour gérer les états (error, success, loading)
function VenteState({ process, retryFunction, setProcess }) {
    const { error, success, loading } = process;
  
    useEffect(() => {
      if (success && setProcess) {
        const timer = setTimeout(() => {
          setProcess(prev => ({...prev, success:null}))
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [success, process]);
  
    return (
      <div>
        {loading && <Spinner />}
        {error && (
          <Alert status="error" variant="left-accent" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Erreur!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={retryFunction} ml={4} colorScheme="red">
              Réessayer
            </Button>
          </Alert>
        )}
        {success && (
          <Alert status="success" variant="left-accent" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Succès!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }



  function VenteZone({ r, api, user, onPrintFacture, children, inOtherPage = false }) {
    const [ventes, setVentes] = useState([]);
    const [ordonnances, setOrdonnances] = useState([]);
    const [montures, setMontures] = useState([]);
    const [filteredVentes, setFilteredVentes] = useState([]);
    const [filters, setFilters] = useState({
      searchTerm: "",
      status: "",
      clientType: "",
      saleDate: "",
      dateRange: { startDate: "", endDate: "" }, // Ajout pour le filtrage par période
    });
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortKey, setSortKey] = useState("dateVente");
    const [process, setProcess] = useState({ error: null, success: null, loading: false });
  
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
  
    // Chargement des ventes, ordonnances et montures
    const loadVentes = async () => {
      try {
        setProcess({ ...process, loading: true });
        const data = await api.getVentes();
        setVentes(data);
        setProcess({ error: null, success: "Ventes chargées avec succès", loading: false });
      } catch (error) {
        setProcess({ error: "Erreur lors du chargement des Ventes", success: null, loading: false });
      }
    };
  
    const loadOrdonnances = async () => {
      try {
        const data = await api.getOrdonnances();
        setOrdonnances(data);
      } catch (error) {
        setProcess({ error: "Erreur lors du chargement des Ordonnances", success: null, loading: false });
      }
    };
  
    const loadMontures = async () => {
      try {
        const data = await api.getMontures();
        setMontures(data);
      } catch (error) {
        setProcess({ error: "Erreur lors du chargement des Montures", success: null, loading: false });
      }
    };
  
    useEffect(() => {
      loadVentes();
      loadOrdonnances();
      loadMontures();
    }, [r]);
  
    const refresh = () => {
      loadVentes();
      loadOrdonnances();
      loadMontures();
    };
  
    // Fonction d'application des filtres et du tri
    const applyFiltersAndSorting = useCallback(() => {
      let result = [...ventes];
  
      // Filtrage par recherche
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        result = result.filter((vente) => {
          const clientName = vente.client?.name?.toLowerCase() || "";
          const clientNonEnregistreName = vente.clientNonEnregistre?.nom?.toLowerCase() || "";
  
          const articleMatch = vente.articles.some((article) => {
            const brand = article.monture?.brand?.toLowerCase() || "";
            const model = article.monture?.model?.toLowerCase() || "";
            return brand.includes(search) || model.includes(search);
          });
  
          return clientName.includes(search) || clientNonEnregistreName.includes(search) || articleMatch;
        });
      }
  
      // Filtrage par statut de paiement
      if (filters.status) {
        result = result.filter((vente) => vente.statutPaiement === filters.status);
      }
  
      // Filtrage par type de client
      if (filters.clientType) {
        if (filters.clientType === "patient") {
          result = result.filter((vente) => vente.client?._id);
        } else if (filters.clientType === "nonEnregistre") {
          result = result.filter((vente) => vente.clientNonEnregistre?.nom);
        }
      }
  
      // Filtrage par date de vente exacte
      if (filters.saleDate) {
        
        result = result.filter((vente) => {
          const venteDate = vente.dateVente.split("T")[0]; // Récupérer uniquement la partie "YYYY-MM-DD"
     return venteDate === filters.saleDate;

        });
      }
  
      // Filtrage par période (dateRange)
      const { startDate, endDate } = filters.dateRange;
      if (startDate || endDate) {
        result = result.filter((vente) => {
          const venteDate = new Date(vente.dateVente);
          if (startDate && venteDate < new Date(startDate)) return false;
          if (endDate && venteDate > new Date(endDate)) return false;
          return true;
        });
      }
  
      // Tri
      result.sort((a, b) => {
        const aValue = a[sortKey] ?? "";
        const bValue = b[sortKey] ?? "";
  
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
  
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
  
      setFilteredVentes(result);
    }, [ventes, filters, sortKey, sortOrder]);
  
    // Pagination
    const paginatedVentes = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredVentes.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredVentes, currentPage, itemsPerPage]);
  
    useEffect(() => {
      applyFiltersAndSorting();
    }, [filters, sortKey, sortOrder, ventes, applyFiltersAndSorting]);
  
    const value = useMemo(
      () => ({
        ventes: paginatedVentes,
        filteredVentes,
        ordonnances,
        montures,
        filters,
        setFilters,
        sortKey,
        setSortKey,
        sortOrder,
        setSortOrder,
        onPrintFacture,
        user,
        api,
        refresh,
        process,
        setProcess,
        setCurrentPage,
        setItemsPerPage,
        itemsPerPage,
        totalVentes: filteredVentes.length,
        inOtherPage,
        currentPage,
      }),
      [
        paginatedVentes,
        filteredVentes,
        ordonnances,
        montures,
        filters,
        sortKey,
        sortOrder,
        onPrintFacture,
        process,
        user,
        api,
        currentPage,
        itemsPerPage,
      ]
    );
  
    return (
      <VenteContext.Provider value={value}>
        {!inOtherPage && <VenteState process={process} setProcess={setProcess} retryFunction={refresh} />}
        {children}
      </VenteContext.Provider>
    );
  }
  
  



// VenteSearch pour la recherche
function VenteSearch() {
  const { filters, setFilters } = useContext(VenteContext);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;

    setFilters((prevFilters) => ({
      ...prevFilters,
      searchTerm,
    }));
  };

  // Utiliser useEffect pour voir les changements dans filters
  useEffect(() => {
    console.log("Recherche mise à jour :", filters.searchTerm);
  }, [filters.searchTerm]);

  return (
    <Input
      placeholder="Rechercher une vente par nom de patient, marque ou modèle de monture"
      value={filters.searchTerm || ""}
      onChange={handleSearchChange}
      variant="outline"
      mb={4}
    />
  );
}



  // va pour SearchOrdonnance 
  function SearchOrdonnance({ isOpen, onClose, onSelect }) {
    const { ordonnances } = useContext(VenteContext);
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredOrdonnances = useMemo(() => ordonnances
        .filter((ordonnance) => {
          const fullName = `${ordonnance.patient?.name} ${ordonnance.patient?.surname}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)), [ordonnances, searchTerm]);
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rechercher une ordonnance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nom ou prénom du patient"
              value={searchTerm}
              onChange={handleSearchChange}
              mb={4}
            />
            <List spacing={3}>
              {filteredOrdonnances.map((ordonnance) => (
                <ListItem
                  key={ordonnance._id}
                  onClick={() => onSelect(ordonnance)}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Text fontWeight="bold">
                    {ordonnance.patient?.name} {ordonnance.patient?.surname}
                  </Text>
                  <Text fontSize="sm">
                    Dernière mise à jour : {new Date(ordonnance.updatedAt).toLocaleDateString()}
                  </Text>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }


  // Bon en ce qui concerne SearchMonture
  function SearchMonture({ isOpen, onClose, onSelect }) {
    const { montures } = useContext(VenteContext);
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredMontures = useMemo(() => montures.filter((monture) =>
        `${monture.brand} ${monture.model}`.toLowerCase().includes(searchTerm.toLowerCase())
      ), [montures, searchTerm]);
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rechercher une monture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Marque ou modèle de monture"
              value={searchTerm}
              onChange={handleSearchChange}
              mb={4}
            />
            <List spacing={3}>
              {filteredMontures.map((monture) => (
                <ListItem
                  key={`${monture.brand}-${monture.model}`}
                  onClick={() => onSelect(monture)}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Text fontWeight="bold">{monture.brand}</Text>
                  <Text fontSize="sm">{monture.model}</Text>
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }


  // VenteFilter 

  // function VenteFilter({ showUniqueDatePicker = false, showClientType = false }) {
  //   const { filters, setFilters } = useContext(VenteContext);
  
  //   const handleStatusChange = (e) => {
  //     const status = e.target.value;
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       status,
  //     }));
  //   };
  
  //   const handleClientTypeChange = (e) => {
  //     const clientType = e.target.value;
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       clientType,
  //     }));
  //   };
  
  //   const handleDateChange = (e) => {
  //     const saleDate = e.target.value;
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       saleDate,
  //     }));
  //   };
  
  //   const handleDateRangeChange = (key, value) => {
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       dateRange: {
  //         ...prevFilters.dateRange,
  //         [key]: value,
  //       },
  //     }));
  //   };
  
  //   return (
  //     <Wrap
  //       spacing={4}
  //       align="center"
  //       justify="space-between"
  //       w="100%"
  //       p={4}
  //       bg="gray.50"
  //       borderRadius="md"
  //       boxShadow="sm"
  //     >
  //       {/* Filtrer par statut */}
  //       <FormControl w={{ base: "100%", md: "auto" }} flex="1">
  //         <FormLabel>Statut de paiement</FormLabel>
  //         <Select
  //           placeholder="Sélectionner un statut"
  //           onChange={handleStatusChange}
  //           value={filters.status || ""}
  //         >
  //           <option value="payé">Payé</option>
  //           <option value="partiel">Partiel</option>
  //           <option value="impayé">Impayé</option>
  //         </Select>
  //       </FormControl>
  
  //       {/* Filtrer par type de client */}
  //       {showClientType && (
  //         <FormControl w={{ base: "100%", md: "auto" }} flex="1">
  //           <FormLabel>Type de client</FormLabel>
  //           <Select
  //             placeholder="Sélectionner un type de client"
  //             onChange={handleClientTypeChange}
  //             value={filters.clientType || ""}
  //           >
  //             <option value="patient">Patient enregistré</option>
  //             <option value="nonEnregistre">Client non enregistré</option>
  //           </Select>
  //         </FormControl>
  //       )}
  
  //       {/* Filtrer par date exacte */}
  //       {showUniqueDatePicker && (
  //         <FormControl w={{ base: "100%", md: "auto" }} flex="1">
  //           <FormLabel>Date de vente exacte</FormLabel>
  //           <Input
  //             type="date"
  //             onChange={handleDateChange}
  //             value={filters.saleDate || ""}
  //           />
  //         </FormControl>
  //       )}
  
  //       {/* Filtrer par période */}
  //       <FormControl w={{ base: "100%", md: "auto" }} flex="1">
  //         <FormLabel>Date de début</FormLabel>
  //         <Input
  //           type="date"
  //           onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
  //           value={filters.dateRange?.startDate || ""}
  //         />
  //       </FormControl>
  //       <FormControl w={{ base: "100%", md: "auto" }} flex="1">
  //         <FormLabel>Date de fin</FormLabel>
  //         <Input
  //           type="date"
  //           onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
  //           value={filters.dateRange?.endDate || ""}
  //         />
  //       </FormControl>
  //     </Wrap>
  //   );
  // }
  
  
  
  
  

  function VenteSorter() {
    const { sortBy, setSortBy } = useContext(VenteContext);
  
    const handleSortChange = (e) => {
      setSortBy(e.target.value);
    };
  
    return (
      <Select placeholder="Trier par" onChange={handleSortChange} value={sortBy} mb={4}>
        <option value="dateVente">Date de vente</option>
        <option value="montantTotal">Montant total</option>
        <option value="clientName">Nom du client</option>
      </Select>
    );
  }
  
  // Vente Order
  
  function VenteOrder() {
    const { sortOrder, setSortOrder} = useContext(VenteContext);
  
    const toggleOrder = () => {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };
  
    return (
      <Button  onClick={toggleOrder} variant="outline" >
        {sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
      </Button>
    );
  }

  // Composant VenteRefresh qui fait le rafraichissement
function VenteRefresh() {
    const { refresh } = useContext(VenteContext);
    return <IconButton onClick={refresh} aria-label='Actualiser'>
      <LuRefreshCcw />
    </IconButton>
  }
  

  // ok ajoutons venteList comme gpt est bète là
  function VenteList({ actions }) {
    const { ventes, filters } = useContext(VenteContext);
  
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Client</Th>
            <Th>Montant Total</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ventes.map((vente) => (
            <Tr key={vente._id}>
              <Td>{new Date(vente.dateVente).toLocaleDateString()}</Td>
              <Td>
                {highlightSearchTerm(
                  vente.clientNonEnregistre?.nom
                    ? vente.clientNonEnregistre.nom
                    : vente.client.name,
                  filters.searchTerm || ''
                )}
              </Td>
              <Td>{vente.montantTotal}</Td>
              <Td>{vente.statutPaiement}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
                  <MenuList>
                    {actions.map((action, index) => (
                      <MenuItem key={index} onClick={() => action.action(vente)}>
                        {action.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }
  

  


  function VentePagination() {
    const { currentPage, setCurrentPage, totalVentes, itemsPerPage } = useContext(VenteContext);
  
    // Calculer le nombre total de pages
    const totalPages = Math.max(Math.ceil(totalVentes / itemsPerPage), 1);
  
    // Mettre à jour la page courante si elle dépasse le nombre total de pages
    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }, [currentPage, totalPages, setCurrentPage]);
  
    // Désactiver les boutons si la pagination n'est pas nécessaire
    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages || totalVentes === 0;
  
    return (
      totalVentes > itemsPerPage && (
        <div>
          <Button onClick={() => setCurrentPage(currentPage - 1)} isDisabled={isPrevDisabled}>
            Précédent
          </Button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <Button onClick={() => setCurrentPage(currentPage + 1)} isDisabled={isNextDisabled}>
            Suivant
          </Button>
        </div>
      )
    );
  }
  

  // Composant VenteNumber qui affiche le nombre de montures affichées
function VenteNumber() {
  const { totalVentes } = useContext(VenteContext);
  return <div>{totalVentes} ventes trouvées</div>;
}

export { 
    VenteZone, 
    VenteContext,
    VenteState,
    VenteSearch , 
    SearchOrdonnance, 
    SearchMonture, 
    // VenteFilter, 
    VenteSorter , 
    VenteOrder,
    VenteRefresh,
    VenteList,
    VentePagination,
    VenteNumber,
};
