/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, AlertIcon, Box, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Flex, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';

import { getAllPatients } from '../../../redux/patient/actions';
import { UPDATE_PATIENT_FINISHED } from '../../../redux/patient/types';
import { UPDATE_PRATICIEN_FINISHED } from '../../../redux/praticiens/types';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';
import { useDimensions } from '../../../hooks/useDimensions';
import styles from './style';
import user from '../../../assets/images/user.png';
import visible from '../../../assets/images/visible.png';
import hide from '../../../assets/images/hide.png';





function ManagePatient() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { innerWidth } = useDimensions();
  const patients = useSelector((state) => state.Patient.patients);
  const [patientToManage, setPatientToManage] = useState({});




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


  return (
    <Flex style={styles.formContainer} backgroundColor={bgColor} >
      <HStack width="100%" flex={1} justifyContent="space-between" alignItems="center" gap="2px">
        <VStack backgroundColor="whitesmoke" height="100%" position='relative' flex={1 / 4} justifyContent="center" alignItems="center" >
          <img
            src={user}
            alt=""
            width="96px"
            height="96px"

          />
          <Button

            // isLoading={processLoading || operationInterval}
            w="full"
            colorScheme="blue"
            // type='submit' 
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>

        </VStack>



        <VStack backgroundColor="whitesmoke" flex={1}  height="100%">

          <Tabs  isFitted variant='unstyled' width="100%">
            <TabList mb='1em' borderBottomColor={bgColor} borderBottomWidth="2px" borderTopColor="blue.500" borderTopWidth="2px">
              <Tab _selected={{ color: 'white', bg: bgColor }}>Détails du patient</Tab>
              <Tab _selected={{ color: 'white', bg: bgColor }}>Ordonnances</Tab>
              <Tab _selected={{ color: 'white', bg: bgColor }}>Factures</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>Détails du patient</p>
              </TabPanel>
              <TabPanel>
                <p>Ordonnances</p>
              </TabPanel>
              <TabPanel>
                <p>Factures</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </VStack>
      </HStack>




    </Flex>
  );
}

export default ManagePatient;
