/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState }  from 'react';
import {  useNavigate } from 'react-router-dom';
import { Box, VStack, Heading, Divider, HStack, Button } from '@chakra-ui/react';
import { VenteList, VenteNumber, VenteOrder, VentePagination, VenteRefresh, VenteSearch, VenteZone } from './VenteZone/VenteComponnents';
import DeleteRessourceDialogue from '../../components/Ressource/DeleteRessource';
import VenteForm from './VenteZone/VenteForm';
import { CREATE_MODE, UPDATE_MODE } from './VenteZone/constants';
import { creerVente, mettreAJourVente, obtenirToutesLesVentes, supprimerVente } from './vente.api';
import { getAllOrdonnances } from '../PatientPages/Manage/ordonnance.api';
import { getAllMontures } from '../Catalogue/Montures/monture.api';
import VenteFilter from './VenteZone/VenteFilter';


// const testVentesData = [
//     {
//       _id: 'vente1',
//       client: {
//         _id: 'patient1',
//         name: 'Mark',
//         surname: 'Twain',
//         birthdate: '1980-11-01',
//         telephone: '555123456',
//         email: 'mark.twain@example.com',
//       },
//       clientNonEnregistre: null,
//       articles: [
//         {
//           monture: {
//             _id: 'monture1',
//             brand: 'Ray-Ban',
//             model: 'RB2132',
//             quantity: 10,
//           },
//           quantite: 1,
//           prixUnitaire: 120,
//           remise: 10,
//         },
//       ],
//       ordonnance: {
//         _id: 'ordonnance1',
//         patient: 'patient1',
//         date: '2024-10-20',
//         oeilDroit: {
//           SPH: -1.5,
//           CYL: -0.75,
//           AXE: 90,
//           ADD: 1.25,
//           EP: 0.25,
//         },
//         oeilGauche: {
//           SPH: -1.25,
//           CYL: -0.5,
//           AXE: 80,
//           ADD: 1.0,
//           EP: 0.3,
//         },
//         traitements: ['Lunettes', 'Basse vision'],
//         matiere: 'Verre organique',
//         port: 'Normal',
//         label: 'Ophtalmologie',
//         createdAt: '2024-10-20T10:00:00Z',
//         updatedAt: '2024-10-20T10:00:00Z',
//       },
//       montantTotal: 120,
//       montantPaye: 100,
//       resteAPayer: 20,
//       dateVente: '2024-10-25T14:30:00Z',
//       statutPaiement: 'partiel',
//       reductions: [
//         {
//           description: 'Remise client fidélité',
//           montant: 10,
//         },
//       ],
//     },
//     {
//       _id: 'vente2',
//       client: {
//         _id: 'patient2',
//         name: 'Sarah',
//         surname: 'Connor',
//         birthdate: '1979-02-16',
//         telephone: '555987654',
//         email: 'sarah.connor@example.com',
//       },
//       clientNonEnregistre: null,
//       articles: [
//         {
//           monture: {
//             _id: 'monture2',
//             brand: 'Oakley',
//             model: 'OO9208',
//             quantity: 5,
//           },
//           quantite: 1,
//           prixUnitaire: 150,
//           remise: 15,
//         },
//       ],
//       ordonnance: {
//         _id: 'ordonnance2',
//         patient: 'patient2',
//         date: '2024-10-22',
//         oeilDroit: {
//           SPH: -2.0,
//           CYL: -1.0,
//           AXE: 100,
//           ADD: 1.5,
//           EP: 0.2,
//         },
//         oeilGauche: {
//           SPH: -1.75,
//           CYL: -0.75,
//           AXE: 95,
//           ADD: 1.25,
//           EP: 0.25,
//         },
//         traitements: ['Lunettes', 'Astigmatisme'],
//         matiere: 'Verre minéral',
//         port: 'Détente',
//         label: 'Ophtalmologie',
//         createdAt: '2024-10-22T11:00:00Z',
//         updatedAt: '2024-10-22T11:00:00Z',
//       },
//       montantTotal: 150,
//       montantPaye: 135,
//       resteAPayer: 15,
//       dateVente: '2024-10-26T10:00:00Z',
//       statutPaiement: 'partiel',
//       reductions: [
//         {
//           description: 'Remise sur modèle',
//           montant: 15,
//         },
//       ],
//     },
//     {
//       _id: 'vente3',
//       client: null,
//       clientNonEnregistre: {
//         nom: 'Tom',
//         contact: '5554567890',
//       },
//       articles: [
//         {
//           monture: {
//             _id: 'monture1',
//             brand: 'Ray-Ban',
//             model: 'RB2132',
//             quantity: 10,
//           },
//           quantite: 1,
//           prixUnitaire: 120,
//           remise: 5,
//         },
//       ],
//       ordonnance: null,
//       montantTotal: 120,
//       montantPaye: 120,
//       resteAPayer: 0,
//       dateVente: '2024-10-27T09:15:00Z',
//       statutPaiement: 'payé',
//       reductions: [],
//     },
//   ];
  


// Fonctions API simulées
const api = {
  getVentes: obtenirToutesLesVentes,
  getOrdonnances: getAllOrdonnances,
  getMontures: getAllMontures,
};







function VentePage() {

const navigate = useNavigate()

    const [confirmDel, setConfirmDel] = useState(false);
    const [venteToDel, setVenteToDel] = useState(null);
    const [mode, setMode] = useState(CREATE_MODE);
    const [inFormVente, setInFormVente] = useState(null);
    const [showVenteForm, setShowVenteForm] = useState();
    const [inFormProcess, setInFormProcess] = useState({error:"", loading:false, success:""})
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
          setInFormProcess({ error: error.message || "erreur lors de la création de la monture", success: null, loading: false })
        }
      
      }
    
      useEffect(()=>{
        if(inFormProcess.success){
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
    
      }},[inFormProcess, venteDeleteProcess])
    
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
        inFormProcess={inFormProcess}
        inFormVente={inFormVente}
        mode={mode}
        showModal={showVenteForm}
        onCreate={onSaveVente}
        onUpdate={onUpdateVente}
        onClose={()=>handleCloseVenteForm()}
        
        />
      </VenteZone>
     
      <DeleteRessourceDialogue title="suppression Monture" onDelete={()=>onDeleteVente()}  open={confirmDel} onClose={hideDelConfirm} ressourceName="Vente"  />
    </Box>
  );
}

export default VentePage;
