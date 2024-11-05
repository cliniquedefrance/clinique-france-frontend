/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Divider, HStack, Button } from '@chakra-ui/react';
import {
  MontureZone,
  MontureList,
  MonturePagination,
  MontureSearch,
  MontureFilter,
  FilterOrder,
  MontureNumber,
  MontureRefresh,
  MontureState,
} from './Montures/Monture'; 
import MontureForm from './Montures/MontureForm';
import { CREATE_MODE, UPDATE_MODE } from './Montures/constants';
import DeleteRessourceDialogue from '../../components/Ressource/DeleteRessource';
import { createMonture, deleteMonture, getAllMontures, updateMonture } from './Montures/monture.api';

export const testMontureData =  [
  {
    _id: "1",
    brand: "Ray-Ban",
    model: "RB2132 - 55-18 - Noir Mat/Vert",
    createdAt: "2023-11-01T10:15:00Z",
    updatedAt: "2023-11-03T12:30:00Z",
    isInStock: true
  },
  {
    _id: "2",
    brand: "Oakley",
    model: "OX8046 - 53-17 - Noir/Argent",
    createdAt: "2023-10-20T09:00:00Z",
    updatedAt: "2023-10-25T14:45:00Z",
    isInStock: false
  },
  {
    _id: "3",
    brand: "Gucci",
    model: "GG0010O - 51-20 - Écaille/Marron",
    createdAt: "2023-09-15T16:45:00Z",
    updatedAt: "2023-09-18T11:20:00Z",
    isInStock: true
  },
  {
    _id: "4",
    brand: "Persol",
    model: "PO0649 - 54-20 - Havana",
    createdAt: "2023-08-12T13:10:00Z",
    updatedAt: "2023-08-14T10:55:00Z",
    isInStock: false
  },
  {
    _id: "5",
    brand: "Prada",
    model: "PR17TV - 50-19 - Noir Brillant/Argent",
    createdAt: "2023-07-01T08:25:00Z",
    updatedAt: "2023-07-05T09:30:00Z",
    isInStock: true
  },
  {
    _id: "6",
    brand: "Tom Ford",
    model: "FT5178 - 52-18 - Noir/Doré",
    createdAt: "2023-11-04T10:00:00Z",
    updatedAt: "2023-11-05T08:45:00Z",
    isInStock: true
  },
  {
    _id: "7",
    brand: "Dolce & Gabbana",
    model: "DG3258 - 54-16 - Rouge/Noir",
    createdAt: "2023-10-10T13:30:00Z",
    updatedAt: "2023-10-13T15:15:00Z",
    isInStock: false
  },
  {
    _id: "8",
    brand: "Burberry",
    model: "BE2272 - 53-18 - Noir Écaille",
    createdAt: "2023-09-20T14:00:00Z",
    updatedAt: "2023-09-23T17:40:00Z",
    isInStock: true
  },
  {
    _id: "9",
    brand: "Versace",
    model: "VE3219 - 52-19 - Noir/Or",
    createdAt: "2023-07-22T11:20:00Z",
    updatedAt: "2023-07-24T09:10:00Z",
    isInStock: false
  },
  {
    _id: "10",
    brand: "Cartier",
    model: "CT0145O - 54-18 - Platine/Bleu",
    createdAt: "2023-06-15T09:35:00Z",
    updatedAt: "2023-06-18T08:10:00Z",
    isInStock: true
  }
]


// Fonctions API simulées
const api = {
  getMontures: getAllMontures
  
  ,
};







function CataloguePage() {

  const [mode, setMode] = useState(CREATE_MODE);
  const [selectedMonture, setSelectedMonture] = useState(null);
  const [isMontureFormOpen, setIsMontureFormOpen] = useState(false);
  const [montureFormProcess, setMontureFormProcess] = useState({ error: null, success: null, loading: false });
  const [montureDeleteProcess, setMontureDeleteProcess] = useState({ error: null, success: null, loading: false });
  const [confirmDel, setConfirmDel] = useState(false);
  const [montureToDel, setMontureToDel] = useState(null);
  const [refreshList, setRefreshList] = useState(false);


  function handleCreateMonture(){
    setMode(CREATE_MODE);
    setSelectedMonture(null);
    setIsMontureFormOpen(true);
  }

  function handleCloseMontureForm(){
    setMode(null);
    setSelectedMonture(null);
    setIsMontureFormOpen(false);
    setMontureFormProcess({ error: null, success: null, loading: false })
  }

  
  
  async function onSaveMonture(monture){
    try {
        setMontureFormProcess({ error: null, success: null, loading: true })
        const createdMonture = await createMonture(monture);
        if(createdMonture){
          setMontureFormProcess({ error: null, success: "Monture crée avec succès", loading: false })
        }else{
          setMontureFormProcess({ error: "erreur lors de la création de la monture", success: null, loading: false })
        }
    
    } catch (error) {
      setMontureFormProcess({ error: error.message || "erreur lors de la création de la monture", success: null, loading: false })
    }
  
  }

  useEffect(()=>{
    if(montureFormProcess.success){
      const test = setTimeout(()=> {
        setRefreshList(prev => !prev)
        setIsMontureFormOpen(false)
        setMontureFormProcess(prev=> ({
          ...prev,
          success:""

        }))
        clearTimeout(test)
    }, 2000)}
    if(montureDeleteProcess.success){
      const testD = setTimeout(()=> {
        setRefreshList(prev => !prev)
        setMontureDeleteProcess(prev=> ({
          ...prev,
          success:""

        }))
        clearTimeout(testD)
    }, 2000)

  }},[montureFormProcess, montureDeleteProcess])

  async function onUpdateMonture(monture){
    try {
      setMontureFormProcess({ error: null, success: null, loading: true })
      const updatedMonture = await updateMonture(selectedMonture._id, monture);
      if(updatedMonture){
        setMontureFormProcess({ error: null, success: "Monture mise à jour avec succès", loading: false })
      }else{
        setMontureFormProcess({ error: "erreur lors de la mise à jour de la monture", success: null, loading: false })
      }
  } catch (error) {
    setMontureFormProcess({ error: error.message || "erreur lors de la mise à jour de la monture", success: null, loading: false })
  }

  }
  async function onDeleteMonture(){
    setConfirmDel(false)
    try {// parade
      setMontureDeleteProcess({ error: null, success: null, loading: true })
      const deletedMonture = await deleteMonture(montureToDel._id);
      if(deletedMonture){
        setMontureDeleteProcess({ error: null, success: "Monture supprimé avec succès", loading: false })
      }else{
        setMontureDeleteProcess({ error: "erreur lors de la suppression de la monture", success: null, loading: false })
      }
  } catch (error) {
    setMontureDeleteProcess({ error: error.message || "erreur lors de la suppression de la monture", success: null, loading: false })
  }

  }

  const hideDelConfirm = ()=>{
    setConfirmDel(false)
  }
  


  const montureActions = [
    {
      label: 'Modifier',
      action: (monture) => {
        setMode(UPDATE_MODE);
        setSelectedMonture(monture);
        setIsMontureFormOpen(true);
      },
    },
    {
      label: 'Supprimer',
      action: (monture) => {
        setMontureToDel(monture);
        setConfirmDel(true)
      },
    },
  ];

  return (
    <Box p={8}>
      <Heading as="h1" mb={4}>
        Catalogue de Montures
      </Heading>
      
      <MontureZone r={refreshList} api={api} actions={montureActions}>
        <MontureState process={montureDeleteProcess} retryFunction={()=>onDeleteMonture()} setProcess={setMontureFormProcess}/>
        <VStack align="start" spacing={4} mb={6} width="100%">
          <MontureSearch />
          <HStack spacing={4}>
            <MontureFilter />
            <FilterOrder />
            <Button colorScheme='blue' minW={200} onClick={handleCreateMonture}>Ajouter une Monture</Button>


          </HStack>
          
        </VStack>
        <Divider mb={4} />
        <HStack spacing={4}>
        <MontureNumber />
        <MontureRefresh/>
          </HStack>
        
        <MontureList />
        <Divider mt={4} mb={4} />
        <MonturePagination />
      </MontureZone>
      {isMontureFormOpen && <MontureForm onSave={onSaveMonture} onUpdate={onUpdateMonture} onClose={()=> handleCloseMontureForm()} isOpen={isMontureFormOpen} with={selectedMonture} mode={mode} process={montureFormProcess}/>}
      <DeleteRessourceDialogue title="suppression Monture"  open={confirmDel} onClose={hideDelConfirm} ressourceName={montureToDel?.model || "aucun"} onDelete={onDeleteMonture} />
    </Box>
  );
}

export default CataloguePage;
