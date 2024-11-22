/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
 Tabs, TabList, TabPanels, Tab, TabPanel, Button, Flex, HStack, VStack, Table,
  Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Heading,
} from '@chakra-ui/react';

import { getAllPatients } from '../../../redux/patient/actions';
import { UPDATE_PATIENT_FINISHED } from '../../../redux/patient/types';
import { UPDATE_PRATICIEN_FINISHED } from '../../../redux/praticiens/types';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';
import styles from './style';
import user from '../../../assets/images/user.png';
import { renderObjectWithoutField } from '../../../utils/helpers';
import Ophtamology from '../../../components/Ordonances/Ophtamology';
import { createOrdonnance, deleteOrdonnance, getAllOrdonnances, getOrdonnancesByPatient, updateOrdonnance } from './ordonnance.api';
import OrdonnanceOphtaCard from '../../../components/Ordonances/OrdonnaceOphtaCard';
import DeleteRessourceDialogue from '../../../components/Ressource/DeleteRessource';
import { CREATE_MODE, ORDONNANCE_OPHTA_TO_PRINT, ORDONNANCE_RESSOURCE, UPDATE_MODE, VIEW_MODE } from './constants';
import VenteForm from '../../Ventes/VenteZone/VenteForm';
import { creerVente, obtenirToutesLesVentes } from '../../Ventes/vente.api';
import { VenteList, VentePagination,  VenteZone } from '../../Ventes/VenteZone/VenteComponnents';
import { getAllMontures } from '../../Catalogue/Montures/monture.api';
import VenteFilter from '../../Ventes/VenteZone/VenteFilter';

const api = {
  getVentes: obtenirToutesLesVentes,
  getOrdonnances: getAllOrdonnances,
  getMontures: getAllMontures,
};




function ManagePatient() {

    const dispatch = useDispatch();
  const { id } = useParams();

  const patientVenteApi = {
    getVentes: async () => {
      const ventes = await obtenirToutesLesVentes();
      const patientVentes = ventes.filter(vente => vente?.client?._id === id );
      return patientVentes
  
    },
    getOrdonnances: getAllOrdonnances,
    getMontures: getAllMontures,
  }

  const patients = useSelector((state) => state.Patient.patients);
  const [patientToManage, setPatientToManage] = useState({});
  const [allOrdonnances, setAllOrdonnances] = useState([]);
  const [pageOrdoState, setPageOrdoState] = useState({error:"", loading:false, success:""});
  const [confirmDel, setConfirmDel] = useState(false);
  const [selectedOrdonnance, setSelectedOrdonnance] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(VIEW_MODE);
  const [toDelete, setToDelete] = useState({ type: "none", data: null });
  const [modalOrdoState, setModalOrdoState] = useState({error:"", loading:false, success:""});
  const [refreshPatientVenteList, setRefreshPatientVenteList] = useState(true);
  const [inVenteFormProps, setInVenteFormProps] = useState({
    mode:"update",
    showModal: false,
    inFormVente : null,
    inFormProcess : {error:"", loading:false, success:""},
    onCreate:() => null,
    onUpdate: ()=> null,
    onClose : ()=>null
  })
  const navigate = useNavigate();
  
  const handleFetchAllOrdonnances = async () => {
    setPageOrdoState({
      error:"",
      loading:true,
      success:"",
    });
   
    try {
      
      const ordonnances = await getOrdonnancesByPatient(id);
      setAllOrdonnances(ordonnances);
      setPageOrdoState({
        error:"",
        loading:false,
        success:"Ordonnances chargées avec succès.",
      });
    } catch (error) {
      setPageOrdoState({
        error:"Erreur lors de la récupération des ordonnances.",
        loading:false,
        success:"",
      });
    } finally {
      
      setPageOrdoState(prev => ({
        ...prev,
        loading:false,
      }));
    }
  };

  const onPrint = (data) => {
    const ordoData = {
      ...data,
      patient:patientToManage,
    }
    window.localStorage.setItem(ORDONNANCE_OPHTA_TO_PRINT, JSON.stringify(ordoData));
    navigate(`/print/ordonnance-ophta/${data._id}`)
    console.log("Ordonnance imprimée !");
  };


  const onCreateOrdonnance = async (data, print = false) => {

    setModalOrdoState(prev => ({
        ...prev,
        error:"",
        loading:true,
      }))
    try {
     const ord = await createOrdonnance({...data, patient:patientToManage._id});
      setModalOrdoState(prev => ({
        ...prev,
        error:"",
        loading:false,
        success: "Ordonnance créée avec succès."
      }))
      if (print) {
        onPrint(ord);
      }
      return true;

    } catch (error) {
      setModalOrdoState(prev => ({
        ...prev,
        error:"Erreur lors de la création de l'ordonnance.",
        loading:false,
        success: ""
      }))
      return false;
    } finally {
      handleFetchAllOrdonnances();
    }
  };

 
  const handleCreateOrdonnance = () => {
    setModalMode(CREATE_MODE);
    setSelectedOrdonnance(null);
    setIsViewModalOpen(true);
  };

  const handleViewOrdonnance = (ordonnance) => {
    setPageOrdoState(prev => ({
      ...prev,
      loading:false,
      error:""
    }));
    setSelectedOrdonnance(ordonnance);
    setModalMode(VIEW_MODE);
    setIsViewModalOpen(true);
  };

  const handleUpdateOrdonnance = (ordonnance) => {
    setPageOrdoState(prev => ({
      ...prev,
      loading:false,
      error:""
    }));
    setSelectedOrdonnance(ordonnance);
    setModalMode(UPDATE_MODE);
    setIsViewModalOpen(true);
  };

  const hideModal = () => {
    if([CREATE_MODE, UPDATE_MODE].includes(modalMode) || confirmDel){
      handleFetchAllOrdonnances();
    }
    setSelectedOrdonnance(null);
    setModalOrdoState(prev => ({
      ...prev,
      error:"",
      loading:false,
      success: ""
    }))
    setIsViewModalOpen(false);
    setConfirmDel(false);
  };

  const handleDeleteOrdonnance = (data) => {
    setPageOrdoState(prev => ({
      ...prev,
      loading:false,
      error:""
    }));
    setToDelete({ type: ORDONNANCE_RESSOURCE, data });
    setConfirmDel(true);
  };

  const onDelete = async () => {
    setPageOrdoState({
      error:"",
      loading:true,
      success:"",
    });
    try {
      if (toDelete.type === ORDONNANCE_RESSOURCE) {
        await deleteOrdonnance(toDelete.data._id);
      }
      setPageOrdoState({
        error:"",
        loading:false,
        success:"Suppression réussie.",
      });
  
    } catch (error) {
      setPageOrdoState({
        error:"Erreur lors de la récupération des ordonnances.",
        loading:false,
        success:"",
      });
    } finally {
      hideModal();
    }
  };

  const onUpdate = async (ordonnance, print = false) => {
    setModalOrdoState(prev => ({
      ...prev,
      error:"",
      loading:true,
      success: ""
    }))
    try {
      await updateOrdonnance(selectedOrdonnance._id, ordonnance);
     
      setModalOrdoState(prev => ({
        ...prev,
        error:"",
        loading:false,
        success: `Mise à jour réussie. ${print? "impression...":""}`
      }))
      if (print) {
        onPrint(ordonnance);
      }
      return true
    } catch (error) {
     
      setModalOrdoState(prev => ({
        ...prev,
        error:"Erreur lors de la mise à jour.",
        loading:false,
        success: ""
      }))

      return false
    }
  };

 const onVenteFormClose = ()=> {
  setInVenteFormProps({
    mode:"update",
    showModal: false,
    inFormVente : null,
    inFormProcess : {error:"", loading:false, success:""},
    onCreate:() => null,
    onUpdate: ()=> null,
    onClose : ()=>null
  })
 }

  async function onSaveVente(vente,print=false){
    try {
        setInVenteFormProps(prev => ({
          ...prev,
          inFormProcess: { error: null, success: null, loading: true }
        }))
        const createdVente = await creerVente(vente);
        if(createdVente){
          setInVenteFormProps(prev => ({
            ...prev,
            inFormProcess: { error: null, success: "Vente crée avec succès", loading: true }
          }))
          if(print===true){
            window.alert(` Impression de la vente : ${ createdVente?._id} \n le service d'impression n'est pes encore implémenté. `)
          }
          setRefreshPatientVenteList(prev => !prev)
          onVenteFormClose()

        }else{

          setInVenteFormProps(prev => ({
            ...prev,
            inFormProcess: { error: null, success: "erreur lors de la création de la vente", loading: true }
          }))
        }
    
    } catch (error) {
      setInVenteFormProps(prev => ({
        ...prev,
        inFormProcess: { error: null, success: "erreur lors de la création de la vente", loading: true }
      }))
    }
  
  }

  const formatInFormVenteWithOrdonnance = (ordonnance) => ({
      client: ordonnance.patient,
      clientNonEnregistre: { nom: '', contact: '' },
      ordonnance,
      ordonnancePrixOD: 0,
      ordonnancePrixOG: 0,
      articles: [],
      montantTotal: 0,
      montantPaye: 0,
      resteAPayer: 0
    })

 const handleSaleOrdonnance = (ordonnance) => {
  const inVenteFormData = formatInFormVenteWithOrdonnance(ordonnance);
 setInVenteFormProps(prev => ({
  ...prev,
  showModal:true,
  inFormVente: inVenteFormData,
  onUpdate: onSaveVente,
 }))
 }



  useEffect(() => {
    dispatch({ type: UPDATE_PATIENT_FINISHED });
    dispatch({ type: UPDATE_PRATICIEN_FINISHED });
    dispatch({ type: UPDATE_USER_FINISHED });
  }, [dispatch]);

  useEffect(() => {
    if (patients.length === 0) dispatch(getAllPatients());
    const patient = patients.find((u) => u._id === id);
    if (patient) {
      setPatientToManage(patient);
      handleFetchAllOrdonnances();
    }
  }, [patients, id, dispatch]);

  useEffect(()=>{
    if (pageOrdoState.success) {
      const test = setTimeout(()=> {
        setPageOrdoState(prev=> ({
          ...prev,
          success:""

        }))
        clearTimeout(test)

      },2000)
    }

   

  }, [pageOrdoState])

  const { name, civility, surname, telephone, email, photo } = patientToManage;

  const actions = [
    // {
    //     label: "modifier",
    //     action: (vente)=> handleUpdateVente(vente)

    // },
    // {
    //     label: "Supprimer",
    //     action: (vente)=> {
    //       setVenteToDel(vente);
    //       setConfirmDel(true)
    //     }

    // },
    {
        label: "imprimer Proforma",
        action: (vente)=> navigate(`/print/vente-proforma/${vente._id}`),

    },
    {
      label:"Voir JSON",
      action : (vente) => window.alert(JSON.stringify(vente, null, 2))
    }
 ]
  return (
    <VenteZone api={api} inOtherPage>
      <Flex style={styles.formContainer} backgroundColor="#2c3e50" overflow="hidden">
      <HStack width="100%" flex={1} justifyContent="space-between" alignItems="center" gap="2px">
        <VStack padding={2} backgroundColor="whitesmoke" height="100%" position="relative" flex={1 / 4} justifyContent="center" alignItems="center">
          <img src={photo || user} alt="Patient" width="72px" height="72px" />
          <p style={{ textAlign: "center" }}>{`${civility?.abreviation || "M."} ${name} ${surname}`}</p>
          <p>{email}</p>
          <p>{telephone}</p>
          <Button colorScheme="red" onClick={() => navigate(-1)}>Retour</Button>
        </VStack>

        <VStack backgroundColor="whitesmoke" flex={1} height="100%">
          <Tabs isFitted variant="unstyled" width="100%">
            <TabList mb="1em" borderBottomColor="#2c3e50" borderBottomWidth="2px" borderTopColor="blue.500" borderTopWidth="2px">
              <Tab _selected={{ color: 'white', bg: "#2c3e50" }}>Détails du patient</Tab>
              <Tab _selected={{ color: 'white', bg: "#2c3e50" }}>Ordonnances</Tab>
              <Tab _selected={{ color: 'white', bg: "#2c3e50" }}>Statistiques</Tab>
            </TabList>
            <TabPanels>
              <TabPanel overflow="auto" maxHeight={500}>
                <TableContainer marginBottom={50}>
                  <Table variant="striped" size="sm">
                    <TableCaption placement="top">Détails du patient</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Propriété</Th>
                        <Th>Valeur</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.entries(renderObjectWithoutField(patientToManage, ["civility", "__v", "rights", "_id", "expoToken"])).map(([key, value]) => (
                        <Tr key={key}>
                          <Td>{key}</Td>
                          <Td>{JSON.stringify(value)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Propriété</Th>
                        <Th>Valeur</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
                <HStack margin={15} spacing={4} justify='flex-end'>
                  <Button w='250px' colorScheme="blue" onClick={() => navigate(`/content/patient/upsert/${id}`)}>Modifier</Button>
                  <Button w="250px" colorScheme="blue" onClick={() => navigate(`/content/patient/change-pwd/${id}`)}>Modifier le mot de passe</Button>
                </HStack>
              </TabPanel>

              <TabPanel overflow="auto" maxHeight="100vh">
              {pageOrdoState.error && !pageOrdoState.loading && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Erreur !</AlertTitle>
                <AlertDescription>{pageOrdoState.error}</AlertDescription>
                <Button size="sm" colorScheme="red" onClick={()=>handleFetchAllOrdonnances()} ml={3}>
                  Réessayer
                </Button>
              </Alert>
            )}
               {pageOrdoState.success && !pageOrdoState.loading && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                <AlertTitle>Succès !</AlertTitle>
                <AlertDescription>{pageOrdoState.success}</AlertDescription>
              </Alert>
            )}
                {patients.length !== 0 && <Button colorScheme="blue" onClick={() => handleCreateOrdonnance()}>Ajouter une Ordonnance</Button>}
                <p style={{ padding: "10px", textAlign: 'center', fontSize: "16px", fontWeight: "bold" }}>Liste des Ordonnances</p>
                {isViewModalOpen && (
                <Ophtamology
                  loading={modalOrdoState.loading}
                  with={selectedOrdonnance}
                  mode={modalMode}
                  onUpdate={onUpdate}
                  onPrint={onPrint}
                  patient={patientToManage}
                  onClose={hideModal}
                  isOpen={isViewModalOpen}
                  onSave={onCreateOrdonnance}
                  error={modalOrdoState.error}
                  success={modalOrdoState.success}
                />
              )}
                 {allOrdonnances.length ? (<>
                        {pageOrdoState.loading && <Spinner /> }
                          {allOrdonnances.map((ordonnance) => (
                                            <OrdonnanceOphtaCard
                                              key={ordonnance._id}
                                              ordonnance={ordonnance}
                                              onView={handleViewOrdonnance}
                                              onDelete={handleDeleteOrdonnance}
                                              onUpdate={handleUpdateOrdonnance}
                                              onPrint={onPrint}
                                              onSale={handleSaleOrdonnance}
                                            />
                                          ))}
                 </>
                  
               
              ) : <p>Aucune ordonnance trouvée pour ce patient.</p>}
              </TabPanel>

              <TabPanel>
              <Heading as="h2" mb={4}>
         Ventes du patient
      </Heading>
                <VenteZone r={refreshPatientVenteList}  api={patientVenteApi}>
                  <VenteFilter showClientType={false}/>
                  <Divider mt={4} mb={4} />
                  <VenteList actions={actions}/>
                  <Divider mt={4} mb={4} />
                  <VentePagination/>
                </VenteZone>
                
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </HStack>
      <VenteForm {...inVenteFormProps} onClose={onVenteFormClose}/>
      <DeleteRessourceDialogue title="suppression ordonnance"  open={confirmDel} onClose={hideModal} ressourceName={ORDONNANCE_RESSOURCE} onDelete={onDelete} />
    </Flex>
    </VenteZone>
    
  );
}

export default ManagePatient;
