import React, { useState } from 'react';
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

} from '@chakra-ui/react';
import { calculerAge } from '../../utils/helpers';

function Ophtamology({ with: initialData, onSave, isOpen , onClose, patient }) {
  const initialFormData = initialData || {
    patient:patient?._id,
    date: '',
    oeilDroit: { SPH: '', CYL: '', AXE: '', ADD: '', EP: '' },
    oeilGauche: { SPH: '', CYL: '', AXE: '', ADD: '', EP: '' },
    traitements: [],
    verre: '',
    matiere: '',
    port: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update nested object for oeilDroit and oeilGauche
    if (name.startsWith("oeilDroit.") || name.startsWith("oeilGauche.")) {
      const [eye, field] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [eye]: {
          ...prevData[eye],
          [field]: value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault()
    if (onSave) onSave(formData);
    onClose();
  };

  const handleModalClose = () => {
    setFormData(initialFormData); // Reset form data on close
    onClose()
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay />
       
        <ModalContent> 
            <form onSubmit={handleSave}>
          <ModalHeader>Ordonnance de Verres Correcteurs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
        
            <FormControl>
              {/* Informations Générales */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                <GridItem>
                  <FormLabel>Nom et Prénom</FormLabel>
                  <Input readOnly name="nom" value={patient?.name} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>Âge</FormLabel>
                  <Input readOnly type="text" name="age" value={`${calculerAge(patient?.birthdate)} ans`} onChange={handleChange} />
                </GridItem>
                <GridItem colSpan={2}>
                  <FormLabel>Date</FormLabel>
                  <Input required type="date" name="date" value={formData.date} onChange={handleChange} />
                </GridItem>
              </Grid>

              {/* Section Verres Correcteurs */}
              <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
                <GridItem colSpan={5}>
                  <FormLabel>Verres Correcteurs</FormLabel>
                </GridItem>
                <GridItem>
                  <FormLabel>SPH (OD)</FormLabel>
                  <Input name="oeilDroit.SPH" value={formData.oeilDroit.SPH} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>CYL (OD)</FormLabel>
                  <Input name="oeilDroit.CYL" value={formData.oeilDroit.CYL} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>AXE (OD)</FormLabel>
                  <Input name="oeilDroit.AXE" value={formData.oeilDroit.AXE} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>ADD (OD)</FormLabel>
                  <Input name="oeilDroit.ADD" value={formData.oeilDroit.ADD} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>EP (OD)</FormLabel>
                  <Input name="oeilDroit.EP" value={formData.oeilDroit.EP} onChange={handleChange} />
                </GridItem>
                
                <GridItem>
                  <FormLabel>SPH (OG)</FormLabel>
                  <Input name="oeilGauche.SPH" value={formData.oeilGauche.SPH} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>CYL (OG)</FormLabel>
                  <Input name="oeilGauche.CYL" value={formData.oeilGauche.CYL} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>AXE (OG)</FormLabel>
                  <Input name="oeilGauche.AXE" value={formData.oeilGauche.AXE} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>ADD (OG)</FormLabel>
                  <Input name="oeilGauche.ADD" value={formData.oeilGauche.ADD} onChange={handleChange} />
                </GridItem>
                <GridItem>
                  <FormLabel>EP (OG)</FormLabel>
                  <Input name="oeilGauche.EP" value={formData.oeilGauche.EP} onChange={handleChange} />
                </GridItem>
              </Grid>

              {/* Traitements */}
              <FormLabel>Traitements</FormLabel>
              <Stack direction="row" flexWrap="wrap"  gap={3} columnGap={5} mb={4}>
                {['Photochromique', 'Anti Reflet', 'Azur ou blue Protect', "Teintes A, B, AB"].map((traitement) => (
                  <Checkbox
                    key={traitement}
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
              <FormLabel>Type de Port</FormLabel>
              <RadioGroup
                onChange={(value) => setFormData((prev) => ({ ...prev, port: value }))}
                value={formData.port}
              >
                <Stack direction="row">
                  <Radio value="Constant">Constant</Radio>
                  <Radio value="Inconstant">Inconstant</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="blue" type='submit' mr={3} >
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={handleModalClose}>Annuler</Button>
          </ModalFooter>  </form>
        </ModalContent>
      
      </Modal>
    </>
  );
};

export default Ophtamology;
