/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState }  from 'react';
import {  useNavigate } from 'react-router-dom';
import { Box, VStack, Heading, Divider, HStack, Button } from '@chakra-ui/react';
import { VenteList, VenteNumber, VenteOrder, VentePagination, VenteRefresh, VenteSearch, VenteState, VenteZone } from './VenteZone/VenteComponnents';
import DeleteRessourceDialogue from '../../components/Ressource/DeleteRessource';
import VenteForm from './VenteZone/VenteForm';
import { CREATE_MODE, UPDATE_MODE } from './VenteZone/constants';
import { creerVente, mettreAJourVente, obtenirToutesLesVentes, supprimerVente } from './vente.api';
import { getAllOrdonnances } from '../PatientPages/Manage/ordonnance.api';
import { getAllMontures } from '../Catalogue/Montures/monture.api';
import VenteFilter from './VenteZone/VenteFilter';

// Fonctions API simulées
const api = {
  getVentes: obtenirToutesLesVentes,
  getOrdonnances: getAllOrdonnances,
  getMontures: getAllMontures,
};







function VentePage() {

const navigate = useNavigate()

    const [confirmVenteDel, setConfirmDel] = useState(false);
    const [venteToDel, setVenteToDel] = useState(null);
    const [venteMode, setMode] = useState(CREATE_MODE);
    const [inFormVente, setInFormVente] = useState(null);
    const [showVenteForm, setShowVenteForm] = useState();
    const [inVenteFormProcess, setInFormProcess] = useState({error:"", loading:false, success:""})
    const [venteDeleteProcess, setVenteDeleteProcess] = useState({ error: null, success: null, loading: false });
    const [refreshList, setRefreshList] = useState(false);




    console.log(showVenteForm)
      const handleCreateVente = () => {
        setInFormVente(null);
        setMode(CREATE_MODE);
        setShowVenteForm(true);
      }
      const handleUpdateVente = (vente) => {
        setInFormVente(vente);
        setMode(UPDATE_MODE);
        setShowVenteForm(true);
      }


      function handleCloseVenteForm(){
        setMode(null);
        setInFormVente(null);
        setShowVenteForm(false);
        setInFormProcess({ error: null, success: null, loading: false })
      }
    
      
      
      async function onSaveVente(vente){
        try {
            setInFormProcess({ error: null, success: null, loading: true })
            const createdVente = await creerVente(vente);
            if(createdVente){
              setInFormProcess({ error: null, success: "Vente crée avec succès", loading: false })
            }else{
              setInFormProcess({ error: "erreur lors de la création de la vente", success: null, loading: false })
            }
        
        } catch (error) {
          setInFormProcess({ error: error.message || "erreur lors de la création de la vente", success: null, loading: false })
        }
      
      }
    
      useEffect(()=>{
        if(inVenteFormProcess.success){
          const test = setTimeout(()=> {
            setRefreshList(prev => !prev)
            setShowVenteForm(false)
            setInFormProcess(prev=> ({
              ...prev,
              success:""
    
            }))
            clearTimeout(test)
        }, 2000)}
        if(venteDeleteProcess.success){
          const testD = setTimeout(()=> {
            setRefreshList(prev => !prev)
            setVenteDeleteProcess(prev=> ({
              ...prev,
              success:""
    
            }))
            clearTimeout(testD)
        }, 2000)
    
      }},[inVenteFormProcess, venteDeleteProcess])
    
      async function onUpdateVente(vente){
        try {
          setInFormProcess({ error: null, success: null, loading: true })
          const updatedVente = await mettreAJourVente(inFormVente._id, vente);
          if(updatedVente){
            setInFormProcess({ error: null, success: "Vente mise à jour avec succès", loading: false })
          }else{
            setInFormProcess({ error: "erreur lors de la mise à jour de la vente", success: null, loading: false })
          }
      } catch (error) {
        setInFormProcess({ error: error.message || "erreur lors de la mise à jour de la vente", success: null, loading: false })
      }
    
      }
      async function onDeleteVente(){
        setConfirmDel(false)
        try {// parade
          setVenteDeleteProcess({ error: null, success: null, loading: true })
          const deletedMonture = await supprimerVente(venteToDel._id);
          if(deletedMonture){
            setVenteDeleteProcess({ error: null, success: "Vente supprimé avec succès", loading: false })
          }else{
            setVenteDeleteProcess({ error: "erreur lors de la suppression de la Vente", success: null, loading: false })
          }
      } catch (error) {
        setVenteDeleteProcess({ error: error.message || "erreur lors de la suppression de la Vente", success: null, loading: false })
      }
    
      }
    
      const hideDelConfirm = ()=>{
        setConfirmDel(false)
      }
      
      
    const actions = [
      {
          label: "modifier",
          action: (vente)=> handleUpdateVente(vente)
  
      },
      {
          label: "Supprimer",
          action: (vente)=> {
            setVenteToDel(vente);
            setConfirmDel(true)
          }
  
      },
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
    <Box p={8}>
      <Heading as="h1" mb={4}>
        Gestion des Ventes
      </Heading>
      
      <VenteZone r={refreshList} api={api} >
        <VenteState process={venteDeleteProcess}  retryFunction={()=>onDeleteVente()} setProcess={setVenteDeleteProcess}/>
        <VStack align="start" spacing={4} mb={6} width="100%">
          <VenteSearch />
          <HStack spacing={4} align="center" mb={4}>
            <VenteFilter />
            <VenteOrder />
            <Button colorScheme='blue' minW={200} onClick={handleCreateVente}>Lancer une vente</Button>
          </HStack>
          
        </VStack>
        <Divider mb={4} />
        <HStack spacing={4}>
        <VenteNumber />
        <VenteRefresh/>
          </HStack>
        
        <VenteList actions={actions}/>
        <Divider mt={4} mb={4} />
        <VentePagination />
       <VenteForm
        inFormProcess={inVenteFormProcess}
        inFormVente={inFormVente}
        mode={venteMode}
        showModal={showVenteForm}
        onCreate={onSaveVente}
        onUpdate={onUpdateVente}
        onClose={()=>handleCloseVenteForm()}
        
        />
      </VenteZone>
     
      <DeleteRessourceDialogue title="suppression Vente" onDelete={()=>onDeleteVente()}  open={confirmVenteDel} onClose={hideDelConfirm} ressourceName="Vente"  />
    </Box>
  );
}

export default VentePage;
