import { Navigate, ActionFunctionArgs } from 'react-router-dom'
import App from './App'
import { clientLoader } from './pages/CalendarPage'
import CalendarIndexPage from './pages/CalendarIndexPage'
import ActivityDetailPage from './pages/ActivityDetailPage'
import activitiesApi from './api/activitiesApi'

// Action to update activity - returns promise for better Suspense integration
export const updateActivityAction = ({ request, params }: ActionFunctionArgs) => {
  return request.formData().then(formData => {
    const updates = Object.fromEntries(formData);
    
    if (!params.id) {
      return Promise.resolve({ success: false, error: 'Activity ID is required' });
    }
    
    // Validate required fields
    const title = (updates.title as string)?.trim();
    const description = (updates.description as string)?.trim();
    const location = (updates.location as string)?.trim();
    
    // Convert form data to proper types and format dates
    const startTime = new Date(updates.startTime as string);
    const endTime = new Date(updates.endTime as string);
    
    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return Promise.resolve({ success: false, error: 'Invalid date format' });
    }
    
    if (endTime <= startTime) {
      return Promise.resolve({ success: false, error: 'End time must be after start time' });
    }
    
    const activityUpdates = {
      title,
      description,
      location,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      category: updates.category as 'work' | 'personal' | 'health'
    };
    
    return activitiesApi.updateActivity(params.id, activityUpdates)
      .then(updatedActivity => ({ success: true, activity: updatedActivity }))
      .catch(error => ({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update activity' 
      }));
  });
};

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CalendarIndexPage />,
        loader: clientLoader
      },
      {
        path: 'activity/:id',
        element: <ActivityDetailPage />,
        loader: clientLoader,
        action: updateActivityAction
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]
