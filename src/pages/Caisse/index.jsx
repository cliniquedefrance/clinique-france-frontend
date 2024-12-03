import React, { useEffect, useState } from 'react';
import { Button, Box, VStack, Heading, HStack, Divider } from '@chakra-ui/react';
import CashOperationFilter from './components/CashOperationFilter';
import CashOperationList from './components/CashOperationList';
import CashOperationSearch from './components/CashOperationSearch';
import CashOperationForm from './components/CashOperationForm';
import CashOperationZone from './components/CashOperationZone';
import { createCashOperation, getAllCashOperations, updateCashOperation } from './caisse.api';
import CashOperationNumber from './components/CashOperationNumber';
import CashOperationRefresh from './components/CashOperationRefresh';



const api = {
    // eslint-disable-next-line no-unused-vars
    getAll: async ()=> getAllCashOperations() 
}

function CashOperationPage() {
    const [showForm, setShowForm] = useState(false);
    const [operationMode, setOperationMode] = useState('create');
    const [operationData, setOperationData] = useState(null);
    const [inFormProcess, setInFormProcess] = useState({ error: "", loading: false, success: "" })
   
    const [refreshList, setRefreshList] = useState(false);

    const handleSaveOperation = async (operation) => {
        try {

            if (operationMode === 'create') {  
                    const created = await createCashOperation(operation);
                if (created) {
                    setInFormProcess({ error: null, success: "Opération enregistrée avec succès", loading: false })
                }else{
                    setInFormProcess({ error: "une erreur s'est produite", success: null, loading: false })
                }

            } else if (operationMode === "update") {
                const updated = await updateCashOperation(operationData._id, operation);
                if (updated) {
                    setInFormProcess({ error: null, success: "Opération modifier avec succès", loading: false })
                }else{
                    setInFormProcess({ error: "une erreur s'est produite", success: null, loading: false })
                }
            }

        } catch (error) {
            setInFormProcess({ error: error.message || "erreur lors de lors de l'enregistrement de l'opération", success: null, loading: false })
        } 
    }

    const handleCancelForm = () => {

        setOperationMode('create');
        setOperationData(null);
        setInFormProcess({ error: "", loading: false, success: "" })
        setShowForm(false);
    };

    const handleEditOperation = (operation) => {
        setOperationMode('update');
        setOperationData(operation);
        setShowForm(true);
    };

    const handleViewOperation = (operation) => {
        setOperationMode('view');
        setOperationData(operation);
        setShowForm(true);
    }


    const actions = [
        {
            label: "mettre à jour",
            action: (operation) => handleEditOperation(operation),
        },
        {
            label: "détails",
            action: (operation) => handleViewOperation(operation)
        }
    ]


    useEffect(()=>{
        if(inFormProcess.success){
            const test = setTimeout(()=> {
              setRefreshList(prev => !prev)
              setShowForm(false)
              setInFormProcess(prev=> ({
                ...prev,
                success:""
      
              }))
              clearTimeout(test)
          }, 2000)}

    },[inFormProcess])

    return (
        <Box p={8}>
            <Heading as="h1" mb={4}>
                Gestion de la Caisse
            </Heading>

            <CashOperationZone api={api} r={refreshList} >
                <VStack align="start" spacing={4} mb={6} width="100%">
                    <CashOperationSearch />
                    
                    <HStack spacing={4} align="center" mb={4}>
                        <CashOperationFilter />
                        <Button colorScheme='blue' minW={200} onClick={() => { setOperationMode('create'); setShowForm(true); }}>Lancer une opération</Button>
                    </HStack>

                </VStack>
                <Divider mb={4} />
                <HStack spacing={4}>
                    <CashOperationNumber />
                    <CashOperationRefresh />
                </HStack>

                <CashOperationList  actions={actions} />
                <Divider mt={4} mb={4} />
                {/* <VentePagination /> */}

                <CashOperationForm
                    onCreate={handleSaveOperation}
                    onUpdate={handleSaveOperation}
                    onClose={handleCancelForm}
                    mode={operationMode}
                    show={showForm}
                    inFormOperation={operationData}
                    inFormProcess={inFormProcess}
                />
            </CashOperationZone>

            {/* <DeleteRessourceDialogue title="suppression Monture" onDelete={()=>onDeleteVente()}  open={confirmDel} onClose={hideDelConfirm} ressourceName="Vente"  /> */}
        </Box>

    );
}

export default CashOperationPage;
