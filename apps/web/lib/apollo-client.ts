import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export function makeClient() {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            tasks: {
              keyArgs: ['status', 'priority', 'projectId'],
              merge(existing, incoming, { args }) {
                if (!args?.cursor) {
                  return incoming;
                }
                return {
                  ...incoming,
                  items: [...(existing?.items || []), ...incoming.items],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}
