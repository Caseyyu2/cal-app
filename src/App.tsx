import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/apollo-client';
import { ActivityProvider } from './context/ActivityContext';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ActivityProvider>
        <div className="app">
          <Suspense fallback={<div className="loading">Loading activities...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </ActivityProvider>
    </ApolloProvider>
  );
}

export default App;
