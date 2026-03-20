import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { firestoreDb } from './config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import { toast } from 'react-hot-toast';

const ABOUT_COLLECTION = 'about';
const ABOUT_DOC_ID = 'main';

export const uploadAboutImage = async (file) => {
  try {
    const fileRef = storageRef(storage, `about/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading about image:', error);
    return { success: false, error: error.message };
  }
};

// Initialize default about data if it doesn't exist
const defaultAboutData = {
  title: 'About Our Premium Real Estate',
  subtitle: 'Building Trust & Luxury',
  description: 'We are a premier real estate agency focused on luxury properties and exceptional experiences.',
  mission: 'To redefine luxury living through exceptional service and exclusive properties.',
  vision: 'To be the most trusted name in premium real estate globally.',
  experienceYears: '15',
  projectsCompleted: '120+',
  citiesServed: '12',
  teamMembers: [],
  images: [],
  updatedAt: new Date().toISOString()
};

// Fetch About Data
export const getAboutData = async () => {
  try {
    const docRef = doc(firestoreDb, ABOUT_COLLECTION, ABOUT_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If no document exists, create it with default data
      await setDoc(docRef, defaultAboutData);
      return defaultAboutData;
    }
  } catch (error) {
    console.error("Error fetching about data:", error);
    throw error;
  }
};

// Update About Data
export const updateAboutData = async (data) => {
  try {
    const docRef = doc(firestoreDb, ABOUT_COLLECTION, ABOUT_DOC_ID);
    
    // Check if document exists first
    const docSnap = await getDoc(docRef);
    const updatePayload = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, updatePayload);
    } else {
      await setDoc(docRef, updatePayload);
    }
    
    toast.success('About content updated successfully');
    return true;
  } catch (error) {
    console.error("Error updating about data:", error);
    toast.error('Failed to update about content');
    throw error;
  }
};
