/**
 * Firebase CRUD operations for projects collection (Realtime Database)
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

const COLLECTION = 'projects';

// Get all projects with optional status filter
export const getProjects = async (status = null) => {
  try {
    const dbRef = ref(db, COLLECTION);
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) return [];
    
    let results = [];
    snapshot.forEach((childSnapshot) => {
      results.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    if (status) {
      results = results.filter(p => p.status === status);
    }

    // Sort by createdAt descending
    results.sort((a, b) => {
      const timeA = a.createdAt || 0;
      const timeB = b.createdAt || 0;
      return timeB - timeA;
    });

    return results;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Get single project
export const getProjectById = async (id) => {
  try {
    const docRef = child(ref(db), `${COLLECTION}/${id}`);
    const docSnap = await get(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.key, ...docSnap.val() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

// Add new project
export const addProject = async (projectData) => {
  try {
    const newDocRef = push(ref(db, COLLECTION));
    await set(newDocRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: newDocRef.key, success: true };
  } catch (error) {
    console.error('Error adding project:', error);
    return { success: false, error: error.message };
  }
};

// Update project
export const updateProjectDoc = async (id, data) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message };
  }
};

// Delete project
export const deleteProject = async (id) => {
  try {
    await remove(ref(db, `${COLLECTION}/${id}`));
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
};

// Upload project images
export const uploadProjectImages = async (files, projectId) => {
  try {
    const urls = [];
    for (const file of files) {
      const fileRef = storageRef(storage, `projects/${projectId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      urls.push(url);
    }
    return { success: true, urls };
  } catch (error) {
    console.error('Error uploading project images:', error);
    return { success: false, error: error.message };
  }
};
// Toggle featured status
export const toggleFeaturedProject = async (id, isFeatured) => {
  try {
    const docRef = ref(db, `${COLLECTION}/${id}`);
    await update(docRef, { featured: isFeatured, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
