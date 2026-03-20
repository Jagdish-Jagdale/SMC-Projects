/**
 * Firebase CRUD operations for testimonials collection (Realtime Database)
 */
import {
  ref,
  get,
  push,
  set,
  update,
  remove,
  serverTimestamp
} from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION = 'testimonials';

// Get all testimonials
export const getTestimonials = async () => {
  try {
    const dbRef = ref(db, COLLECTION);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) return [];
    
    let results = [];
    snapshot.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    results.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    return results;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

// Add testimonial
export const addTestimonial = async (data) => {
  try {
    const newDocRef = push(ref(db, COLLECTION));
    await set(newDocRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return { success: false, error: error.message };
  }
};

// Update testimonial
export const updateTestimonial = async (id, data) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, error: error.message };
  }
};

// Delete testimonial
export const deleteTestimonial = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: error.message };
  }
};

// Upload testimonial photo
export const uploadTestimonialPhoto = async (file) => {
  try {
    const fileRef = storageRef(storage, `testimonials/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { success: false, error: error.message };
  }
};
