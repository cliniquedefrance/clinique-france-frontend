/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'
import Logo from '../../../assets/images/icone 512-100.jpg'
import Location from '../../../assets/images/location-dot-solid.png'
import Phone from '../../../assets/images/phone.png'
import Globe from '../../../assets/images/globe.png'
import Envelop from '../../../assets/images/envelop.png'
import { obtenirVenteParId } from '../vente.api' // A utiliser lorsque les tests seront fonctionnel

// #region Pour Tester

/* pour les champs Variables qui apparaissent dans la proforma et qui ne sont pas encore disponibles
  (comme le nom du docteur ou la date d'expiration )
   il faudra utiliser un affichage conditionnel
*/

/**
 * Récupère une vente simulée pour les tests après un délai de 3 secondes.
 * @param {string} id - L'identifiant que l'on souhaite donner à la vente (utile pour les tests sur les rapports...).
 * @param {boolean} complet - Si la vente doit inclure une ordonnance ou pas.
 * @returns {Promise<Object|null>} - Une promesse résolue avec la vente simulée après un délai.
 */
function getVente(id = "1", complet = true) {
    // Jeux de données simulés pour les montures
    const montures = {
      monture1: {
        _id: "monture1",
        brand: "Ray-Ban",
        model: "RB3016 Clubmaster",
        quantity: 5,
        isInStock: true,
      },
      monture2: {
        _id: "monture2",
        brand: "Oakley",
        model: "OX8046 Holbrook",
        quantity: 10,
        isInStock: true,
      },
      monture3: {
        _id: "monture3",
        brand: "Gucci",
        model: "GG0028O",
        image: {
          url: "https://example.com/images/monture3.jpg",
          altText: "Gucci GG0028O",
        },
        quantity: 0,
        isInStock: false,
      },
    };
  
    return new Promise((resolve) => {
      setTimeout(() => {
        if (complet) {
          resolve({
            _id: id,
            client: {
              _id: "patient1",
              name: "Donald Tromp",
              email: "donaldotrumpo@outlook.us",
              telephone: "697852712",
            },
            articles: [
              {
                monture: montures.monture1,
                quantite: 1,
                prixUnitaire: 100,
                remise: 10,
              },
              {
                monture: montures.monture2,
                quantite: 2,
                prixUnitaire: 80,
                remise: 5,
              },
            ],
            ordonnance: {
              _id: "ordonnance1",
              date: "2024-11-20",
              oeilDroit: { SPH: "-2.00", CYL: "-0.50" },
              oeilGauche: { SPH: "-1.50", CYL: "-0.75" },
              traitements: ["Anti-reflet"],
            },
            ordonnancePrixOD: 50,
            ordonnancePrixOG: 60,
            montantTotal: 370, 
            montantPaye: 100,
            resteAPayer: 270,
            dateVente: "2024-11-21",
            statutPaiement: "partiel",
          });
        } else {
          resolve({
            _id: id,
            clientNonEnregistre: {
              nom: "Balboa Felix",
              contact: "0123456899",
            },
            articles: [
              {
                monture: montures.monture2,
                quantite: 1,
                prixUnitaire: 80,
                remise: 0,
              },
              {
                monture: montures.monture3,
                quantite: 3,
                prixUnitaire: 150,
                remise: 20,
              },
            ],
            montantTotal: 510, 
            montantPaye: 510,
            resteAPayer: 0,
            dateVente: "2024-11-21",
            statutPaiement: "payé",
          });
        }
      }, 3000);
    });
  }
  
  
  

// #endregion


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
      <Document title="Proforma-opht" author='Gateway force' >
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
            <Text style={{textAlign: 'center', marginLeft: 200, marginTop: 10}}>Yaoundé le, 11 Novembre 2024</Text>
            <View style={{marginHorizontal: 75, marginTop: 10}}>

                {/* Info du patient */}
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>PROFORMA</Text>
                <Text>FC00001-2024</Text>
                <Text style={{backgroundColor: 'black', padding: 4, width: 80, color: 'white'}}>Tiers Payant</Text>
                <View style={{border: '2px solid black', marginTop: -1, width: 220}}>
                    <View style={{marginBottom: 15, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Patient</Text>
                        <Text style={{flex: 1}}>{ `${client?.name  }${  client?.surname}`}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Téléphone</Text>
                        <Text style={{flex: 1}}>{client?.telephone}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Médecin</Text>
                        <Text style={{flex: 1}}>{ordonnance?.ophtamologue?.name || "N/A"}</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Date prescription</Text>
                        <Text style={{flex: 1}}>{ordonnance?.createdAt}</Text>
                    </View>
                </View>

                {/* Prescription */}
                <Text style={{backgroundColor: 'black', padding: 4, width: 140, color: 'white', marginTop: 30}}>Rx Prescription</Text>
                <View style={{border: '2px solid black', marginTop: -1, paddingRight: 40}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Docteur</Text>
                        <Text style={{width: 125, padding: 2}}>{ordonnance?.ophtamologue?.name || "N/A"}</Text>
                        <Text style={styles.cell}>OEIL</Text>
                        <Text style={styles.cell}>Sphére</Text>
                        <Text style={styles.cell}>Cylindre</Text>
                        <Text style={styles.cell}>Axe</Text>
                        <Text style={styles.cell}>Add</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Rx date</Text>
                        <Text style={{width: 125, padding: 2}}>08/11/2024</Text>
                        <Text style={[styles.cell, {fontWeight: 'bold'}]}>OD</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.SPH}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.CYL}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.AXE}</Text>
                        <Text style={styles.cell}>{ordonnance?.oeilDroit?.ADD}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Rx Expired</Text>
                        <Text style={{width: 125, padding: 2}}>07/11/2025</Text>
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
                            <Text style={{fontWeight: 'bold', paddingBottom: 15}}>Montures</Text>
                            {vente?.articles?.map(article => (
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
                            
                            <Text style={{fontWeight: 'bold', paddingVertical: 15}}>Verres</Text>
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>OD: </Text>
                                    {
                                      ordonnance?.traitements?.map(traitement => (<Text>{traitement}</Text>))
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
                                <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>OG: </Text>
                                    {
                                      ordonnance?.traitements?.map(traitement => (<Text>{traitement}</Text>))
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
                <Text style={{fontWeight: 'bold', marginTop: 20}}>Arreté cette proforma à la somme de cent cinq mille Franc CFA</Text>
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
