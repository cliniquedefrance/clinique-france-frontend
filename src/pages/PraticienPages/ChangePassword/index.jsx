import React, { useEffect, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChangePasswordComponent from '../../../components/ChangePassComp';
import { getAllPraticiens, updatePraticien } from '../../../redux/praticiens/actions';
import { UPDATE_PRATICIEN_FINISHED } from '../../../redux/praticiens/types';




function ChangePasswordPraticien() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [pratToUpdate, setPratToUpdate] = useState({});
  const praticiens = useSelector((state) => state.Praticiens.praticiens);
  const updatingPraticien = useSelector((state) => state.Praticiens.UpdatingPraticien)
  const errorUpdatingPraticien = useSelector((state) => state.Praticiens.errorUpdatingPraticien)
  const updatePraticienCompleted = useSelector((state) => state.Praticiens.updatePraticienCompleted);
  const [success, setSuccess] = useState(false)
  
  const [showingSuccess, setShowingSuccess] = useState(false)

  const navigate = useNavigate()

  const handleChangePass = async (password) => {
   
    const praticien = { ...pratToUpdate, password }
      dispatch(updatePraticien(praticien))
    
  }

  const [launchPrat, setLaunchPrat] = useState(true);
  


  useEffect(() => {

    const processSuccess = !updatingPraticien && !errorUpdatingPraticien && updatePraticienCompleted;
    if (processSuccess) {
      setSuccess(true)
      setShowingSuccess(true)
      setTimeout(() => {
        dispatch({type: UPDATE_PRATICIEN_FINISHED})
        setShowingSuccess(false)
        navigate(-1)
      },3000)
      
    }
    
  },[updatingPraticien,errorUpdatingPraticien, updatePraticienCompleted])

  useEffect(() => {
    if(praticiens.length === 0) dispatch(getAllPraticiens());
    praticiens.forEach((p) => {
      if (p?._id === id) {
        setPratToUpdate(p);
        setLaunchPrat(false);
      }
    });
  }, [praticiens]);

  if (id && launchPrat) {
    return 'launching praticiens';
  }

 


  return (
    <ChangePasswordComponent
      entityType='pratician'
      entity={pratToUpdate}
      handler={handleChangePass}
      onCancel={() => {
        dispatch({type: UPDATE_PRATICIEN_FINISHED})
        navigate(-1)
      }}
        success={success}
      operationInterval={showingSuccess}
     
    />
  );
}

export default ChangePasswordPraticien;
