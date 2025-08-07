import { activities as initialActivities } from '../api/mockData';
import { Activity } from '../types';

// Simulate API delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Create a mutable copy of activities for our mock database
let activities = [...initialActivities];

// Mock resolvers for BFF
export const resolvers = {
  Query: {
    activities: async () => {
      await delay(200);
      console.log("+++++++++++++++++++, GraphQL activities query fired");
      // Return activities with string IDs for proper cache normalization
      return activities.map(activity => ({
        ...activity,
        id: activity.id.toString(),
        __typename: 'Activity'
      }));
    },
    
    activity: async (_: any, { id }: { id: string }) => {
      await delay(200);
      console.log("+++++++++++++++++++, GraphQL activity query fired");
      const activity = activities.find(act => act.id === parseInt(id));
      return activity ? {
        ...activity,
        id: activity.id.toString(),
        __typename: 'Activity'
      } : null;
    },
    
    activitiesByDateRange: async (_: any, { startDate, endDate }: { startDate: string; endDate: string }) => {
      await delay(300);
      console.log("+++++++++++++++++++, GraphQL activitiesByDateRange query fired");
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return activities
        .filter(activity => {
          const activityDate = new Date(activity.startTime);
          return activityDate >= start && activityDate <= end;
        })
        .map(activity => ({
          ...activity,
          id: activity.id.toString(),
          __typename: 'Activity'
        }));
    }
  },
  
  Mutation: {
    createActivity: async (_: any, { input }: { input: Omit<Activity, 'id'> }) => {
      await delay(300);
      console.log("+++++++++++++++++++, GraphQL createActivity mutation fired");
      
      const newActivity: Activity = {
        ...input,
        id: Math.max(...activities.map(a => a.id)) + 1
      };
      
      // Create a new array instead of mutating
      activities = [...activities, newActivity];
      
      return {
        ...newActivity,
        id: newActivity.id.toString(),
        __typename: 'Activity'
      };
    },
    
    updateActivity: async (_: any, { id, input }: { id: string; input: Partial<Activity> }) => {
      await delay(3000);
      console.log("+++++++++++++++++++, GraphQL updateActivity mutation fired");
      
      const index = activities.findIndex(act => act.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Activity not found');
      }
      
      // Create a new activity object with the updates
      const updatedActivity = { 
        ...activities[index], 
        ...input,
        id: parseInt(id) // Ensure ID remains a number
      };
      
      // Create a new array with the updated activity (immutable update)
      activities = activities.map((activity, i) => 
        i === index ? updatedActivity : activity
      );
      
      // Log the update for debugging
      console.log('Updated activity:', updatedActivity);
      
      return {
        ...updatedActivity,
        id: updatedActivity.id.toString(),
        __typename: 'Activity'
      };
    },
    
    deleteActivity: async (_: any, { id }: { id: string }) => {
      await delay(300);
      console.log("+++++++++++++++++++, GraphQL deleteActivity mutation fired");
      
      const index = activities.findIndex(act => act.id === parseInt(id));
      
      if (index === -1) {
        return false;
      }
      
      // Create a new array without the deleted activity (immutable delete)
      activities = activities.filter((_, i) => i !== index);
      return true;
    }
  }
};
