import React, { useEffect, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChangePasswordComponent from '../../../components/ChangePassComp';
import { getAllPatients, updatePatient } from '../../../redux/patient/actions';
import { UPDATE_PATIENT_FINISHED } from '../../../redux/patient/types';
import { UPDATE_PRATICIEN_FINISHED } from '../../../redux/praticiens/types';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';




function ChangePasswordPatient() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const patients = useSelector((state) => state.Patient.patients);
  const [patientToUpdate, setPatientToUpdate] = useState({});


  const updatingPatient = useSelector((state) => state.Patient.UpdatingPatient)
  const errorUpdatingPatient = useSelector((state) => state.Patient.errorUpdatingPatient)
  const updatePatientCompleted = useSelector((state) => state.Patient.updatePatientCompleted);
const [success, setSuccess] = useState(false)
  
  const [launchPatient, setLaunchPatient] = useState(true);
 
  const navigate = useNavigate()

  useEffect(() => {

    const processSuccess = !updatingPatient && !errorUpdatingPatient && updatePatientCompleted;
    if (processSuccess) {
      setSuccess(true)
      setTimeout(() => {
        dispatch({type: UPDATE_PATIENT_FINISHED})
        navigate(-1)
      },2000)
     

    }
    
  },[updatingPatient,errorUpdatingPatient, updatePatientCompleted])

  useEffect(() => {
    dispatch({ type: UPDATE_PATIENT_FINISHED })
    dispatch({ type: UPDATE_PRATICIEN_FINISHED })
    dispatch({ type: UPDATE_USER_FINISHED })
    
  },[])
  
  useEffect(() => {
    if(patients.length === 0) dispatch(getAllPatients());
    patients.forEach((u) => {
      if (u?._id === id) {
        setPatientToUpdate(u);
        setLaunchPatient(false);
      }
    });
  },[patients]);

  if (id && launchPatient) {
    return 'launching patients';
  }

  
  
 

  const handleChangePass = (password) => {
   
    const patient = { ...patientToUpdate,password}
    dispatch(updatePatient(patient))
    
    
  }


 


  return (
    <ChangePasswordComponent
      entityType='patient'
      entity={patientToUpdate}
      handler={handleChangePass}
      onCancel={() => {
        dispatch({type:UPDATE_PATIENT_FINISHED})
        navigate(-1)
      }}
      success={success}
      
    />
  );
}

export default ChangePasswordPatient;
