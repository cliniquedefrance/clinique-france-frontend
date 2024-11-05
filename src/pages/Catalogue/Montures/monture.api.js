/* eslint-disable no-useless-catch */
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

export async function updateQuantity(montureId, newQuantity) {
  try {
    const response = await fetch(`${BASE_URL}/montures/${montureId}/quantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newQuantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


export async function decreaseQuantity(montureId, amount) {
  try {
    const response = await fetch(`${BASE_URL}/montures/${montureId}/decrease`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to decrease quantity');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    
    throw error;
  }
}

export async function increaseQuantity(montureId, amount) {
  try {
    const response = await fetch(`${BASE_URL}/montures/${montureId}/increase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to increase quantity');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


