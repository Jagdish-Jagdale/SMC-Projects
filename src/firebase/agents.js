/**
 * Firebase CRUD operations for agents collection (Realtime Database)
 */
import {
  ref, get, child, push, set, update, remove, serverTimestamp
} from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION = 'agents';

export const getAgents = async () => {
  try {
    const snapshot = await get(ref(db, COLLECTION));
    if (!snapshot.exists()) return [];
    let results = [];
    snapshot.forEach((child) => { results.push({ id: child.key, ...child.val() }); });
    results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return results;
  } catch (error) { console.error('Error fetching agents:', error); return []; }
};

export const getAgentById = async (id) => {
  try {
    const snap = await get(child(ref(db), `${COLLECTION}/${id}`));
    return snap.exists() ? { id: snap.key, ...snap.val() } : null;
  } catch (error) { console.error('Error fetching agent:', error); return null; }
};

export const addAgent = async (data) => {
  try {
    const newRef = push(ref(db, COLLECTION));
    await set(newRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: newRef.key, success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const updateAgent = async (id, data) => {
  try {
    await update(ref(db, `${COLLECTION}/${id}`), { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const deleteAgent = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const uploadAgentPhoto = async (file) => {
  try {
    const fileRef = storageRef(storage, `agents/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) { return { success: false, error: error.message }; }
};
