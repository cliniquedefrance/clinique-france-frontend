import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PatientPage from '../../../pages/PatientPages';
import CreatePatient from '../../../pages/PatientPages/UpsertPatient';
import ChangePasswordPatient from '../../../pages/PatientPages/ChangePassword';
import ManagePatient from '../../../pages/PatientPages/Manage';


function PatientRouter() {
  return (
    <Routes>
      <Route path="/" element={<PatientPage />} />
      <Route path="/upsert/:id?" element={<CreatePatient />} />
      <Route path="/change-pwd/:id?" element={<ChangePasswordPatient />} />
      <Route path="/manage/:id?" element={<ManagePatient />} />
      </Routes>
 
    
  );
}

export default PatientRouter;
