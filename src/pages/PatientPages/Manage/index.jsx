/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert, AlertIcon, Box, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Flex, Grid, GridItem, HStack, VStack, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

import { getAllPatients } from '../../../redux/patient/actions';
import { UPDATE_PATIENT_FINISHED } from '../../../redux/patient/types';
import { UPDATE_PRATICIEN_FINISHED } from '../../../redux/praticiens/types';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';
import { useDimensions } from '../../../hooks/useDimensions';
import styles from './style';
import user from '../../../assets/images/user.png';
import { renderObjectWithoutField } from '../../../utils/helpers';
import Ophtamology from '../../../components/Ordonances/Ophtamology';






function ManagePatient() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { innerWidth } = useDimensions();
  const patients = useSelector((state) => state.Patient.patients);
  const [patientToManage, setPatientToManage] = useState({});

  const [ordoOpened, SetOrdoOpened] = useState(false);

  const [test, setTest] = useState("nuull");




  const [launchPatient, setLaunchPatient] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    dispatch({ type: UPDATE_PATIENT_FINISHED })
    dispatch({ type: UPDATE_PRATICIEN_FINISHED })
    dispatch({ type: UPDATE_USER_FINISHED })

  }, [])

  useEffect(() => {
    if (patients.length === 0) dispatch(getAllPatients());
    patients.forEach((u) => {
      if (u?._id === id) {
        setPatientToManage(u);
        setLaunchPatient(false);
      }
    });
  }, [patients]);

  if (id && launchPatient) {
    return 'launching patients';
  }

  const bgColor = "#2c3e50"

  const { name, civility, surname, birthdate, telephone, email, initiales, photo } = patientToManage;




  return (
    <Flex style={styles.formContainer} backgroundColor={bgColor} overflow="hidden" >
      <HStack width="100%" flex={1} justifyContent="space-between" alignItems="center" gap="2px">
        <VStack padding={2} backgroundColor="whitesmoke" height="100%" position='relative' flex={1 / 4} justifyContent="center" alignItems="center" >
          <img
            src={photo || user}
            alt=""
            width="72px"
            height="72px"

          />
          <p style={{ textAlign: "center" }}>
            {`${civility?.abreviation || "M."} ${name} ${surname}`}
          </p>
          <p>
            {email}
          </p>
          <p>
            {telephone}
          </p>


          <Button

            // isLoading={processLoading || operationInterval}
            // w="full"
            colorScheme="red"
            // type='submit' 
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>

        </VStack>



        <VStack backgroundColor="whitesmoke" flex={1} height="100%">

          <Tabs isFitted variant='unstyled' width="100%">
            <TabList mb='1em' borderBottomColor={bgColor} borderBottomWidth="2px" borderTopColor="blue.500" borderTopWidth="2px">
              <Tab _selected={{ color: 'white', bg: bgColor }}>Détails du patient</Tab>
              <Tab _selected={{ color: 'white', bg: bgColor }}>Ordonnances</Tab>
              <Tab _selected={{ color: 'white', bg: bgColor }}>Factures</Tab>
            </TabList>
            <TabPanels >
              <TabPanel overflow="auto" maxHeight={500}>

                <TableContainer marginBottom={50}>
                  <Table variant="striped" size='sm'>
                    <TableCaption sx={{ captionSide: "top" }}>Détails du patient</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Propriété</Th>
                        <Th>Valeur</Th>

                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.keys(renderObjectWithoutField(patientToManage, ["civility", "__v", "rights", "_id", "expoToken"])).map((p) => (
                        <Tr>
                          <Td>{p}</Td>
                          <Td>{JSON.stringify(patientToManage[p])}</Td>
                        </Tr>


                      )
                      )}

                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Propriété</Th>
                        <Th>Valeur</Th>

                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
                <HStack margin={15}>

                  <Button
                    w="full"
                    colorScheme="blue"
                    type='button'
                    onClick={() => navigate(`/content/patient/upsert/${id}`)}
                  >
                    Modifier
                  </Button>
                  <Button
                    w="full"
                    colorScheme="blue"
                    type='button'
                    onClick={() => navigate(`/content/patient/change-pwd/${id}`)}
                  >
                    Modifier le mot de passe
                  </Button>
                </HStack>

              </TabPanel>
              <TabPanel>
               
                <Button

                  // isLoading={processLoading || operationInterval}
                   w="full"
                  colorScheme="blue"
                  // type='submit' 
                  onClick={() => SetOrdoOpened(true)}
                >
                  Ajouter une Ordonnance
                </Button>
                <p>Liste des Ordonnances</p>
                <Ophtamology patient={patientToManage} onClose={()=>SetOrdoOpened(false)} isOpen={ordoOpened} onSave={(data)=>setTest(`Ordonnance enregistrées: ${  JSON.stringify(data, null, 2)}`)}/>
                <p>{test}</p>
              </TabPanel>
              <TabPanel>
           
                <Button

                  // isLoading={processLoading || operationInterval}
                   w="full"
                  colorScheme="blue"
                  // type='submit' 
                  onClick={() => console.log("ajout facture")}
                >
                  Ajouter une Facture
                </Button>
                <p>Liste des Factures</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </VStack>
      </HStack>




    </Flex>
  );
}

export default ManagePatient;
