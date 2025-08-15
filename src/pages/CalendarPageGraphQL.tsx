import * as React from 'react';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';
import { useReadQuery } from '@apollo/client/react';
import ActivityList from '../components/ActivityList';
import CalendarView from '../components/CalendarView';
import ActivityDetailGraphQL from '../components/ActivityDetailGraphQL';
import { apolloLoader } from '../graphql/apollo-router-integration';
import { GetActivitiesDocument, GetActivityDocument, GetActivitiesQueryVariables, GetActivityQueryVariables } from '../gql/graphql';
import { Activity } from '../types';
import './CalendarPage.css';

// Create the loader using the apolloLoader pattern
export const graphqlClientLoader = apolloLoader()(
  ({ preloadQuery, params }) => {
    // Always preload activities query
    const activitiesQueryRef = preloadQuery(GetActivitiesDocument, {
      variables: {} satisfies GetActivitiesQueryVariables,
    });
    
    // Always preload activity detail query, even with empty ID
    // This ensures consistent hook order in the component
    const activityQueryRef = preloadQuery(GetActivityDocument, {
      variables: { id: params.id || '' } satisfies GetActivityQueryVariables,
    });
    
    return { 
      activitiesQueryRef,
      activityQueryRef 
    };
  }
);

function CalendarPageGraphQL() {
  const navigate = useNavigate();
  const params = useParams();
  
  // Get query references from loader
  const { activitiesQueryRef, activityQueryRef } = useLoaderData<typeof graphqlClientLoader>();
  
  // Use useReadQuery to read the data
  const { data: activitiesData } = useReadQuery(activitiesQueryRef);
  
  // Always call useReadQuery for activity data
  const { data: activityData } = useReadQuery(activityQueryRef);
  
  const handleActivitySelect = (id: number) => {
    navigate(`/activity/${id}`);
  };

  const handleCloseDetail = () => {
    navigate('/');
  };

  // Convert GraphQL activities to match the existing Activity type
  const activities: Activity[] = ((activitiesData as any)?.activities || []).map((activity: any) => ({
    ...activity,
    id: parseInt(activity.id)
  }));

  // Get the selected activity from the query data
  const selectedActivity = (activityData as any)?.activity 
    ? { ...(activityData as any).activity, id: parseInt((activityData as any).activity.id) }
    : null;

  return (
    <div className="calendar-page">
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
          <ActivityDetailGraphQL 
            activity={selectedActivity} 
            onClose={handleCloseDetail} 
          />
        )}
      </div>
    </div>
  );
}

export default CalendarPageGraphQL;
