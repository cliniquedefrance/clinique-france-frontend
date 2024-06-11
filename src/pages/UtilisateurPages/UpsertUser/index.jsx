import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import getAllCivilities from '../../../redux/civility/actions';
import { getAllSpecialities } from '../../../redux/speciality/actions';
import { userCreateOrEdite } from '../../../utils/data';
import FormGenerator from '../../../layouts/FormGenerator';
import { postUser, updateUser,getAllUser } from '../../../redux/user/actions';
import { UPDATE_USER_FINISHED } from '../../../redux/user/types';

const userApiFormatter = (data) => ({
  civility: data.civility,
  name: data.name,
  surname: data.surname,
  birthdate: moment(data.birthdate).format('YYYY-MM-DD'),
  telephone: data.telephone,
  email: data.email,
  password: data.password,
  initiales: data.initiales,
  active: data.active ? 1 : 2,
  groups: data?.groups,
  _id: data._id,
});

function CreateUser() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const users = useSelector((state) => state.User.users);
  const updatingUser = useSelector((state) => state.User.updatingUser)
  const errorUpdatingUser = useSelector((state) => state.User.errorUpdatingUser)
  const updateUserCompleted = useSelector((state) => state.User.updateUserCompleted);
const [success, setSuccess] = useState(false)

  const [launchUser, setLaunchUser] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState({});
  const [data] = useState(userCreateOrEdite);


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
    dispatch(getAllCivilities());
    dispatch(getAllSpecialities());
  },[users]);

  if (id && launchUser) {
    return 'launching users';
  }

  const handlePost = (user) => {
    if (id) {
      dispatch(updateUser(user));
     // window.history.back();
    } else {
      dispatch(postUser(user));
    }
  };

  const onEdit = () => {
    if (id) {
      return true
    }
    return false
  }

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={4} mt={10} mb={20}>
      <GridItem colStart={2} colEnd={6} rowStart={1}>
        <FormGenerator
          handlePost={handlePost}
          editeData={userApiFormatter(userToUpdate)}
          data={data}
          entity='user'
          onEdit={onEdit()}
           success={success}
          successMessage='Utilisateur modifier avec succès'
        />
      </GridItem>
    </Grid>
  );
}

export default CreateUser;
