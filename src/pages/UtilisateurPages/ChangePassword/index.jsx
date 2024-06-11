import React, { useEffect, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ChangePasswordComponent from '../../../components/ChangePassComp';
import { getAllUser, updateUser } from '../../../redux/user/actions';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';




function ChangePasswordUser() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const users = useSelector((state) => state.User.users);

  const updatingUser = useSelector((state) => state.User.updatingUser)
  const errorUpdatingUser = useSelector((state) => state.User.errorUpdatingUser)
  const updateUserCompleted = useSelector((state) => state.User.updateUserCompleted);
const [success, setSuccess] = useState(false)

  const [userToUpdate, setUserToUpdate] = useState({});

  const [launchUser, setLaunchUser] = useState(true);
 
  const navigate = useNavigate()

  useEffect(() => {

    const processSuccess = !updatingUser && !errorUpdatingUser && updateUserCompleted;
    if (processSuccess) {
      setSuccess(true)
      setTimeout(() => {
        dispatch({type: UPDATE_USER_FINISHED})
        navigate(-1)
      },2000)
      
    }
    
  },[updatingUser,errorUpdatingUser, updateUserCompleted])

  
  useEffect(() => {
    if(users.length === 0) dispatch(getAllUser());
    users.forEach((u) => {
      if (u?._id === id) {
        setUserToUpdate(u);
        setLaunchUser(false);
      }
    });
  },[users]);

  if (id && launchUser) {
    return 'launching users';
  }

  


 

  const handleChangePass = (password) => {
   
    const user = { ...userToUpdate,password}
      dispatch(updateUser(user))
    
  }


 


  return (
    <ChangePasswordComponent
      entityType='user'
      entity={userToUpdate}
      handler={handleChangePass}
      onCancel={() => {
        dispatch({type:UPDATE_USER_FINISHED})
        navigate(-1)
      }}
      success={success}
     
    />
  );
}

export default ChangePasswordUser;
