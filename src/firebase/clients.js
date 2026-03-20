/**
 * Firebase CRUD operations for clients collection (Realtime Database)
 */
import {
  ref, get, child, push, set, update, remove, serverTimestamp
} from 'firebase/database';
import { db } from './config';

const COLLECTION = 'clients';

export const getClients = async () => {
  try {
    const snapshot = await get(ref(db, COLLECTION));
    if (!snapshot.exists()) return [];
    let results = [];
    snapshot.forEach((child) => { results.push({ id: child.key, ...child.val() }); });
    results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return results;
  } catch (error) { console.error('Error fetching clients:', error); return []; }
};

export const getClientById = async (id) => {
  try {
    const snap = await get(child(ref(db), `${COLLECTION}/${id}`));
    return snap.exists() ? { id: snap.key, ...snap.val() } : null;
  } catch (error) { console.error('Error fetching client:', error); return null; }
};

export const addClient = async (data) => {
  try {
    const newRef = push(ref(db, COLLECTION));
    await set(newRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: newRef.key, success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const updateClient = async (id, data) => {
  try {
    await update(ref(db, `${COLLECTION}/${id}`), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const deleteClient = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};
