import React, { useState, useEffect } from 'react';
import {
  Box, Button, Input, FormControl, FormLabel, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Text, Divider, Checkbox, Alert, AlertIcon,
  Table,
  Thead,
  Tr,
  Td,
  Tbody
} from '@chakra-ui/react';
import { SearchMonture, SearchOrdonnance } from './VenteComponnents';

function VenteForm({
  mode,
  showModal,
  inFormVente,
  inFormProcess,
  onCreate,
  onUpdate,
  onClose
}) {

  // Initialisation de formData selon le mode
  const [formData, setFormData] = useState({
    client: null,
    clientNonEnregistre: { nom: '', contact: '' },
    ordonnance: null,
    ordonnancePrixOD: 0,
    ordonnancePrixOG: 0,
    articles: [],
    montantTotal: 0,
    montantPaye: 0,
    resteAPayer: 0
  });
  
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false);
  const [isMontureModalOpen, setIsMontureModalOpen] = useState(false);
  const [isOrdonnanceChecked, setIsOrdonnanceChecked] = useState(false);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [selectedMontureList, setSelectedMontureList] = useState([])

  useEffect(() => {
    if (inFormVente && mode === 'update') {
      setFormData(inFormVente);
    }
  }, [inFormVente, mode]);

  // Calculer les totaux et reste à payer automatiquement
  useEffect(() => {
    const articlesTotal = formData.articles.reduce((acc, item) => acc + item.prixUnitaire * item.quantite, 0);
    const ordonnanceTotal = formData.ordonnancePrixOD + formData.ordonnancePrixOG;
    const montantTotal = articlesTotal + ordonnanceTotal;
    const resteAPayer = montantTotal - formData.montantPaye;
    setFormData((prev) => ({
      ...prev,
      montantTotal,
      resteAPayer,
    }));
  }, [formData.articles, formData.ordonnancePrixOD, formData.ordonnancePrixOG, formData.montantPaye]);

  // Gestion de la sélection d'une ordonnance
  const handleSelectOrdonnance = (ordonnance) => {
    setSelectedOrdonnance(ordonnance)
    setFormData((prev) => ({
      ...prev,
      ordonnance: ordonnance._id,
      ordonnancePrixOD: ordonnance.prixOD || 0,
      ordonnancePrixOG: ordonnance.prixOG || 0,
      client: ordonnance.patient
    }));
    setIsOrdonnanceModalOpen(false);
  };

  // Gestion de la sélection d'une monture
  const handleSelectMonture = (monture) => {
    setSelectedMontureList(prev => [...prev,monture])
    setFormData((prev) => ({
      ...prev,
      articles: [...prev.articles, { monture: monture._id, quantite: 1, prixUnitaire: 0, remise: 0 }]
    }));
    setIsMontureModalOpen(false);
  };

  // Mise à jour des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = () => {
    if (mode === 'create') {
      onCreate(formData);
    } else if (mode === 'update') {
      onUpdate(formData);
    }
    onClose();
  };

  // Gérer le changement de l'état de la case à cocher
  const handleCheckboxChange = (e) => {
    const {checked} = e.target;
    setIsOrdonnanceChecked(checked);
    if (checked) {
      setIsOrdonnanceModalOpen(true);  // Ouvrir le modal de recherche d'ordonnance lorsque la case est cochée
    } else {
      setSelectedOrdonnance(null)
      setFormData((prev) => ({
        ...prev,
        ordonnance: null,
        ordonnancePrixOD: 0,
        ordonnancePrixOG: 0,
        client:undefined
      }));
    }
  };

  return (
    <Modal isOpen={showModal} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === 'create' ? 'Nouvelle Vente' : 'Modifier Vente'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {inFormProcess.error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {inFormProcess.error}
            </Alert>
          )}
          {inFormProcess.success && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              {inFormProcess.success}
            </Alert>
          )}
          {formData.client ? (
            <Text>Client : {formData.client.name}</Text>
          ) : (
            <>
              <FormControl mb={4}>
                <FormLabel>Nom Client Non Enregistré</FormLabel>
                <Input
                  name="nom"
                  value={formData.clientNonEnregistre.nom}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientNonEnregistre: { ...prev.clientNonEnregistre, nom: e.target.value }
                    }))
                  }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Contact</FormLabel>
                <Input
                  name="contact"
                  value={formData.clientNonEnregistre.contact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientNonEnregistre: { ...prev.clientNonEnregistre, contact: e.target.value }
                    }))
                  }
                />
              </FormControl>
            </>
          )}

          {/* Ordonnance */}
          <FormControl mb={4}>
            <Checkbox 
              isChecked={isOrdonnanceChecked}
              onChange={handleCheckboxChange}
            >
              Inclure Ordonnance
            </Checkbox>
          </FormControl>
          
          {isOrdonnanceChecked && formData.ordonnance && selectedOrdonnance && (
            <Box>
              <Text sx={{fontWeight:'bold', textDecoration:"underline",marginBottom:2}}>Information du patient</Text>
              <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems='center'>
                <Text sx={{fontWeight: 'bold'}}>Nom</Text>
                <Text>{formData.client ? formData.client.name : 'Non enregistré'}</Text>
              </Box>
              <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems='center'>
                <Text sx={{fontWeight: 'bold'}}>Contact</Text>
                <Text>{formData.client.telephone}</Text>
              </Box>
              

              <Divider my={4} />
              <Text sx={{fontWeight:'bold', textDecoration:"underline",marginBottom:2}}>Ordonnance </Text>
              <Table>
                <Thead>
                  <Tr>
                    <Td>Oeil</Td>
                    <Td>Sphère</Td>
                    <Td>Cylindre</Td>
                    <Td>AXE</Td>
                    <Td>ADD</Td>
                  </Tr>
                </Thead>
                <Tbody>
                <Tr>
                    <Td>OG</Td>
                    <Td>{selectedOrdonnance?.oeilGauche?.SPH}</Td>
                    <Td>{selectedOrdonnance?.oeilGauche?.CYL}</Td>
                    <Td>{selectedOrdonnance?.oeilGauche?.AXE}</Td>
                    <Td>{selectedOrdonnance?.oeilGauche?.ADD}</Td>
                  </Tr>
                  <Tr>
                    <Td>OD</Td>
                    <Td>{selectedOrdonnance?.oeilDroit?.SPH}</Td>
                    <Td>{selectedOrdonnance?.oeilDroit?.CYL}</Td>
                    <Td>{selectedOrdonnance?.oeilDroit?.AXE}</Td>
                    <Td>{selectedOrdonnance?.oeilDroit?.ADD}</Td>
                  </Tr>
                </Tbody>
              </Table>
              {/* Autres détails de l'ordonnance */}
              <FormControl mb={4} flexDirection="row">
                <FormLabel>Prix Oeil Droit</FormLabel>
                <Input
                  type="number"
                  value={formData.ordonnancePrixOD}
                  onChange={handleInputChange}
                  name="ordonnancePrixOD"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Prix Oeil Gauche</FormLabel>
                <Input
                  type="number"
                  value={formData.ordonnancePrixOG}
                  onChange={handleInputChange}
                  name="ordonnancePrixOG"
                />
              </FormControl>
            </Box>
          )}

          <Divider my={4} />

          {/* Articles */}
          {formData.articles.map((article, index) => (
            <Box key={index}>
              <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems='center'>
                <Text sx={{fontWeight: 'bold'}}>Monture {index + 1}:</Text>
                <Text>{selectedMontureList[index].model}</Text>
              </Box>
              <FormControl mb={2}>
                <FormLabel>Quantité</FormLabel>
                <Input
                  type="number"
                  value={article.quantite}
                  onChange={(e) => {
                    const newArticles = [...formData.articles];
                    newArticles[index].quantite = e.target.value;
                    setFormData((prev) => ({ ...prev, articles: newArticles }));
                  }}
                />
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Prix Unitaire</FormLabel>
                <Input
                  type="number"
                  value={article.prixUnitaire}
                  onChange={(e) => {
                    const newArticles = [...formData.articles];
                    newArticles[index].prixUnitaire = e.target.value;
                    setFormData((prev) => ({ ...prev, articles: newArticles }));
                  }}
                />
              </FormControl>
            </Box>
          ))}
          <Button onClick={() => setIsMontureModalOpen(true)}>Ajouter Monture</Button>

          {/* Montant Total */}
          <Divider my={4} />
          <Text>Montant Total: {formData.montantTotal}</Text>
          <Input
            name="montantPaye"
            placeholder="Montant Payé"
            type="number"
            value={formData.montantPaye}
            onChange={handleInputChange}
          />
          <Text>Reste à Payer: {formData.resteAPayer}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>Enregistrer</Button>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>

      {/* Modals */}
      <SearchOrdonnance 
        isOpen={isOrdonnanceModalOpen} 
        onClose={() => setIsOrdonnanceModalOpen(false)} 
        onSelect={handleSelectOrdonnance}
      />
      <SearchMonture 
        isOpen={isMontureModalOpen} 
        onClose={() => setIsMontureModalOpen(false)} 
        onSelect={handleSelectMonture}
      />
    </Modal>
  );
}

export default VenteForm;
