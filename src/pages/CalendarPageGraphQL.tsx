import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  useQuery } from '@apollo/client';
import ActivityList from '../components/ActivityList';
import CalendarView from '../components/CalendarView';
import ActivityDetailGraphQL from '../components/ActivityDetailGraphQL';
import { apolloLoader, ApolloLoaderArgs } from '../graphql/apollo-router-integration';
import { GetActivitiesDocument, GetActivityDocument,  GetActivitiesQueryVariables, GetActivityQueryVariables } from '../gql/graphql';
import { Activity } from '../types';
import './CalendarPage.css';


// Create the loader using the apolloLoader pattern
export const graphqlClientLoader = apolloLoader<ApolloLoaderArgs>()(
  (args: ApolloLoaderArgs) => {
    const { preloadQuery, params } = args;
    
    // Preload activities query
    const activitiesRef = preloadQuery(GetActivitiesDocument, {
      variables: {} satisfies GetActivitiesQueryVariables,
    });
    
    // Conditionally preload activity detail query
    const activityRef = params.id 
      ? preloadQuery(GetActivityDocument, {
          variables: { id: params.id } satisfies GetActivityQueryVariables,
        })
      : null;
    
    return { activitiesRef, activityRef };
  }
);

function CalendarPageGraphQL() {
  const navigate = useNavigate();
  const params = useParams();
  
  // Use useQuery for activities to get automatic cache updates
  const { data: activitiesData, loading: activitiesLoading } = useQuery(GetActivitiesDocument);
  
  // Use useQuery for the selected activity to get automatic cache updates
  const { data: activityData } = useQuery(GetActivityDocument, {
    variables: { id: params.id || '' },
    skip: !params.id
  });
  
  const handleActivitySelect = (id: number) => {
    navigate(`/activity/${id}`);
  };

  const handleCloseDetail = () => {
    navigate('/');
  };

  if (activitiesLoading) {
    return <div className="loading">Loading activities...</div>;
  }

  // Convert GraphQL activities to match the existing Activity type
  const activities: Activity[] = (activitiesData?.activities || []).map(activity => ({
    ...activity,
    id: parseInt(activity.id)
  }));

  // Get the selected activity from the query data (which will update automatically)
  const selectedActivity = activityData?.activity 
    ? { ...activityData.activity, id: parseInt(activityData.activity.id) }
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
