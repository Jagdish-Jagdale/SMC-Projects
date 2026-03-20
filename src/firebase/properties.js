/**
 * Firebase CRUD operations for properties collection (Realtime Database)
 * Handles all property-related database operations
 */
import {
  ref,
  get,
  child,
  push,
  set,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  serverTimestamp
} from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION = 'properties';

// Get all properties
export const getProperties = async (filters = {}) => {
  try {
    const dbRef = ref(db, COLLECTION);
    let snapshot;
    
    // Simplistic filtering for RTDB (since RTDB queries are limited to one orderBy)
    // We will do basic filtering on client if complex, or simple query here
    // For now, let's just fetch all and filter in JS, as RTDB lacks complex multi-field querying
    snapshot = await get(dbRef);
    
    if (!snapshot.exists()) return [];
    
    let results = [];
    snapshot.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Client-side filtering
    if (filters.city) {
      results = results.filter(p => p.city === filters.city);
    }
    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }
    if (filters.featured) {
      results = results.filter(p => p.featured === true);
    }
    if (filters.minPrice) {
      results = results.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= Number(filters.maxPrice));
    }

    // Sort by createdAt descending
    results.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

// Get single property by ID
export const getPropertyById = async (id) => {
  try {
    const docRef = child(ref(db), `${COLLECTION}/${id}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.key, ...docSnap.val() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
};

// Add new property
export const addProperty = async (propertyData) => {
  try {
    const newDocRef = push(ref(db, COLLECTION));
    await set(newDocRef, {
      ...propertyData,
      views: 0,
      featured: propertyData.featured || false,
      priority: propertyData.priority || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding property:', error);
    return { success: false, error: error.message };
  }
};

// Update property
export const updateProperty = async (id, data) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }
};

// Delete property
export const deleteProperty = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
};

// Upload property images
export const uploadPropertyImages = async (files, propertyId) => {
  try {
    const urls = [];
    for (const file of files) {
      const fileRef = storageRef(storage, `properties/${propertyId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return { success: true, urls };
  } catch (error) {
    console.error('Error uploading images:', error);
    return { success: false, error: error.message };
  }
};

// Delete property image
export const deletePropertyImage = async (imageUrl) => {
  try {
    const imageRef = storageRef(storage, imageUrl);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: error.message };
  }
};

// Toggle featured status
export const toggleFeatured = async (id, featured) => {
  return updateProperty(id, { featured });
};

// Increment view count
export const incrementViews = async (id) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      const currentViews = docSnap.val().views || 0;
      await update(docRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};
