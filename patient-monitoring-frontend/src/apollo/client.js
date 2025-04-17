// src/apollo/client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // 🔗 Your backend URL
  cache: new InMemoryCache(),
});

export default client;
