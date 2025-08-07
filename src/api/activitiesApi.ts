import { activities } from './mockData';
import { Activity } from '../types';

// Simulate API delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
const activitiesApi = {
  // Get all activities
  getAllActivities: async (): Promise<Activity[]> => {
    await delay(300); // Simulate network delay
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
  
  // Get activities by date range
  getActivitiesByDateRange: async (startDate: string | Date, endDate: string | Date): Promise<Activity[]> => {
    await delay(300);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= start && activityDate <= end;
    });
  },
  
  // Update activity
  updateActivity: async (id: number | string, updates: Partial<Activity>): Promise<Activity> => {
    await delay(3000);
    
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
