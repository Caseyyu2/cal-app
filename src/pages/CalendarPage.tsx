import * as React from 'react';
import { Await } from 'react-router';
import { useNavigate, LoaderFunctionArgs, useLoaderData, ShouldRevalidateFunctionArgs } from 'react-router-dom';
import ActivityList from '../components/ActivityList';
import CalendarView from '../components/CalendarView';
import ActivityDetail from '../components/ActivityDetail';
import activitiesApi from '../api/activitiesApi';
import { Activity } from '../types';
import './CalendarPage.css';

interface DeferredLoaderData {
  activities: Promise<Activity[]>;
  selectedActivity: Promise<Activity | null>;
}

// Client loader function - returns promises directly
export const calendarClientLoader = ({ params }: LoaderFunctionArgs) => {
  return {
    activities: activitiesApi.getAllActivities(),
    selectedActivity: Promise.resolve(null)
  };
};

function shouldRevalidate(
  arg: ShouldRevalidateFunctionArgs,
) {
  if (arg.formAction == "Edit") {
    return true;
  }

  return false;
}

function CalendarPage() {
  const loaderData = useLoaderData() as DeferredLoaderData;
  const navigate = useNavigate();
  
  const handleActivitySelect = (id: number) => {
    navigate(`/activity/${id}`);
  };

  const handleCloseDetail = () => {
    navigate('/');
  };

  return (
    <div className="calendar-page">
      <React.Suspense fallback={<div className="loading">Loading activities...</div>}>
        <Await resolve={loaderData.activities}>
          {(activities: Activity[]) => (
            <React.Suspense fallback={<div className="loading">Loading activity details...</div>}>
              <Await resolve={loaderData.selectedActivity}>
                {(selectedActivity: Activity | null) => (
                  <>
                    <div className="sidebar">
                      <h2>Activities</h2>
                      <ActivityList 
                        activities={activities} 
                        onSelectActivity={handleActivitySelect}
                        selectedActivityId={selectedActivity?.id}
                      />
                    </div>
                    
                    <div className="main-content">
                      <CalendarView activities={activities} onSelectActivity={handleActivitySelect} />
                      
                      {selectedActivity && (
                        <ActivityDetail 
                          activity={selectedActivity} 
                          onClose={handleCloseDetail} 
                        />
                      )}
                    </div>
                  </>
                )}
              </Await>
            </React.Suspense>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default CalendarPage;
