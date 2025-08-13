import { Navigate, ActionFunctionArgs } from 'react-router-dom'
import App from './App'
import CalendarPageGraphQL, { graphqlClientLoader } from './pages/CalendarPageGraphQL'
import { apolloClient } from './graphql/apollo-client'
import { UpdateActivityDocument, ActivityCategory, GetActivitiesDocument, GetActivityDocument } from './gql/graphql'

// Wrapper action that handles validation and cache invalidation
export const updateActivityAction = async ({ request, params }: ActionFunctionArgs) => {
  console.log('updateActivityAction called with params:', params);
  
  if (!params.id) {
    return { success: false, error: 'Activity ID is required' };
  }
  
  // Get form data
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log('Form data:', updates);
  
  // Validate dates
  const startTime = new Date(updates.startTime as string);
  const endTime = new Date(updates.endTime as string);
  
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return { success: false, error: 'Invalid date format' };
  }
  
  if (endTime <= startTime) {
    return { success: false, error: 'End time must be after start time' };
  }
  
  // Map category string to GraphQL enum
  const categoryMap: Record<string, ActivityCategory> = {
    'work': ActivityCategory.Work,
    'personal': ActivityCategory.Personal,
    'health': ActivityCategory.Health
  };
  
  try {
    // Prepare the updated activity data
    const updatedActivity = {
      __typename: 'Activity' as const,
      id: params.id,
      title: (updates.title as string)?.trim(),
      description: (updates.description as string)?.trim(),
      location: (updates.location as string)?.trim(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      category: categoryMap[updates.category as string]
    };

    // Execute mutation with optimistic response
    const result = await apolloClient.mutate({
      mutation: UpdateActivityDocument,
      variables: {
        id: params.id,
        input: {
          title: updatedActivity.title,
          description: updatedActivity.description,
          location: updatedActivity.location,
          startTime: updatedActivity.startTime,
          endTime: updatedActivity.endTime,
          category: updatedActivity.category
        }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateActivity: updatedActivity
      },
      // Refetch queries to update the cache after mutation
      refetchQueries: [
        { query: GetActivitiesDocument },
        { query: GetActivityDocument, variables: { id: params.id } }
      ]
    });
    
    console.log('Mutation result:', result);
    
    return { 
      success: true, 
      activity: result.data?.updateActivity 
    };
  } catch (error) {
    console.error('Mutation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update activity' 
    };
  }
};

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CalendarPageGraphQL />,
        loader: graphqlClientLoader
      },
      {
        path: 'activity/:id',
        element: <CalendarPageGraphQL />,
        loader: graphqlClientLoader
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]
