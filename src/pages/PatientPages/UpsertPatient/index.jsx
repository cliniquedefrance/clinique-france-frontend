import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import FormGenerator from '../../../layouts/FormGenerator';
import { patientCreateOrEdite } from '../../../utils/data';
import getAllCivilities from '../../../redux/civility/actions';
import { getAllSpecialities } from '../../../redux/speciality/actions';
import {  getAllPatients, postPatient, updatePatient } from '../../../redux/patient/actions';
import { UPDATE_PATIENT_FINISHED } from '../../../redux/patient/types';

const patientAPIformatter = (data) => ({
  civility: data?.civility?._id,
  name: data.name,
  surname: data.surname,
  birthdate: moment(data.birthdate).format('YYYY-MM-DD'),
  telephone: data.telephone,
  email: data.email,
  initiales: data.initiales,
  active: data.active ? 1 : 2,
  rights: data?.rights?.length > 0 ? data?.rights[0] : null,
  _id: data._id,
});

function CreatePatient() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const patients = useSelector((state) => state.Patient.patients);
  const updatingPatient = useSelector((state) => state.Patient.UpdatingPatient)
  const errorUpdatingPatient = useSelector((state) => state.Patient.errorUpdatingPatient)
  const updatePatientCompleted = useSelector((state) => state.Patient.updatePatientCompleted);
  const [success, setSuccess] = useState(false)
  const [showingSuccess, setShowingSuccess] = useState(false)

  
  const [launchPatients, setLaunchPatients] = useState(true);
  const [patientToUpdate, setPatientToUpdate] = useState({});
  const [data] = useState(patientCreateOrEdite);

  const navigate = useNavigate()

  useEffect(() => {

    const processSuccess = !updatingPatient && !errorUpdatingPatient && updatePatientCompleted;
    if (processSuccess) {
      setSuccess(true)
      setShowingSuccess(true)
      setTimeout(() => {
        dispatch({ type: UPDATE_PATIENT_FINISHED })
        setShowingSuccess(false)
        navigate(-1)
      },2000)
     

    }
    
  },[updatingPatient,errorUpdatingPatient, updatePatientCompleted])

  useEffect(() => {
    if(patients.length === 0) dispatch(getAllPatients())
    patients.forEach((m) => {
      if (m?._id === id) {
        setPatientToUpdate(m);
        setLaunchPatients(false);
      }
    });
    dispatch(getAllCivilities());
    dispatch(getAllSpecialities());
  }, [patients]);

  if (id && launchPatients) {
    return 'launching patients';
  }


  const onEdit = () => {
    if (id) {
      return true
    }
    return false
  }

  const handlePost = (patient) => {
    if (id) {
      dispatch(updatePatient(patient));
    } else {
      dispatch(postPatient(patient));
    }
  };

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={4} mt={10} mb={20}>
      <GridItem colStart={2} colEnd={6} rowStart={1}>
        <FormGenerator
          handlePost={handlePost}
          editeData={patientAPIformatter(patientToUpdate)}
          data={data}
          onEdit={onEdit()}
          entity='patient'
          success={success}
          successMessage='Patient modifier avec succès'
          operationInterval={showingSuccess}
        />
      </GridItem>
    </Grid>
  );
}

export default CreatePatient;
