/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { calculerAge } from '../../utils/helpers';
import { CREATE_MODE, UPDATE_MODE, VIEW_MODE } from '../../pages/PatientPages/Manage/constants';


const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};

function Ophtamology({ with: initialData, onSave, isOpen, loading, onClose, patient, onUpdate, mode, error, success, onPrint }) {
  const empty = {
    nom: patient?.name,
    medecin: '',
    age: `${calculerAge(patient?.birthdate)} ans`,
    date: '',
    oeilDroit: { SPH: '', CYL: '', AXE: '', ADD: '', EP: '' },
    oeilGauche: { SPH: '', CYL: '', AXE: '', ADD: '', EP: '' },
    traitements: [],
    verre: '',
    matiere: '',
    port: '',
  };
  const initialFormData = mode === CREATE_MODE ? empty : {
    ...initialData, 
    nom: patient?.name,
    age: `${calculerAge(patient?.birthdate)} ans`,
    date: formatDate(new Date(initialData?.date))
  };

  const [formData, setFormData] = useState(initialFormData);
  const [retry, setRetry] = useState(false); // Pour gérer l'état de réessai
  const [inactive, setInactive] = useState(false);
  const [printAfter, setPrintAfter] = useState(false)

  useEffect(() => {
    if (retry && (error || success)) {
      setRetry(false); // Réinitialise l'état de réessai une fois que l'action a été effectuée
    }
  }, [retry, error, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("oeilDroit.") || name.startsWith("oeilGauche.")) {
      const [eye, field] = name.split(".");
      const degreeValue = value && value !== "°" ? `${value.replace("°", "")}°` : ""
      setFormData((prevData) => ({
        ...prevData,
        [eye]: {
          ...prevData[eye],
          [field]: field === 'AXE' ? degreeValue : value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handlePrint = () => {
    if (onPrint) onPrint(formData);
  };

  const handleSave = async (e, printAfterSave = false) => {
    e.preventDefault();
    setPrintAfter(printAfterSave);
    if (onSave) {
      await onSave(formData, printAfterSave);
    }
  };

  const handleUpdate = async (e, printAfterUpdate = false) => {
    e.preventDefault();
    setPrintAfter(printAfterUpdate)
    setInactive(true)
    if (onUpdate) {
       await onUpdate(formData, printAfterUpdate);
    }
   // onClose();
  };

  const handleRetry = () => {
    setRetry(true);
    if (mode === CREATE_MODE) handleSave(new Event('submit'), printAfter);
    if (mode === UPDATE_MODE) handleUpdate(new Event('submit'), printAfter);
  };

  const handleModalClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  useEffect(()=>{
    if (success) {
      setInactive(true)
      const test = setTimeout(()=> {
       onClose();
        clearTimeout(test)

      },2000)
    }
  }, [success])

  useEffect(()=>{
    if(mode === CREATE_MODE || mode === UPDATE_MODE){
      setInactive(false);
    }

  }, [mode])


  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form >
          <ModalHeader>Ordonnance de Verres Correcteurs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          
            <FormControl>
              {/* Informations Générales */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                <GridItem>
                  <FormLabel>Nom et Prénom</FormLabel>
                  <Input readOnly name="nom" value={formData.nom} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>Âge</FormLabel>
                  <Input readOnly type="text" name="age" value={formData.age} onChange={handleChange} />
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel>Date</FormLabel>
                  <Input readOnly={mode===VIEW_MODE} required type="date" name="date" value={formData.date} onChange={handleChange} />
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel>Médecin</FormLabel>
                  <Input  name="medecin" value={formData.medecin} onChange={handleChange} />
                </GridItem>
              </Grid>

              {/* Section Verres Correcteurs */}
              <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
                <GridItem colSpan={5}>
                  <FormLabel>Verres Correcteurs</FormLabel>
                </GridItem>
                <GridItem><FormLabel>SPH (OD)</FormLabel><Input  readOnly={mode===VIEW_MODE} name="oeilDroit.SPH" value={formData.oeilDroit.SPH} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>CYL (OD)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilDroit.CYL" value={formData.oeilDroit.CYL} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>AXE (OD)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilDroit.AXE" value={formData.oeilDroit.AXE} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>ADD (OD)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilDroit.ADD" value={formData.oeilDroit.ADD} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>EP (OD)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilDroit.EP" value={formData.oeilDroit.EP} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>SPH (OG)</FormLabel><Input  readOnly={mode===VIEW_MODE} name="oeilGauche.SPH" value={formData.oeilGauche.SPH} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>CYL (OG)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilGauche.CYL" value={formData.oeilGauche.CYL} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>AXE (OG)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilGauche.AXE" value={formData.oeilGauche.AXE} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>ADD (OG)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilGauche.ADD" value={formData.oeilGauche.ADD} onChange={handleChange} /></GridItem>
                <GridItem><FormLabel>EP (OG)</FormLabel><Input readOnly={mode===VIEW_MODE}  name="oeilGauche.EP" value={formData.oeilGauche.EP} onChange={handleChange} /></GridItem>
              </Grid>

              {/* Traitements */}
              <FormLabel>Traitements</FormLabel>
              <Stack direction="row" flexWrap="wrap" gap={3} columnGap={5} mb={4}>
                {['Photochromique', 'Anti Reflet', 'Azur', "Teintes A, B, AB", "blue Protect"].map((traitement) => (
                  <Checkbox
                    key={traitement}
                    readOnly={mode===VIEW_MODE}
                    isChecked={formData.traitements.includes(traitement)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        traitements: e.target.checked
                          ? [...prev.traitements, traitement]
                          : prev.traitements.filter((t) => t !== traitement)
                      }));
                    }}
                  >
                    {traitement}
                  </Checkbox>
                ))}
              </Stack>

              {/* Type de Verre */}
              <FormLabel>Type de Verre</FormLabel>
              <RadioGroup
               isDisabled={mode === VIEW_MODE}
                onChange={(value) => setFormData((prev) => ({ ...prev, verre: value }))}
                value={formData.verre}
                mb={4}
              >
                <Stack direction="row">
                  <Radio value="Simple Vision">Simple Vision</Radio>
                  <Radio value="Double Foyer">Double Foyer</Radio>
                  <Radio value="Progressifs">Progressifs</Radio>
                </Stack>
              </RadioGroup>

              {/* Matière */}
              <FormLabel>Matière</FormLabel>
              <RadioGroup
               isDisabled={mode === VIEW_MODE}
                onChange={(value) => setFormData((prev) => ({ ...prev, matiere: value }))}
                value={formData.matiere}
                mb={4}
              >
                <Stack direction="row">
                  <Radio value="Organique">Organique</Radio>
                  <Radio value="Minéral">Minéral</Radio>
                  <Radio value="Polycarbonate">Polycarbonate</Radio>
                </Stack>
              </RadioGroup>

              {/* Port */}
              <FormLabel>Port</FormLabel>
              <RadioGroup
                isDisabled={mode === VIEW_MODE}
                onChange={(value) => setFormData((prev) => ({ ...prev, port: value }))}
                value={formData.port}
                mb={4}
              >
                <Stack direction="row">
                  <Radio value="Constant">Constant</Radio>
                  <Radio value="Inconstant">Inconstant</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            
          </ModalBody>
                 {/* Messages de succès ou d'erreur */}
              {error && !loading && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Erreur !</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button size="sm" colorScheme="red" onClick={handleRetry} ml={3}>
                  Réessayer
                </Button>
              </Alert>
            )}
            {success && !loading && (
              <Alert status="success" mb={4}>
                <AlertIcon />
                <AlertTitle>Succès !</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          <ModalFooter>
             

            {mode === VIEW_MODE ? (
              <Button colorScheme="blue" onClick={handlePrint} mr={3}>Imprimer</Button>
            ) : (
              <>
                {mode === CREATE_MODE && (
                  <>
                  <Button isDisabled={inactive}colorScheme="blue" isLoading={loading} onClick={handleSave}>Enregistrer</Button>
                  <Button isDisabled={inactive} colorScheme="blue" isLoading={loading} onClick={(e) => handleSave(e, true)} ml={3}>Enregistrer et Imprimer</Button>
                  </>)}
                {mode === UPDATE_MODE && (
                  <>
                    <Button isDisabled={inactive} colorScheme="blue" isLoading={loading} onClick={handleUpdate}>Mettre à jour</Button>
                    <Button isDisabled={inactive} colorScheme="blue" isLoading={loading} onClick={(e) => handleUpdate(e, true)} ml={3}>Mettre à jour et Imprimer</Button>
                  </>
                )}
              </>
            )}
            <Button colorScheme="gray" onClick={handleModalClose}>Fermer</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default Ophtamology;
