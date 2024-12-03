/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Button, Input, FormControl, FormLabel, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Text, Divider, Checkbox, Alert, AlertIcon,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack
} from '@chakra-ui/react';
import { SearchMonture, SearchOrdonnance, VenteContext } from './VenteComponnents';
import getConnectedUser from '../../../utils/user';

function VenteForm({
  mode,
  showModal,
  inFormVente,
  inFormProcess,
  onCreate,
  onUpdate,
  onClose,
  isOnOtherPage=false,
}) {
  const [connectedUser, setConnectedUser] = useState(null);

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
    resteAPayer: 0,
    user:null,
  });

  const {inOtherPage} = useContext(VenteContext)
  const [isOrdonnanceModalOpen, setIsOrdonnanceModalOpen] = useState(false);
  const [isMontureModalOpen, setIsMontureModalOpen] = useState(false);
  const [isOrdonnanceChecked, setIsOrdonnanceChecked] = useState(false);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [selectedMontureList, setSelectedMontureList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    if (inFormVente && mode === 'update') {
      const { ordonnance, articles } = inFormVente;
      setSelectedOrdonnance(ordonnance);
      setSelectedPatient(ordonnance?.patient);
      setIsOrdonnanceChecked(!!ordonnance);

      const montureList = articles.map((ar) => ar.monture);
      setSelectedMontureList([...montureList]);

      setFormData({
        ...inFormVente,
        ordonnance: ordonnance?._id || null,
        patient: ordonnance?.patient?._id || null,
        ordonnancePrixOD: inFormVente?.ordonnancePrixOD || 0,
        ordonnancePrixOG: inFormVente?.ordonnancePrixOG || 0,
        articles: articles.map(({ monture, quantite, prixUnitaire, remise }) => ({
          monture: monture._id,
          quantite,
          prixUnitaire,
          remise,
        })),
        montantTotal: inFormVente.montantTotal || 0,
        montantPaye: inFormVente.montantPaye || 0,
        resteAPayer: inFormVente.resteAPayer || 0,
        user: inFormVente?.user?._id || connectedUser._id || ""
      });
    }
  }, [inFormVente, mode, connectedUser]);


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


  useEffect(() => {
    const user = getConnectedUser()
    if (user) {
        setConnectedUser(user.user);
        if(mode==="create" ){
            setFormData(prev => ({
                ...prev,
                user:user.id,
            }))
        } 
        if (mode==='update' && isOnOtherPage){
          setFormData(prev => ({
            ...prev,
            user:user.id,
        }))
        }
    } else {
        setConnectedUser(null);
    }

}, [mode, inFormVente])


  // Gestion de la sélection d'une ordonnance
  const handleSelectOrdonnance = (ordonnance) => {
    setSelectedOrdonnance(ordonnance)
    setFormData((prev) => ({
      ...prev,
      ordonnance: ordonnance?._id,
      ordonnancePrixOD: ordonnance.prixOD || 0,
      ordonnancePrixOG: ordonnance.prixOG || 0,
      client: ordonnance.patient?._id,
      clientNonEnregistre: {
        nom: '',
        contact: '',
      }

    }));
    setSelectedPatient(ordonnance.patient);
    window.alert(JSON.stringify(formData, null, 2))
    setIsOrdonnanceModalOpen(false);
  };

  // Gestion de la sélection d'une monture
  const handleSelectMonture = (monture) => {
    const index = formData.articles.findIndex((ar) => ar.monture === monture._id);

    if (index === -1) {
      setFormData((prev) => ({
        ...prev,
        articles: [...prev.articles, { monture: monture._id, quantite: 1, prixUnitaire: monture.prix || 0 }],
      }));
    } else {
      const updatedArticles = [...formData.articles];
      updatedArticles[index].quantite += 1;
      setFormData((prev) => ({ ...prev, articles: updatedArticles }));
    }

    setSelectedMontureList((prev) => {
      const isAlreadySelected = prev.some((m) => m._id === monture._id);
      return isAlreadySelected ? prev : [...prev, monture];
    });

    setIsMontureModalOpen(false)
  };


  // Mise à jour des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: isNaN(value) ? value : Number(value) }));

  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (print=false) => {
    if (mode === 'create') {
      onCreate(formData);
    } else if (mode === 'update') {
      onUpdate(formData,print);
    }
    // onClose();
  };

  // Gérer le changement de l'état de la case à cocher
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsOrdonnanceChecked(checked);
    if (checked) {
      setIsOrdonnanceModalOpen(true);  // Ouvrir le modal de recherche d'ordonnance lorsque la case est cochée
    } else if (!formData.ordonnance) { // Ne pas réinitialiser si une ordonnance est déjà présente
      setSelectedOrdonnance(null);
      setSelectedPatient(null)
      setFormData((prev) => ({
        ...prev,
        ordonnance: null,
        ordonnancePrixOD: 0,
        ordonnancePrixOG: 0,
        client: undefined,
      }));
    }
  };





  const handleClose = () => {
    setFormData({
      client: null,
      clientNonEnregistre: { nom: '', contact: '' },
      ordonnance: null,
      ordonnancePrixOD: 0,
      ordonnancePrixOG: 0,
      articles: [],
      montantTotal: 0,
      montantPaye: 0,
      resteAPayer: 0,
    });
    setSelectedOrdonnance(null);
    setSelectedMontureList([]);
    setSelectedPatient(null);
    onClose();
  };


  return (
    <Modal isOpen={showModal} onClose={handleClose} size="lg">
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
            <Text>Client : {selectedPatient?.name}</Text>
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
              <Text sx={{ fontWeight: 'bold', textDecoration: "underline", marginBottom: 2 }}>Information du patient</Text>
              <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems='center'>
                <Text sx={{ fontWeight: 'bold' }}>Nom</Text>
                <Text>{selectedPatient ? selectedPatient?.name : 'Non enregistré'}</Text>
              </Box>
              <Box display="flex" flexDirection='row' justifyContent="space-between" alignItems='center'>
                <Text sx={{ fontWeight: 'bold' }}>Contact</Text>
                <Text>{selectedPatient?.telephone}</Text>
              </Box>


              <Divider my={4} />
              <Text sx={{ fontWeight: 'bold', textDecoration: "underline", marginBottom: 2 }}>Ordonnance </Text>
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
              <HStack spacing={8} align="center" mb={4}>
                {/* Champ Prix Oeil Droit */}
                <FormControl>
                  <HStack align="center">
                    <FormLabel mb={0} width="auto">
                      Prix Oeil Droit
                    </FormLabel>
                    <NumberInput
                      value={formData.ordonnancePrixOD}
                      onChange={(valueString) => handleInputChange({ target: { name: 'ordonnancePrixOD', value: valueString } })}
                      min={0}
                      precision={2} // Pour avoir deux décimales si nécessaire
                      width="150px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </FormControl>

                {/* Champ Prix Oeil Gauche */}
                <FormControl>
                  <HStack align="center">
                    <FormLabel mb={0} width="auto">
                      Prix Oeil Gauche
                    </FormLabel>
                    <NumberInput
                      value={formData.ordonnancePrixOG}
                      onChange={(valueString) => handleInputChange({ target: { name: 'ordonnancePrixOG', value: valueString } })}
                      min={0}
                      precision={2} // Pour avoir deux décimales si nécessaire
                      width="150px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </FormControl>
              </HStack>

            </Box>
          )}

          <Divider my={4} />

          {/* Articles */}
          {formData.articles.map((article, index) => {
            const mont = selectedMontureList.filter((m) => m._id === article?.monture);
            const inSelectedMonture = mont[0];

            return (
              <Box key={article.monture} mb={4}>
              
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontWeight="bold">Monture {index + 1}:</Text>
                  <Text>{inSelectedMonture?.model}</Text>
                </Box>

            
                <HStack spacing={8} align="center">
                
                  <FormControl>
                    <HStack align="center">
                      <FormLabel mb={0} width="auto">
                        Quantité
                      </FormLabel>
                      <NumberInput
                        value={article.quantite}
                        onChange={(valueString) => {
                          const value = Math.max(1, Math.min(Number(valueString), inSelectedMonture?.quantity || 1));
                          const newArticles = [...formData.articles];
                          newArticles[index].quantite = Number(value);
                          setFormData((prev) => ({ ...prev, articles: newArticles }));
                        }}
                        min={1}
                        max={inSelectedMonture?.quantity || 1}
                        width="100px"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <HStack align="center">
                      <FormLabel mb={0} width="auto">
                        Prix Unitaire
                      </FormLabel>
                      <NumberInput
                        value={article.prixUnitaire}
                        onChange={(valueString) => {
                          const newArticles = [...formData.articles];
                          newArticles[index].prixUnitaire = Number(valueString);
                          setFormData((prev) => ({ ...prev, articles: newArticles }));
                        }}
                        min={0}
                        width="100px"
                        precision={2} 
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </HStack>
              </Box>
            );
          })}

          <Button onClick={() => setIsMontureModalOpen(true)}>Ajouter Monture</Button>

          {/* Montant Total */}
          <Divider my={4} />
          <Text>Montant Total: {formData.montantTotal}</Text>
          <FormControl mb={4}>
            <HStack align="center">
              <FormLabel mb={0} width="auto">
                Montant Payé
              </FormLabel>
              <NumberInput
                value={formData.montantPaye}
                onChange={(valueString) => handleInputChange({ target: { name: 'montantPaye', value: valueString } })}
                min={0}
                precision={2} // Pour deux décimales
                placeholder="Montant Payé"
                width="150px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </FormControl>

          <Text>Reste à Payer: {formData.resteAPayer}</Text>
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
          <p><span>Utilisateur : </span> <span style={{fontWeight:"bold", fontStyle:'italic'}}>{connectedUser?.name}</span></p>
        </ModalBody>

        <ModalFooter>
          {inOtherPage && <Button onClick={()=>handleSubmit(true)} >Imprimer la Proforma</Button>}
          <Button colorScheme="blue" onClick={handleSubmit}>Enregistrer</Button>
          <Button variant="ghost" onClick={handleClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>

      {/* Modals */}
      <SearchOrdonnance
        isOpen={isOrdonnanceModalOpen}
        onClose={() => {
          setIsOrdonnanceModalOpen(false);
          if (!selectedOrdonnance) {
            setIsOrdonnanceChecked(false)
          }
        }}
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
