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

