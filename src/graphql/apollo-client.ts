import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Create Apollo Client with mock schema
export const apolloClient = new ApolloClient({
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
        // Tell Apollo to use 'id' field as the cache key for Activity objects
        keyFields: ['id']
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});
