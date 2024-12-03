import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useCashOperation } from './CashOperationZone';


// Fonction pour mettre en gras les caractères recherchés
const highlightSearchTerm = (text ='', term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text?.split(regex).map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? <strong style={{color:'green'}} key={index}>{part}</strong> : part
    );
  };


function CashOperationList({ actions}) {
    const {operations, searchTerm} = useCashOperation()
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Description</Th>
          <Th>Montant</Th>
          <Th>type</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {operations.map((operation) => (
          <Tr key={operation._id} >
            <Td>{new Date(operation.createdAt).toLocaleDateString()}</Td>
            <Td>
              {highlightSearchTerm(
                operation.description.length > 30
                  ? `${operation?.description.slice(0, 30)  }...`
                  : operation?.description,
                    searchTerm || ''
              )}
            </Td>
            <Td>{highlightSearchTerm(operation.amount, searchTerm|| "")}</Td>
            <Td>{operation.type}</Td>
            <Td>
              <Menu>
                <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
                <MenuList>
                  {actions.map((action, index) => (
                    <MenuItem key={index} onClick={() => action.action(operation)}>
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default CashOperationList;
