/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {NumberToLetter} from '@mandarvl/convertir-nombre-lettre'
import dayjs from 'dayjs'
import localizedFormat from "dayjs/plugin/localizedFormat"
import updateLocale from "dayjs/plugin/updateLocale"
import { Spinner } from '@chakra-ui/react'
import Logo from '../../../assets/images/icone 512-100.jpg'
import Location from '../../../assets/images/location-dot-solid.png'
import Phone from '../../../assets/images/phone.png'
import Globe from '../../../assets/images/globe.png'
import Envelop from '../../../assets/images/envelop.png'
import { obtenirVenteParId } from '../vente.api' // A utiliser lorsque les tests seront fonctionnel
import 'dayjs/locale/fr'

function formatDate(date) {
  if (!date) return ""; // Si la date est null ou undefined
  const parsedDate = new Date(date); // Convertir en objet Date
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedDate)) return "Date invalide"; // Gérer les cas où la date est invalide
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
}

function addOneYearMinusOneDay(date = new Date()) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1); // Ajouter un an
  newDate.setDate(newDate.getDate() - 1); // Soustraire un jour
  return newDate;
}


const styles = StyleSheet.create({
  bigPage: {
    fontSize: 10,
  },
  page: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 50,
    marginTop: 50,
    gap: 15
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    flex: 1
  },
  headerText: {
    textAlign: 'center',
    flex: 1,
    borderBottom: '1px solid blue',
    paddingBottom: 5
  },
  logo: {
    width: 70,
    height: 70,
  },
  cell: {
    flex: 1,
    padding: 2,
    textAlign: 'center'
  },
  cellSpace: {
    padding: 2,
  },
  detailResult: {
    width: '53%',
    margin: 0,
    marginLeft: 'auto',
    borderLeft: '1px solid black'

  },
  detailResultCell: {
    border: '1px solid black',
    fontWeight: 'bold',
    margin: 0,
    padding: 2
  },
  footer:{
    position: 'absolute',
    bottom: 5,
    left: 0,
    height: 80,
    width: '100%',
    backgroundColor: 'blue'
  },
  contact: {
    width: '65%',
    position: 'absolute',
    paddingLeft: 40,
    top: 0,
    left: 0,
    borderBottomRightRadius: 40,
    height: 70,
    backgroundColor: 'white',
    transform: 'translateY(-35%)',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    color: 'blue'
  },
  contactBox: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  contactImage: {
    width: 15,
  }
});


dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.updateLocale("fr", null); 


export default function Proformat(){

    const { id } = useParams();
    const [vente, setVente] = useState(null);
    const [client, setClient] = useState(null);
    const [ordonnance, setOrdonnance] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const venteData = await obtenirVenteParId(id);
          console.log('Vente récupérée : ',venteData);
          if (venteData) {
            setVente(venteData);
            if(venteData.client?._id){ // si la vente concerne un patient
                setOrdonnance(venteData.ordonnance); // il y'a une ordonnance
                setClient(venteData.client); // et les données du patient sont dans client
                setError(null);
            }else if(vente?.clientNonEnregistre) { // si la vente ne concerne pas directement un patient,
                setOrdonnance(null);  //  alors il n'ya pas d'ordonnance 
                setClient(vente.clientNonEnregistre); // le champ clientNonEnregistre a les propriétés nom et contact
                setError(null);
            }else{
                setError("Client Non Reconnu")
            }
            setError(null);
          } else {
            setError("Erreur lors de la récupération des données");
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
  
    const isPatient = !!ordonnance;
   

    return (
        <PDFViewer>
      <Document title="CLINIQUE FRANCE PROFORMA" author='Gateway force' >
        <Page size='A4' style={styles.bigPage} orientation="portrait">
          <View style={[styles.page, {opacity: 0.5, flexDirection: 'row', alignItems: 'center'}]}>
            {/* Background Image */}
            <Image src={Logo} style={{width: '100%'}} />
          </View>
          <View style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Image src={Logo} style={styles.logo} />
                </View>
                <View style={[styles.headerSection, {color: 'blue'}]} >
                    <View>
                        <Text>CLINIQUE DE</Text>
                        <Text>FRANCE</Text>
                    </View>
                    <View style={styles.headerText}>
                        <Text>Vivez votre expérience médicale autrement !</Text>
                    </View>
                </View>
            </View>
            <Text style={{textAlign: 'center', marginLeft: 200, marginTop: 10}}>{`Yaoundé le, ${dayjs().locale("fr").format("D MMMM YYYY")}`}</Text>
            <View style={{marginHorizontal: 75, marginTop: 10}}>

                {/* Info du patient */}
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>PROFORMA</Text>
                <Text>{' '}</Text>
                <Text style={{backgroundColor: 'black', padding: 4, width: 80, color: 'white'}}>Tiers Payant</Text>
                <View style={{border: '2px solid black', marginTop: -1, width: 220}}>
                    <View style={{marginBottom: 15, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Patient</Text>
                        <Text style={{flex: 1, fontWeight:"bolder",fontSize: 13, }}>{ `${client?.name?.toUpperCase()  }  ${  client?.surname?.toUpperCase() }`}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Téléphone</Text>
                        <Text style={{flex: 1}}>{client?.telephone}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Médecin</Text>
                        <Text style={{flex: 1}}>{ordonnance?.medecin || "N/A"}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Date prescription</Text>
                        <Text style={{flex: 1}}>{dayjs(new Date(ordonnance?.date)).locale("fr").format("D MMMM YYYY")}</Text>
                    </View>
                </View>

                {/* Prescription */}
                <Text style={{backgroundColor: 'black', padding: 4, width: 140, color: 'white', marginTop: 30}}>Rx Prescription</Text>
                <View style={{border: '2px solid black', marginTop: -1, paddingRight: 40}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Docteur</Text>
                        <Text style={{width: 125, padding: 2}}>{ordonnance?.medecin|| "N/A"}</Text>
                        <Text style={styles.cell}>OEIL</Text>
                        <Text style={styles.cell}>Sphére</Text>
                        <Text style={styles.cell}>Cylindre</Text>
                        <Text style={styles.cell}>Axe</Text>
                        <Text style={styles.cell}>Add</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Rx date</Text>
                        <Text style={{width: 125, padding: 2}}>{formatDate(ordonnance?.date)}</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>OD</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.SPH}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.CYL}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.AXE}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.ADD}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Rx Expired</Text>
                        <Text style={{width: 125, padding: 2}}>{formatDate(addOneYearMinusOneDay(ordonnance?.date))}</Text>
                        <Text style={styles.cell}>OG</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilGauche?.SPH}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilGauche?.CYL}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilGauche?.AXE}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilGauche?.ADD}</Text>
                    </View>
                </View>

                {/* Detail du proforma */}
                <Text style={{backgroundColor: 'black', padding: 4, width: 80, color: 'white', marginTop: 10}}>Details</Text>
                <View style={{marginTop: -1}}>
                    <View style={{padding: '2 4', flexDirection: 'row', border: '1px solid black'}}>
                        <Text style={{width: '47%'}}>DESIGNATION</Text>
                        <Text style={{flex: 3}}>QTE</Text>
                        <Text style={{flex: 4}}>P.U.H.T</Text>
                        <Text style={{flex: 1}}>%</Text>
                        <Text style={{flex: 5}}>MONTANT H.T</Text>
                    </View>
                    <View style={{border: '2px solid black', marginTop: -1}}>
                        <View style={{borderBottom: '1px solid black', padding: '2 2 0 2'}}>
                            {vente?.articles?.length && <Text style={{fontWeight: 'bold', paddingBottom: 15}}>Montures</Text>}
                            { vente?.articles?.length &&  vente?.articles?.map(article => (
                                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                    <Text style={{marginBottom: 3}}>{article?.monture?.brand}</Text>
                                    <Text>{article?.monture?.model}</Text>
                                </View>
                                <Text style={{flex: 3}}>{article?.quantite}</Text>
                                <Text style={{flex: 4}}>{article?.prixUnitaire}</Text>
                                <Text style={{flex: 1}}>{article?.remise || 0}</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>{(article?.quantite * article?.prixUnitaire)-(article?.quantite * article?.prixUnitaire)*(article?.remise||0)/100}</Text>
                                </View>
                            </View>
                              ))}
                            
                            <Text style={{fontWeight: 'bold', paddingVertical: 2}}>Verres</Text>
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%', paddingRight:10}]}>

                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold', textDecoration:"underline"}}>Traitements: </Text><Text>{"\n"}</Text>
                                    {
                                      ordonnance?.traitements?.map(traitement => (<Text>{traitement}<Text>{' '}</Text></Text>))
                                    }
                                    </Text>
                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold',textDecoration:"underline"}}>Verre: </Text><Text>{"\n"}</Text>
                                    {
                                      ordonnance?.verre
                                    }
                                    </Text>
                                   
                                </View>
                                <Text style={{flex: 3}}>1</Text>
                                <Text style={{flex: 4}}>{vente?.ordonnancePrixOD}</Text>
                                <Text style={{flex: 1}}>0</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>{vente?.ordonnancePrixOD}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                  <Text style={{marginBottom: 3}}><Text style={{fontWeight:900, textDecoration:"underline"}}>Matière: </Text><Text>{"\n"}</Text>
                                    {
                                      ordonnance?.matiere
                                    }
                                    </Text>
                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold', textDecoration:"underline"}}>Port: </Text><Text>{"\n"}</Text>
                                    {
                                      ordonnance?.port
                                    }
                                    </Text>
                                </View>
                                <Text style={{flex: 3}}>1</Text>
                                <Text style={{flex: 4}}>{vente?.ordonnancePrixOG}</Text>
                                <Text style={{flex: 1}}>0</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>{vente?.ordonnancePrixOG}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.detailResult}>
                            <View style={{flexDirection: 'row', margin: 0}}>
                                <Text style={[styles.detailResultCell,{flex: 3}]}>Total HT</Text>
                                <Text style={[styles.detailResultCell,{flex: 4}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 1}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 5, textAlign: 'right'}]}>{vente?.montantTotal}</Text>
                            </View>
                            <View style={{flexDirection: 'row', margin: 0}}>
                                <Text style={[styles.detailResultCell,{flex: 3}]}>Remise</Text>
                                <Text style={[styles.detailResultCell,{flex: 4}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 1}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 5, textAlign: 'right'}]}>-</Text>
                            </View>
                            <View style={{flexDirection: 'row', margin: 0}}>
                                <Text style={[styles.detailResultCell,{flex: 3}]}>Net</Text>
                                <Text style={[styles.detailResultCell,{flex: 4}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 1}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 5, textAlign: 'right'}]}>{vente?.montantTotal}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={{fontWeight: 'bold', marginTop: 20}}>{`Arreté cette proforma à la somme de ${NumberToLetter(Number(vente?.montantTotal || 0))} Franc CFA`}</Text>
            </View>
            {/*
                <Image 
                src='/favicon.png'
                style={{width: 100, height: 100, marginLeft: 'auto', marginRight: 70}}
            />
            */}
            <View style={styles.footer}>
                <View style={styles.contact}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src={Logo} style={{width : 25, marginLeft: -5}} />
                            <Text>Clinique de France</Text>
                        </View>
                        <View style={styles.contactBox}>
                            <Image src={Envelop} style={styles.contactImage} />
                            <Text>sante@cliniquedefrance.com</Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src={Globe} style={styles.contactImage} />
                            <Text>www.cliniquedefrance.com:fr</Text>
                        </View>
                        <View style={styles.contactBox}>
                            <Image src={Phone} style={styles.contactImage} />
                            <Text>+237 689 254 161 / 652 151 976</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src={Location} style={styles.contactImage} />
                            <Text>Poste centrale face cathédrale</Text>
                        </View>
                 </View>
                 </View>
            </View>
          </View>
        </Page>
      </Document>   
    </PDFViewer>
    )
}
