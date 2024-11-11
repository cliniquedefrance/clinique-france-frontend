/* eslint-disable consistent-return */
import React, { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle,  Button, HStack, IconButton, Input, List, ListItem, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { LuRefreshCcw } from 'react-icons/lu';
import { ChevronDownIcon } from '@chakra-ui/icons';



const VenteContext = createContext(null);



// Fonction pour mettre en gras les caractères recherchés
const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <strong key={index}>{part}</strong> : part
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

function VenteZone({ r,api, user, onPrintFacture, children }) {
  const [ventes, setVentes] = useState([]);
  const [ordonnances, setOrdonnances] = useState([]);
  const [montures, setMontures] = useState([]);
  const [filteredVentes, setFilteredVentes] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [sortKey, setSortKey] = useState('dateVente'); // Default sort by date
  const [process, setProcess] = useState({ error: null, success: null, loading: false });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const loadVentes = async () => {
    try {
      setProcess({ ...process, loading: true });
      const data = await api.getVentes(); 
      setVentes(data); 
      setProcess({ error: null, success: 'Ventes chargées avec succès', loading: false });
    } catch (error) {
      setProcess({ error: 'Erreur lors du chargement des Ventes', success: null, loading: false });
    }
  };

  const loadOrdonnances = async () => {
    try {
      setProcess({ ...process, loading: true });
      const data = await api.getOrdonnances(); 
      setOrdonnances(data); 
      setProcess({ error: null, success: 'Ordonnances chargées avec succès', loading: false });
    } catch (error) {
      setProcess({ error: 'Erreur lors du chargement des Ordonnances', success: null, loading: false });
    }
  };

  const loadMontures = async () => {
    try {
      setProcess({ ...process, loading: true });
      const data = await api.getMontures(); 
      setMontures(data); 
      setProcess({ error: null, success: 'Montures chargées avec succès', loading: false });
    } catch (error) {
      setProcess({ error: 'Erreur lors du chargement des montures', success: null, loading: false });
    }
  };

  // Charger les ventes, ordonnances et montures au montage du composant
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

  // Appliquer les filtres et le tri sur les ventes
  const applyFiltersAndSorting = useCallback(() => {
    let result = [...ventes];
    
    // Filtrage
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(
        (vente) =>
          (vente.client?.name && vente.client.name.toLowerCase().includes(search)) || (vente.clientNonEnregistre?.nom && vente.clientNonEnregistre?.nom.toLowerCase().includes(search)) ||
          (vente.articles.some(article => 
            article.monture.brand.toLowerCase().includes(search) ||
            article.monture.model.toLowerCase().includes(search)
          ))
      );
    }

    // Tri
    result.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
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


  const value = useMemo(() => ({
    ventes:paginatedVentes, // Utilisé dans VenteList pour afficher la liste complète
    filteredVentes, // Utilisé pour afficher les résultats filtrés et triés dans VenteList
    ordonnances, // Utilisé dans SearchOrdonnance
    montures, // Utilisé dans SearchMonture et VenteForm
    filters, // Utilisé dans VenteFilter pour appliquer les filtres
    setFilters, // Utilisé dans VenteFilter pour modifier les filtres appliqués
    sortKey, // Utilisé dans VenteSorter pour trier par une clé donnée
    setSortKey, // Utilisé dans VenteSorter pour définir la clé de tri
    sortOrder, // Utilisé dans VenteOrder pour ordonner croissant/décroissant
    setSortOrder, // Utilisé dans VenteOrder pour modifier l'ordre de tri
    onPrintFacture, // Utilisé dans VenteList pour imprimer une facture spécifique
    user, // Utilisé dans VenteForm pour des actions spécifiques à l'utilisateur
    api, // Utilisé pour les appels API dans VenteCreatorButton et VenteList
    refresh, // pour actualiser
    process, // le process
    setProcess,
    setCurrentPage,
    setItemsPerPage,
    itemsPerPage,
    totalVentes: filteredVentes.length
  }), [ventes, filteredVentes, ordonnances, montures, filters, sortKey, sortOrder, onPrintFacture, process, user, api]);

  return (
    <VenteContext.Provider value={value}>
      <VenteState  process={process} setProcess={setProcess} retryFunction={refresh} />
      {children}
      
    </VenteContext.Provider>
  );
}




// VenteSearch pour la recherche
function VenteSearch() {
    const { filters, setFilters } = useContext(VenteContext);
  
    const handleSearchChange = (e) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerm: e.target.value,
      }));
    };
  
    return (
      <Input
        placeholder="Rechercher une vente par nom de patient, marque ou modèle de monture"
        value={filters.searchTerm || ''}
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

  function VenteFilter() {
    const { filters, setFilters } = useContext(VenteContext);
  
    const handleStatusChange = (e) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: e.target.value,
      }));
    };
  
    const handleClientTypeChange = (e) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        clientType: e.target.value,
      }));
    };
  
    const handleDateChange = (e) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        saleDate: e.target.value,
      }));
    };
  
    return (
      <HStack mb={4} >
        <Select placeholder="Statut de paiement" onChange={handleStatusChange} value={filters.status || ''}>
          <option value="payé">Payé</option>
          <option value="partiel">Partiel</option>
          <option value="impayé">Impayé</option>
        </Select>
        
        <Select placeholder="Type de client" onChange={handleClientTypeChange} value={filters.clientType || ''} >
          <option value="patient">Patient enregistré</option>
          <option value="nonEnregistre">Client non enregistré</option>
        </Select>
  
        <Input
          type="date"
          placeholder="Date de vente"
          onChange={handleDateChange}
          value={filters.saleDate || ''}
          
        />
      </HStack>
    );
  }
  

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
      <Button onClick={toggleOrder} variant="outline" >
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
  function VenteList({actions}) {
    const {  ventes,  searchTerm, filters } = useContext(VenteContext);
  
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
              <Td>{new Date(vente.dateVente).toLocaleDateString()} </Td>
              <Td>{highlightSearchTerm(vente.clientNonEnregistre ? vente.clientNonEnregistre.nom : vente.client.name, filters.searchTerm)}</Td>
              <Td>{highlightSearchTerm(vente.montantTotal, filters.searchTerm)}</Td>
              <Td>{highlightSearchTerm(vente.statutPaiement, searchTerm)}</Td>
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
  
    const totalPages = Math.ceil(totalVentes / itemsPerPage);
  
    const [show, setShow] = useState(true)
  
    useEffect(()=>{
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
      if (totalVentes <= itemsPerPage) {
        setShow(false);
      }else{
        setShow(true)
      }
  
    },[totalVentes])
  
    return (
      show && <div>
        <Button onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>
          Précédent
        </Button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <Button onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === totalPages}>
          Suivant
        </Button>
      </div>
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
    VenteFilter, 
    VenteSorter , 
    VenteOrder,
    VenteRefresh,
    VenteList,
    VentePagination,
    VenteNumber,
};
