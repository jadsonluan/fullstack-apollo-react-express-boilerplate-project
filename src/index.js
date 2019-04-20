import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`;

const users = {
  1: {
    id: '1',
    username: 'Jadson Luan'
  },
  2: {
    id: '2',
    username: 'Arthur Felipe'
  }
};

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    me: (parent, args, { me }) => { return me; },
    user: (parent, { id }) => {
      return users[id];
    },
  },
  User: {
    username: user => user.username,
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
})

server.applyMiddleware({ app, path: '/graphql'});

app.listen({ port: 8000}, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
})