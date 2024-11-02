// ordonnance.api.js

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Crée une nouvelle ordonnance.
 * @param {Object} ordonnance - Les données de l'ordonnance à créer.
 * @returns {Promise<Object>} La réponse JSON de l'API avec les détails de l'ordonnance créée.
 */
export async function createOrdonnance(ordonnance) {
  console.log("create ordonnance api", ordonnance);
  const response = await fetch(`${BASE_URL}/ordonnance/ophta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ordonnance),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la création de l’ordonnance');
  }
  return response.json();
}

/**
 * Récupère toutes les ordonnances globalement.
 * @returns {Promise<Object[]>} La liste des ordonnances.
 */
export async function getAllOrdonnances() {
  const response = await fetch(`${BASE_URL}/ordonnance/ophta`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des ordonnances');
  }
  return response.json();
}

/**
 * Récupère toutes les ordonnances d'un patient spécifique.
 * @param {string} patientId - L'ID du patient.
 * @returns {Promise<Object[]>} La liste des ordonnances du patient.
 */
export async function getOrdonnancesByPatient(patientId) {
  const response = await fetch(`${BASE_URL}/ordonnance/ophta/patient/${patientId}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des ordonnances pour le patient ${patientId}`);
  }
  return response.json();
}

/**
 * Récupère une ordonnance par son ID.
 * @param {string} id - L'ID de l'ordonnance.
 * @returns {Promise<Object>} Les détails de l'ordonnance.
 */
export async function getOrdonnanceById(id) {
  const response = await fetch(`${BASE_URL}/ordonnance/ophta/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération de l’ordonnance avec l’ID ${id}`);
  }
  return response.json();
}

/**
 * Met à jour une ordonnance existante par son ID.
 * @param {string} id - L'ID de l'ordonnance à mettre à jour.
 * @param {Object} ordonnance - Les nouvelles données de l'ordonnance.
 * @returns {Promise<Object>} La réponse JSON de l'API avec les détails mis à jour de l'ordonnance.
 */
export async function updateOrdonnance(id, ordonnance) {
  const response = await fetch(`${BASE_URL}/ordonnance/ophta/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ordonnance),
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de l’ordonnance avec l’ID ${id}`);
  }
  return response.json();
}

/**
 * Supprime une ordonnance par son ID.
 * @param {string} id - L'ID de l'ordonnance à supprimer.
 * @returns {Promise<void>} Une promesse qui se résout si la suppression est réussie.
 */
export async function deleteOrdonnance(id) {
  const response = await fetch(`${BASE_URL}/ordonnance/ophta/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de l’ordonnance avec l’ID ${id}`);
  }
}
