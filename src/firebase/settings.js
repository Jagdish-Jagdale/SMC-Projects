/**
 * Firebase CRUD for settings, property types, cities, and areas (Realtime Database)
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
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// ===== SETTINGS =====
export const getSettings = async () => {
  try {
    const docRef = child(ref(db), 'settings/company');
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      return docSnap.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const updateSettings = async (data) => {
  try {
    const docRef = ref(db, 'settings/company');
    await update(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: error.message };
  }
};

// ===== PROPERTY TYPES =====
export const getPropertyTypes = async () => {
  try {
    const docSnap = await get(ref(db, 'propertyTypes'));
    if (!docSnap.exists()) return [];
    
    let results = [];
    docSnap.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    
    // Sort asc by name
    return results.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
};

export const addPropertyType = async (name) => {
  try {
    const newDocRef = push(ref(db, 'propertyTypes'));
    await set(newDocRef, {
      name,
      createdAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding property type:', error);
    return { success: false, error: error.message };
  }
};

export const deletePropertyType = async (id) => {
  try {
    await remove(ref(db, `propertyTypes/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting property type:', error);
    return { success: false, error: error.message };
  }
};

export const updatePropertyType = async (id, name) => {
  try {
    await update(ref(db, `propertyTypes/${id}`), { name });
    return { success: true };
  } catch (error) {
    console.error('Error updating property type:', error);
    return { success: false, error: error.message };
  }
};

// ===== CITIES =====
export const getCities = async () => {
  try {
    const docSnap = await get(ref(db, 'cities'));
    if (!docSnap.exists()) return [];
    
    let results = [];
    docSnap.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    
    return results.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const addCity = async (name) => {
  try {
    const newDocRef = push(ref(db, 'cities'));
    await set(newDocRef, {
      name,
      createdAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding city:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCity = async (id) => {
  try {
    await remove(ref(db, `cities/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting city:', error);
    return { success: false, error: error.message };
  }
};

// ===== AREAS =====
export const getAreas = async (cityId = null) => {
  try {
    const docSnap = await get(ref(db, 'areas'));
    if (!docSnap.exists()) return [];
    
    let results = [];
    docSnap.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    
    if (cityId) {
      results = results.filter(a => a.cityId === cityId);
    }
    
    return results.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
};

export const addArea = async (name, cityId) => {
  try {
    const newDocRef = push(ref(db, 'areas'));
    await set(newDocRef, {
      name,
      cityId,
      createdAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding area:', error);
    return { success: false, error: error.message };
  }
};

export const deleteArea = async (id) => {
  try {
    await remove(ref(db, `areas/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting area:', error);
    return { success: false, error: error.message };
  }
};

// ===== MEDIA =====
export const uploadMedia = async (file, folder = 'media', title = '', description = '') => {
  try {
    const fileRef = storageRef(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    // Save media record to RTDB
    const mediaDocRef = push(ref(db, 'media'));
    await set(mediaDocRef, {
      url,
      name: file.name,
      title: title || file.name,
      description: description || '',
      folder,
      type: file.type,
      size: file.size,
      createdAt: serverTimestamp()
    });
    
    return { id: mediaDocRef.key, url, success: true };
  } catch (error) {
    console.error('Error uploading media:', error);
    return { success: false, error: error.message };
  }
};

export const updateMedia = async (id, data) => {
  try {
    const docRef = ref(db, `media/${id}`);
    await update(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error('Error updating media:', error);
    return { success: false, error: error.message };
  }
};

export const getMedia = async (folder = null) => {
  try {
    const docSnap = await get(ref(db, 'media'));
    if (!docSnap.exists()) return [];
    
    let results = [];
    docSnap.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    
    if (folder) {
      results = results.filter(m => m.folder === folder);
    }
    
    // Sort desc by createdAt
    return results.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
};

export const deleteMedia = async (id) => {
  try {
    await remove(ref(db, `media/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting media:', error);
    return { success: false, error: error.message };
  }
};

// ===== SEO =====
export const getSeoData = async (page) => {
  try {
    const docRef = child(ref(db), `seo/${page}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      return docSnap.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
};

export const updateSeoData = async (page, data) => {
  try {
    const docRef = ref(db, `seo/${page}`);
    await update(docRef, { ...data, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error('Error updating SEO data:', error);
    return { success: false, error: error.message };
  }
};

// Upload company logo
export const uploadLogo = async (file) => {
  try {
    const fileRef = storageRef(storage, `settings/logo_${Date.now()}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return { success: false, error: error.message };
  }
};
// Upload company brochure
export const uploadBrochure = async (file) => {
  try {
    const fileRef = storageRef(storage, `settings/brochure_${Date.now()}_${file.name}`);
    // Set metadata to force attachment (download) with filename
    const metadata = {
      contentDisposition: `attachment; filename="${file.name}"`
    };
    const snapshot = await uploadBytes(fileRef, file, metadata);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading brochure:', error);
    return { success: false, error: error.message };
  }
};

// ===== BANNERS / HOMEPAGE SLIDER =====
export const getBanners = async () => {
  try {
    const snapshot = await get(ref(db, 'banners'));
    if (!snapshot.exists()) return [];
    let results = [];
    snapshot.forEach((child) => { results.push({ id: child.key, ...child.val() }); });
    results.sort((a, b) => (a.order || 0) - (b.order || 0));
    return results;
  } catch (error) { console.error('Error fetching banners:', error); return []; }
};

export const addBanner = async (data) => {
  try {
    const newRef = push(ref(db, 'banners'));
    await set(newRef, { ...data, createdAt: serverTimestamp() });
    return { id: newRef.key, success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const updateBanner = async (id, data) => {
  try {
    await update(ref(db, `banners/${id}`), data);
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const deleteBanner = async (id) => {
  try {
    await remove(ref(db, `banners/${id}`));
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
};

export const uploadBannerImage = async (file) => {
  try {
    const fileRef = storageRef(storage, `banners/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) { return { success: false, error: error.message }; }
};
