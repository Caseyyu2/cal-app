import * as React from 'react';
import { Await } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ActivityList from './ActivityList';
import CalendarView from './CalendarView';
import { Activity } from '../types';

interface CalendarLayoutProps {
  activities: Promise<Activity[]>;
  selectedActivityId?: number;
  children?: React.ReactNode;
}

function CalendarLayout({ activities, selectedActivityId, children }: CalendarLayoutProps) {
  const navigate = useNavigate();
  
  const handleActivitySelect = (id: number) => {
    navigate(`/activity/${id}`);
  };

  return (
    <div className="calendar-page">
      <React.Suspense fallback={<div className="loading">Loading activities...</div>}>
        <Await resolve={activities}>
          {(resolvedActivities: Activity[]) => (
            <>
              <div className="sidebar">
                <h2>Activities</h2>
                <ActivityList 
                  activities={resolvedActivities} 
                  onSelectActivity={handleActivitySelect}
                  selectedActivityId={selectedActivityId}
                />
              </div>
              
              <div className="main-content">
                <CalendarView 
                  activities={resolvedActivities} 
                  onSelectActivity={handleActivitySelect} 
                />
                
                {children}
              </div>
            </>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}

export default CalendarLayout;
