const BASE_URL = `${process.env.REACT_APP_BASE_URL}/ventes`;

/**
 * Crée une nouvelle vente.
 * @param {Object} venteData - Les données de la vente à créer.
 * @returns {Promise<Object>} La vente créée.
 */
export async function creerVente(venteData) {
    const response = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venteData)
    });
    if (!response.ok) {
        throw new Error(`Erreur lors de la création de la vente: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Récupère une vente par ID.
 * @param {string} venteId - L'ID de la vente à récupérer.
 * @returns {Promise<Object>} La vente récupérée.
 */
export async function obtenirVenteParId(venteId) {
    const response = await fetch(`${BASE_URL}/${venteId}`);
    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de la vente: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Met à jour une vente par ID.
 * @param {string} venteId - L'ID de la vente à mettre à jour.
 * @param {Object} venteData - Les nouvelles données de la vente.
 * @returns {Promise<Object>} La vente mise à jour.
 */
export async function mettreAJourVente(venteId, venteData) {
    const response = await fetch(`${BASE_URL}/${venteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venteData)
    });
    if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour de la vente: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Supprime une vente par ID.
 * @param {string} venteId - L'ID de la vente à supprimer.
 * @returns {Promise<void>} Confirmation de la suppression.
 */
export async function supprimerVente(venteId) {
    const response = await fetch(`${BASE_URL}/${venteId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de la vente: ${response.statusText}`);
    }
}

/**
 * Récupère toutes les ventes, avec un filtre optionnel par statut de paiement.
 * @param {string} [statutPaiement] - Filtrer par statut de paiement ('payé', 'partiel', 'impayé').
 * @returns {Promise<Array>} La liste des ventes.
 */
export async function obtenirToutesLesVentes(statutPaiement) {
    const url = statutPaiement ? `${BASE_URL}?statutPaiement=${statutPaiement}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des ventes: ${response.statusText}`);
    }
    return response.json();
}
