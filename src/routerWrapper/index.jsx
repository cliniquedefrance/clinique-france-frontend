import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
import ContentRouter from './ContentRouter';
import AuthRouter from './AuthRouter';
import AppointmentPDF from '../components/pdf/appointment-pdf';
import OrdonnanceOphtaPDF from '../pages/PatientPages/Manage/ordonnance-ophta-pdf';
import Proformat from '../pages/Ventes/PDF/Proformat';



export function Protector({ children }) {
  const isVerifyingToken = useSelector(state => state.Common.isVerifyingToken);
  const isTokenValid = useSelector(state => state.Common.isTokenValid);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid && !isVerifyingToken) {
      navigate('/');
    }
  }, [isTokenValid, isVerifyingToken, navigate]);

  if (isVerifyingToken) {
    return "vérification du token";
  }
  return children;
};

function Routeur() {

 


  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRouter />} />
        <Route path="/content/*" element={ <ContentRouter />} />
        <Route path="/print-pdf" element={<AppointmentPDF />} />
        <Route path="/print/ordonnance-ophta/:id?" element={<OrdonnanceOphtaPDF />} />
        <Route path="/print/vente-proforma/:id?" element={<Proformat />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Routeur;
