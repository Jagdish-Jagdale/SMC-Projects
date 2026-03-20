/**
 * Firebase CRUD operations for leads/inquiries collection (Realtime Database)
 */
import {
  ref,
  get,
  child,
  push,
  set,
  update,
  remove,
  serverTimestamp
} from 'firebase/database';
import { db } from './config';

const COLLECTION = 'leads';

// Get all leads with optional status filter
export const getLeads = async (status = null) => {
  try {
    const dbRef = ref(db, COLLECTION);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) return [];
    
    let results = [];
    snapshot.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    if (status) {
      results = results.filter(l => l.status === status);
    }

    results.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    return results;
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

// Get single lead
export const getLeadById = async (id) => {
  try {
    const docRef = child(ref(db), `${COLLECTION}/${id}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.key, ...docSnap.val() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching lead:', error);
    return null;
  }
};

// Add new lead (from contact/inquiry form)
export const addLead = async (leadData) => {
  try {
    const newDocRef = push(ref(db, COLLECTION));
    await set(newDocRef, {
      ...leadData,
      status: 'New',
      notes: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding lead:', error);
    return { success: false, error: error.message };
  }
};

// Update lead status
export const updateLeadStatus = async (id, status) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }
};

// Add note to lead
export const addLeadNote = async (id, note) => {
  try {
    const docRef = child(ref(db), `${COLLECTION}/${id}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      const currentNotes = docSnap.val().notes || [];
      await update(ref(db, `${COLLECTION}/${id}`), {
        notes: [...currentNotes, { text: note, date: new Date().toISOString() }],
        updatedAt: serverTimestamp()
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: error.message };
  }
};

// Assign agent to lead
export const assignAgentToLead = async (id, agentData) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, {
      assignedAgent: agentData, // { id: agentId, name: agentName }
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error assigning agent to lead:', error);
    return { success: false, error: error.message };
  }
};

// Delete lead
export const deleteLead = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting lead:', error);
    return { success: false, error: error.message };
  }
};
