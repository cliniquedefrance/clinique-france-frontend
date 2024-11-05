/* eslint-disable no-return-await */
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Fonction pour créer une monture
export async function createMonture(montureData) {
  const response = await fetch(`${BASE_URL}/montures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montureData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la monture');
  }
  return await response.json();
}

// Fonction pour récupérer toutes les montures
export async function getAllMontures() {
  const response = await fetch(`${BASE_URL}/montures`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des montures');
  }
  return await response.json();
}

// Fonction pour récupérer une monture par ID
export async function getMontureById(id) {
  const response = await fetch(`${BASE_URL}/montures/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la monture');
  }
  return await response.json();
}

// Fonction pour mettre à jour une monture par ID
export async function updateMonture(id, montureData) {
  const response = await fetch(`${BASE_URL}/montures/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(montureData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la monture');
  }
  return await response.json();
}

// Fonction pour supprimer une monture par ID
export async function deleteMonture(id) {
  const response = await fetch(`${BASE_URL}/montures/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la monture');
  }
  return await response.json();
}

// Fonction pour toggler la disponibilité en stock d'une monture
export async function toggleStock(id) {
  const response = await fetch(`${BASE_URL}/montures/${id}/toggle-stock`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Erreur lors du changement de la disponibilité de la monture');
  }
  return await response.json();
}
