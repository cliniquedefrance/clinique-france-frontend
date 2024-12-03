/* eslint-disable no-useless-catch */
/* eslint-disable no-return-await */

const BASE_URL = process.env.REACT_APP_BASE_URL;
const ENDPOINT = `${BASE_URL}/cash-operations`;

/**
 * Create a new cash operation.
 * @param {Object} data - The data for the cash operation.
 * @param {'income'|'expense'} data.type - The type of the operation (income or expense).
 * @param {number} data.amount - The amount of the operation.
 * @param {string} [data.description] - Optional description of the operation.
 * @param {string} data.user - The ID of the user responsible for the operation.
 * @returns {Promise<Object>} The created cash operation.
 * @throws Will throw an error if the request fails.
 */
export const createCashOperation = async (data) => {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create cash operation');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get a cash operation by ID.
 * @param {string} id - The ID of the cash operation.
 * @returns {Promise<Object>} The requested cash operation.
 * @throws Will throw an error if the request fails.
 */
export const getCashOperationById = async (id) => {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch cash operation');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all cash operations with optional filters.
 * @param {Object} [filters] - Optional filters to apply.
 * @returns {Promise<Object[]>} A list of cash operations.
 * @throws Will throw an error if the request fails.
 */
export const getAllCashOperations = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${ENDPOINT}?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch cash operations');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Update a cash operation by ID.
 * @param {string} id - The ID of the cash operation.
 * @param {Object} data - The updated data for the cash operation.
 * @returns {Promise<Object>} The updated cash operation.
 * @throws Will throw an error if the request fails.
 */
export const updateCashOperation = async (id, data) => {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update cash operation');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a cash operation by ID.
 * @param {string} id - The ID of the cash operation.
 * @returns {Promise<void>} Resolves if the deletion was successful.
 * @throws Will throw an error if the request fails.
 */
export const deleteCashOperation = async (id) => {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete cash operation');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
