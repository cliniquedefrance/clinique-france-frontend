import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import getConnectedUser from '../../../utils/user';

function CashOperationForm({
  mode = "create",
  show,
  inFormOperation,
  inFormProcess,
  onCreate,
  onUpdate,
  onClose,
}) {
  const [formData, setFormData] = useState({
    type: "expense", // Default to "sortie"
    amount: "",
    description: "",
    user:null
  });
  const [connectedUser, setConnectedUser] = useState(null)

  useEffect(() => {
    if (mode === "view" || mode === "update") {
      setFormData({
        type: inFormOperation?.type || "expense",
        amount: inFormOperation?.amount || "",
        description: inFormOperation?.description || "",
        user: inFormOperation?.user._id || null
      });
    } else {
      setFormData({ type: "expense", amount: "", description: "" });
    }
  }, [mode, inFormOperation]);


  useEffect(() => {
    const user = getConnectedUser()
    if (user) {
        setConnectedUser(user.user);
        if(mode==="create"){
            setFormData(prev => ({
                ...prev,
                user:user._id,
            }))
        }
    } else {
        setConnectedUser(null);
    }

}, [])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('operation cash ',formData)
    if (mode === "create") {
      onCreate(formData);
    } else if (mode === "update") {
      onUpdate(formData);
    }
  };

  // eslint-disable-next-line consistent-return
  const testReadOnly = () => {
    if (mode === "view"){
        return true;
    }
    if(mode === "update" && connectedUser._id!==inFormOperation.user ){
        return true;
    }
    return false;
  };

  const isReadOnly = testReadOnly();

  return (
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "create" && "Créer une opération de caisse"}
          {mode === "view" && "Détails de l'opération de caisse"}
          {mode === "update" && "Modifier l'opération de caisse"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {inFormProcess.error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {inFormProcess.error}
            </Alert>
          )}
          {inFormProcess.success && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              Opération enregistrée avec succès !
            </Alert>
          )}
          {inFormProcess.loading && (
            <Spinner size="lg" color="blue.500" display="block" mx="auto" mb={4} />
          )}
          <FormControl mb={4} isReadOnly={isReadOnly}>
            <FormLabel>Type d'opération</FormLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              isDisabled={isReadOnly}
            >
              <option value="income">Entrée</option>
              <option value="expense">Sortie</option>
            </Select>
          </FormControl>
          <FormControl mb={4} isReadOnly={isReadOnly} isRequired>
            <FormLabel>Montant</FormLabel>
            <NumberInput
              value={formData.amount}
              onChange={(value) => handleChange("amount", value)}
              isDisabled={isReadOnly}
              min={0}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl mb={4} isReadOnly={isReadOnly}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Ajouter une description (facultatif)"
              isDisabled={isReadOnly}
            />
          </FormControl>
          <p><span>Utilisateur : </span> <span style={{fontWeight:"bold", fontStyle:'italic'}}>{connectedUser?.name}</span></p>
          <p>{JSON.stringify(inFormOperation?.user?._id === connectedUser?._id)}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Fermer
          </Button>
          {mode !== "view" && (
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isDisabled={inFormProcess.loading}
            >
              {mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CashOperationForm;
