import { Document, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

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
    paddingLeft: 50,
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
    alignItems: 'center'
  },
  contactImage: {
    width: 20,
    height: 20,
  }
});

export default function Proformat(){

   

    return (
        <PDFViewer>
      <Document title="Ordonnance-opht" author='Gateway force' >
        <Page size='A4' style={styles.bigPage} orientation="portrait">
          <View style={[styles.page, {opacity: 0.5, flexDirection: 'row', alignItems: 'center'}]}>
            {/* Background Image */}
            <Image src='/favicon.png' />
          </View>
          <View style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Image src="/favicon.png" style={styles.logo} />
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
                        <Text style={{flex: 1}}>Mme TINA MEREILLE</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Téléphone</Text>
                        <Text style={{flex: 1}}>600000000</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Médecin</Text>
                        <Text style={{flex: 1}}>Dr BIMBAI STEPHANE C.</Text>
                    </View>
                    <View style={{marginBottom: 4, flexDirection: 'row'}}>
                        <Text style={{width: 80}}>Date prescription</Text>
                        <Text style={{flex: 1}}>08/11/2024</Text>
                    </View>
                </View>

                {/* Prescription */}
                <Text style={{backgroundColor: 'black', padding: 4, width: 140, color: 'white', marginTop: 30}}>Rx Prescription</Text>
                <View style={{border: '2px solid black', marginTop: -1, paddingRight: 40}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Docteur</Text>
                        <Text style={{width: 125, padding: 2}}>Dr BIMBAI STEPHANE C.</Text>
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
                        <Text style={styles.cell}>+0,50</Text>
                        <Text style={styles.cell}>-0,75</Text>
                        <Text style={styles.cell}>60</Text>
                        <Text style={styles.cell}>+1.75</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{width: 60, padding: 2}}>Rx Expired</Text>
                        <Text style={{width: 125, padding: 2}}>07/11/2025</Text>
                        <Text style={styles.cell}>OG</Text>
                        <Text style={styles.cell}>+0,25</Text>
                        <Text style={styles.cell}>-0,25</Text>
                        <Text style={styles.cell}>50</Text>
                        <Text style={styles.cell}>+1,75</Text>
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
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                    <Text style={{marginBottom: 3}}>BENETTON</Text>
                                    <Text>BEO1074 281 55/19 140</Text>
                                </View>
                                <Text style={{flex: 3}}>1</Text>
                                <Text style={{flex: 4}}>45000</Text>
                                <Text style={{flex: 1}}>0</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>45000</Text>
                                </View>
                            </View>
                            <Text style={{fontWeight: 'bold', paddingVertical: 15}}>Verres</Text>
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>OD: </Text>PROGRESSIFS PHOTO</Text>
                                    <Text>ORGANIQUE+AR+BLUE P</Text>
                                </View>
                                <Text style={{flex: 3}}>1</Text>
                                <Text style={{flex: 4}}>30000</Text>
                                <Text style={{flex: 1}}>0</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>30000</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                                <View style={[styles.cellSpace,{width: '47%'}]}>
                                    <Text style={{marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>OG: </Text>PROGRESSIFS PHOTO</Text>
                                    <Text>ORGANIQUE+AR+BLUE P</Text>
                                </View>
                                <Text style={{flex: 3}}>1</Text>
                                <Text style={{flex: 4}}>30000</Text>
                                <Text style={{flex: 1}}>0</Text>
                                <View style={{flex: 5, textAlign: 'right'}}>
                                    <Text style={{marginRight: 30}}>30000</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.detailResult}>
                            <View style={{flexDirection: 'row', margin: 0}}>
                                <Text style={[styles.detailResultCell,{flex: 3}]}>Total HT</Text>
                                <Text style={[styles.detailResultCell,{flex: 4}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 1}]}> </Text>
                                <Text style={[styles.detailResultCell,{flex: 5, textAlign: 'right'}]}>105 000</Text>
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
                                <Text style={[styles.detailResultCell,{flex: 5, textAlign: 'right'}]}>105 000</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={{fontWeight: 'bold', marginTop: 20}}>Arreté cette proforma à la somme de cent cinq mille Franc CFA</Text>
            </View>
            <Image 
                src='/favicon.png'
                style={{width: 100, height: 100, marginLeft: 'auto', marginRight: 70}}
            />
            <View style={styles.footer}>
                <View style={styles.contact}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src='/favicon.png' style={styles.contactImage} />
                            <Text>Clinique de France</Text>
                        </View>
                        <View style={styles.contactBox}>
                            <Image src='/favicon.png' style={styles.contactImage} />
                            <Text>sante@cliniquedefrance.com</Text>
                        </View>
                    </View>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src='/favicon.png' style={styles.contactImage} />
                            <Text>www.cliniquedefrance.com:fr</Text>
                        </View>
                        <View style={styles.contactBox}>
                            <Image src='/favicon.png' style={styles.contactImage} />
                            <Text>+237 689 254 161 / 652 151 976</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.contactBox}>
                            <Image src='/favicon.png' style={styles.contactImage} />
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
