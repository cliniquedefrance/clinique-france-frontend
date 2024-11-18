
import React from "react";
import { Box, Text, Button, VStack, HStack, useBreakpointValue } from "@chakra-ui/react";

export default function OrdonnanceOphtaCard({ ordonnance, onView, onDelete, onUpdate, onPrint, onSale=()=>null }) {
  const { date, label, traitements, verre, matiere, port, createdAt, updatedAt } = ordonnance;
  const buttonAlignment = useBreakpointValue({ base: "start", md: "end" }); // Aligner à droite pour les grands écrans

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm" width="100%">
      <VStack align="start" spacing={2} maxWidth="100%">
        <Text fontWeight="bold" fontSize="lg">{label || "non-definit"}</Text>
        <Text fontSize="sm" color="gray.500">Date : {new Date(date).toLocaleDateString()}</Text>
        <Text fontSize="sm">Traitements : {traitements.join(", ")}</Text>
        <Text fontSize="sm">Verre : {verre}</Text>
        <Text fontSize="sm">Matière : {matiere}</Text>
        <Text fontSize="sm">Port : {port}</Text>
        <Text fontSize="sm">Créé le : {new Date(createdAt).toLocaleString()}</Text>
        <Text fontSize="sm">Dernière modification : {new Date(updatedAt).toLocaleString()}</Text>
      </VStack>
      <HStack mt={4} spacing={3} justifyContent={buttonAlignment}>
        <Button colorScheme="blue" onClick={() => onView(ordonnance)}>Détails</Button>
        <Button colorScheme="yellow" onClick={() => onUpdate(ordonnance)}>Modifier</Button>
        <Button colorScheme="red" onClick={() => onDelete(ordonnance)}>Supprimer</Button>
        <Button colorScheme="teal" onClick={() => onPrint(ordonnance)}>Imprimer</Button>
        <Button colorScheme="purple" onClick={()=> onSale(ordonnance)} >Lancer une vente</Button>
      </HStack>
    </Box>
  );
}
