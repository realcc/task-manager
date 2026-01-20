import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
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
});
