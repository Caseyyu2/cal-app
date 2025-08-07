# Apollo GraphQL Implementation

This directory contains the Apollo Client setup with GraphQL code generation for the calendar app.

## Architecture

### Backend for Frontend (BFF) Pattern
- Apollo Client is configured with a mock schema link that simulates a GraphQL server
- Resolvers in `apollo-client.ts` use the existing mock data from `src/api/mockData.ts`
- This allows for easy transition to a real GraphQL backend in the future

### Code Generation with Client Preset
- GraphQL schema is defined in `schema.graphql`
- Queries and mutations are defined in separate `.graphql` files
- Using `@graphql-codegen/client-preset` for optimized type generation
- Running `npm run codegen` generates TypeScript types and typed document nodes

### Apollo-React Router Integration
- Custom integration utilities in `apollo-router-integration.ts`
- Seamless integration between Apollo Client and React Router
- Optimized data fetching at the route level
- Automatic cache management

## Files

- `schema.graphql` - GraphQL schema definition
- `apollo-client.ts` - Apollo Client configuration with mock resolvers and cache normalization
- `apollo-router-integration.ts` - Custom React Router integration utilities
- `queries/activities.graphql` - GraphQL queries
- `mutations/activities.graphql` - GraphQL mutations
- `../gql/` - Generated directory containing:
  - `graphql.ts` - TypeScript types and typed document nodes
  - `gql.ts` - GraphQL tag function
  - `fragment-masking.ts` - Fragment utilities
  - `index.ts` - Main export file

## Usage

### Running Code Generation
```bash
# Generate types and document nodes once
npm run codegen

# Watch mode for development
npm run codegen:watch
```

### Using Generated Types with Apollo Client

```typescript
import { useQuery, useMutation } from '@apollo/client';
import { GetActivitiesDocument, UpdateActivityDocument } from '../gql/graphql';

// Query example
const { data, loading, error } = useQuery(GetActivitiesDocument);

// Mutation example
const [updateActivity] = useMutation(UpdateActivityDocument);
```

### Using Apollo-React Router Integration

Our custom integration provides utilities for seamless Apollo Client and React Router integration:

```typescript
import { createDeferredApolloLoader, createApolloAction } from './apollo-router-integration';

// Create a loader for route-level data fetching
export const loader = createDeferredApolloLoader(
  apolloClient,
  {
    activities: GetActivitiesDocument,
    activity: GetActivityDocument
  },
  ({ params }) => ({
    activities: {},
    activity: params.id ? { id: params.id } : undefined
  })
);

// Create an action for mutations
const updateAction = createApolloAction(
  apolloClient,
  UpdateActivityDocument,
  (formData) => ({
    id: formData.get('id'),
    input: {
      title: formData.get('title'),
      // ... other fields
    }
  })
);
```

### Cache Normalization

The Apollo cache is configured with proper normalization:
- Activities are stored as separate entities with cache keys like `Activity:1`, `Activity:2`
- Automatic cache updates when mutations modify entities
- Deduplication across queries
- Better debugging experience in Apollo DevTools

### Type Safety
The client preset provides:
- Fully typed GraphQL operations
- Typed document nodes (no string queries)
- Smaller bundle size (no runtime parsing)
- Better tree-shaking
- TypeScript autocomplete for query/mutation variables and results

## Adding New Operations

1. Add new queries/mutations to the appropriate `.graphql` files
2. Run `npm run codegen` to regenerate types
3. Import and use the generated document nodes with Apollo hooks

## Benefits of Client Preset

- **Smaller Bundle**: Document nodes are pre-compiled, no runtime parsing
- **Type Safety**: Full TypeScript support with generated types
- **Performance**: Better tree-shaking and smaller runtime overhead
- **Developer Experience**: Autocomplete and type checking for all operations

## Transitioning to Real Backend

To connect to a real GraphQL backend:

1. Replace the mock schema link in `apollo-client.ts` with an HTTP link:
```typescript
import { HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://your-graphql-endpoint.com/graphql'
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
```

2. Remove the mock resolvers and schema
3. Update the codegen config to point to your backend schema
