import * as React from 'react';
import { Await } from 'react-router';
import { useLoaderData, useNavigate, LoaderFunctionArgs } from 'react-router-dom';
import CalendarLayout from '../components/CalendarLayout';
import ActivityDetail from '../components/ActivityDetail';
import activitiesApi from '../api/activitiesApi';
import { Activity } from '../types';

interface DeferredLoaderData {
  activities: Promise<Activity[]>;
  selectedActivity: Promise<Activity | null>;
}

// Client loader function - returns promises directly
export const activityClientLoader = ({ params }: LoaderFunctionArgs) => {
  if (params.id) {
    // Activity detail route - return promises directly
    return {
      activities: activitiesApi.getAllActivities(),
      selectedActivity: activitiesApi.getActivityById(params.id)
    };
  }
};


function ActivityDetailPage() {
  const loaderData = useLoaderData() as DeferredLoaderData;
  const navigate = useNavigate();

  const handleCloseDetail = () => {
    navigate('/');
  };

  return (
    <React.Suspense fallback={<div className="loading">Loading activity details...</div>}>
      <Await resolve={loaderData.selectedActivity}>
        {(selectedActivity: Activity | null) => (
          <CalendarLayout 
            activities={loaderData.activities}
            selectedActivityId={selectedActivity?.id}
          >
            {selectedActivity && (
              <ActivityDetail 
                activity={selectedActivity} 
                onClose={handleCloseDetail} 
              />
            )}
          </CalendarLayout>
        )}
      </Await>
    </React.Suspense>
  );
}

export default ActivityDetailPage;
