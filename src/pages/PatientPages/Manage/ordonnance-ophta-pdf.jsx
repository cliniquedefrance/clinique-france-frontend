import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { calculerAge } from '../../../utils/helpers';
import { getOrdonnanceById } from './ordonnance.api';

// Styles pour la mise en page
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  image: {
    height: 50,
    width: 50,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: '2px solid #000',
  },
  section: {
    margin: 10,
    width: "100%"
  },
  row: {
    flexDirection: 'row',
    borderBottom: '0.5px solid #000',
  },
  cell: {
    flex: 1,
    border: '0.5px solid #000',
    padding: 3,
    textAlign: 'center',
  },
  checkbox: {
    fontFamily: 'Courier',
  },
});

function OrdonnanceOphtaPDF() {
  const { id } = useParams();
  const [ordonnance, setOrdonnance] = useState(null);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordoData = await getOrdonnanceById(id);
        if (ordoData) {
          setOrdonnance(ordoData);
          setPatient(ordoData.patient);
          setError(null);
        } else {
          setError("Erreur ordonnance non reconnue, veuillez imprimer à partir de la page du patient");
        }
      } catch (_err) {
        setError("Erreur non reconnue");
        console.error(_err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", minWidth: "100vw" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (loading && !error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", minWidth: "100vw" }}>
        <Spinner />
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 10);
  };

  return (
    <PDFViewer>
      <Document title={`Ordonnance-ophta-${patient?.name}-${formatDate(ordonnance?.date)}`} author='Gateway force' >
        <Page style={styles.page} orientation="landscape">
          {/* En-tête */}
          <View style={styles.header}>
            <View style={{flexDirection:"row", gap:2, alignItems:'center'}}>
              <Image style={styles.image} src="/favicon.png" />
              <Text style={{fontSize:"24px", fontWeight:"bold"}}>Clinique France</Text>
            </View>
            
            <View>
              
              <Text>Poste Central, Yaoundé</Text>
              <Text>BP 1000 Yaoundé-Cameroun - Tel 679 77 04 64 - 695 85 27 12</Text>
            </View>
          </View>

          {/* Informations Patient */}
          <View style={[styles.section, { gap: 5 }]}>
            <Text>NOM ET PRENOM  : {`${patient?.name.toUpperCase()} ${patient?.surname.toUpperCase()}`}</Text>
            <Text>AGE  : {calculerAge(patient?.birthdate)} ans</Text>
            <Text>DATE: {new Date(ordonnance?.date).toLocaleDateString()}</Text>
            <Text>MEDECIN : {`${ordonnance?.medecin?.toUpperCase()}`}</Text>
            <Text style={{ marginVertical: 10, textAlign: 'center', fontWeight: 'bold', fontSize: '23px' }}>Ordonnance de verre correcteur</Text>
          </View>

          {/* Tableau Verres Correcteurs */}
          <View style={styles.row}>
            <Text style={styles.cell}>Oeil</Text>
            <Text style={styles.cell}>SPH</Text>
            <Text style={styles.cell}>CYL</Text>
            <Text style={styles.cell}>AXE</Text>
            <Text style={styles.cell}>ADD</Text>
            <Text style={styles.cell}>EP</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Droit</Text>
            <Text style={styles.cell}>{ordonnance?.oeilDroit?.SPH}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilDroit?.CYL}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilDroit?.AXE}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilDroit?.ADD}</Text>
            <Text style={styles.cell}>{`${ordonnance?.oeilDroit?.EP}${ordonnance?.oeilDroit?.EP?'mw':""}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Gauche</Text>
            <Text style={styles.cell}>{ordonnance?.oeilGauche?.SPH}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilGauche?.CYL}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilGauche?.AXE}</Text>
            <Text style={styles.cell}>{ordonnance?.oeilGauche?.ADD}</Text>
            <Text style={styles.cell}>{`${ordonnance?.oeilGauche?.EP}${ordonnance?.oeilGauche?.EP?'mw':""}`}</Text>
          </View>

          {/* Options de Traitements, Verres, et Matières */}
          <View style={[styles.section, { padding: "10px", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }]}>
           
           
           {ordonnance?.traitements?.lenght !== 0 && <View>
              <Text>Traitements:</Text>
              {ordonnance?.traitements?.map((t, index) => (
                <Text key={index} style={styles.checkbox}>{t}</Text>
              ))}
            </View>} 
           

            {ordonnance?.verre &&(<View>
            <Text>Verres:</Text>
            <Text style={styles.checkbox}>{ordonnance?.verre}</Text>
           </View>)}
              
              
          
           {ordonnance?.matiere &&  <View>
              <Text>Matières:</Text>
              <Text style={styles.checkbox}>{ordonnance?.matiere}</Text>
            </View>}

            {ordonnance?.port &&  <View>
              <Text>Port:</Text>
              <Text style={styles.checkbox}>{ordonnance?.port}</Text>
            </View>
          
          }
          </View>
           

          {/* Note */}
          <View style={styles.section}>
            <Text>NB: Prière de ramener cette ordonnance à la prochaine consultation.</Text>
            <Text style={{ textAlign: 'right', width: "80%", marginRight: 30, marginTop: 50, textDecoration: "underline" }}>Le consultant</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default OrdonnanceOphtaPDF;
