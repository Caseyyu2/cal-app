import React from 'react';

interface AwaitProps<T> {
  resolve: Promise<T>;
  children: (data: T) => React.ReactNode;
  errorElement?: React.ReactNode;
}

// Resource wrapper for Suspense
function createResource<T>(promise: Promise<T>) {
  let status = 'pending';
  let result: T;
  let error: any;

  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (err) => {
      status = 'error';
      error = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

// Custom Await component that works with Suspense
export function Await<T>({ resolve, children, errorElement }: AwaitProps<T>) {
  const resource = React.useMemo(() => createResource(resolve), [resolve]);
  
  try {
    const data = resource.read();
    return <>{children(data!)}</>;
  } catch (error) {
    if (errorElement && !(error instanceof Promise)) {
      return <>{errorElement}</>;
    }
    throw error;
  }
}
