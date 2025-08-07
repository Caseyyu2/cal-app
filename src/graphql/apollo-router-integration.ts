import { ApolloClient, DocumentNode, OperationVariables, ApolloQueryResult, FetchResult, QueryOptions } from '@apollo/client';
import { LoaderFunctionArgs } from 'react-router-dom';

/**
 * Custom Apollo Client integration for React Router
 * Provides utilities for integrating Apollo queries with React Router loaders
 */

// Import apolloClient for preloadQuery
import { apolloClient } from './apollo-client';

// Type for the preloadQuery function
type PreloadQueryFn = <TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: Omit<QueryOptions<TVariables, TData>, 'query'>
) => Promise<ApolloQueryResult<TData>>;

// Extended loader args with preloadQuery
export interface ApolloLoaderArgs extends LoaderFunctionArgs {
  preloadQuery: PreloadQueryFn;
}

// Apollo loader factory function
export function apolloLoader<TArgs extends ApolloLoaderArgs = ApolloLoaderArgs>() {
  return <TReturn>(loaderFn: (args: TArgs) => TReturn) => {
    return (args: LoaderFunctionArgs): TReturn => {
      // Create the preloadQuery function
      const preloadQuery: PreloadQueryFn = (query, options) => {
        return apolloClient.query({
          query,
          ...options,
          fetchPolicy: options?.fetchPolicy || 'cache-first'
        });
      };

      // Call the loader function with extended args
      return loaderFn({
        ...args,
        preloadQuery
      } as TArgs);
    };
  };
}

// Helper to create a loader that executes Apollo queries
export function createApolloLoader<TData = any, TVariables extends OperationVariables = OperationVariables>(
  client: ApolloClient<any>,
  query: DocumentNode,
  getVariables?: (args: LoaderFunctionArgs) => TVariables
) {
  return async (args: LoaderFunctionArgs): Promise<ApolloQueryResult<TData>> => {
    const variables = getVariables ? getVariables(args) : {} as TVariables;
    
    // Execute the query with cache-first policy for optimal performance
    const result = await client.query<TData, TVariables>({
      query,
      variables,
      fetchPolicy: 'cache-first'
    });
    
    return result;
  };
}

// Helper to create deferred loaders for parallel data fetching
export function createDeferredApolloLoader<TQueries extends Record<string, DocumentNode>>(
  client: ApolloClient<any>,
  queries: TQueries,
  getVariables?: (args: LoaderFunctionArgs) => Record<keyof TQueries, any>
) {
  return (args: LoaderFunctionArgs) => {
    const variables = getVariables ? getVariables(args) : {} as Record<keyof TQueries, any>;
    
    const promises: Record<string, Promise<ApolloQueryResult<any>>> = {};
    
    for (const [key, query] of Object.entries(queries)) {
      promises[key] = client.query({
        query,
        variables: variables[key] || {},
        fetchPolicy: 'cache-first'
      });
    }
    
    return promises;
  };
}

// Helper for mutations in route actions
export function createApolloAction<TData = any, TVariables extends OperationVariables = OperationVariables>(
  client: ApolloClient<any>,
  mutation: DocumentNode,
  processFormData: (formData: FormData) => TVariables
) {
  return async ({ request }: { request: Request }): Promise<FetchResult<TData>> => {
    const formData = await request.formData();
    const variables = processFormData(formData);
    
    const result = await client.mutate<TData, TVariables>({
      mutation,
      variables
    });
    
    return result;
  };
}

// Hook to prefetch data on link hover
export function usePrefetchQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  client: ApolloClient<any>,
  query: DocumentNode
) {
  return (variables?: TVariables) => {
    // Prefetch the query into cache
    client.query<TData, TVariables>({
      query,
      variables: variables || {} as TVariables,
      fetchPolicy: 'cache-first'
    }).catch(() => {
      // Silently catch errors during prefetch
    });
  };
}

// Utility to invalidate queries after mutations
export function invalidateQueries(
  client: ApolloClient<any>,
  queries: DocumentNode[]
) {
  queries.forEach(query => {
    client.refetchQueries({
      include: [query]
    });
  });
}
