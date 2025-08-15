import { activities } from './mockData';
import { Activity } from '../types';

// Simulate API delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
const activitiesApi = {
  // Get all activities
  getAllActivities: async (): Promise<Activity[]> => {
    await delay(200); // Simulate network delay
    console.log("+++++++++++++++++++, getAllActivities fired")
    return [...activities];
  },
  
  // Get activity by ID
  getActivityById: async (id: number | string): Promise<Activity> => {
    await delay(200);
    const activity = activities.find(act => act.id === parseInt(id.toString()));
    console.log("+++++++++++++++++++, getActivityById fired")
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    return activity;
  },
  
  // Update activity
  updateActivity: async (id: number | string, updates: Partial<Activity>): Promise<Activity> => {
    await delay(300);
    
    const index = activities.findIndex(act => act.id === parseInt(id.toString()));
    
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    // Update the activity in the mock data
    const updatedActivity = { ...activities[index], ...updates };
    activities[index] = updatedActivity;
    
    return updatedActivity;
  }
};

export default activitiesApi;
