import { createApolloLoaderHandler, ApolloClient } from '@apollo/client-integration-react-router';
import { InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Create Apollo Client factory for React Router
function makeClient() {
  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            activity: {
              read(_, { args, toReference }) {
                return toReference({
                  __typename: 'Activity',
                  id: args?.id
                });
              }
            }
          }
        },
        Activity: {
          keyFields: ['id']
        }
      }
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first'
      }
    }
  });
}

// Create the Apollo loader handler
export const apolloLoader = createApolloLoaderHandler(makeClient);

// Re-export types
export type { createApolloLoaderHandler } from '@apollo/client-integration-react-router';
