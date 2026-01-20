'use client';

import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { makeClient } from './apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  const [apolloClient] = useState(() => makeClient());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApolloProvider>
  );
}
