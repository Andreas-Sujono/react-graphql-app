const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { typeDefs, resolvers } = require('./schema/apolloSchema');
const http = require('http');
// const graphqlHTTP = require('express-graphql').graphqlHTTP;
// const schema = require('./schema/schema');

const app = express();

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

async function startApolloServer() {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });

  //before /graphql
  app.get('/', (req, res) => {
    res.send('hello world');
  });

  //run app
  await new Promise((resolve) => httpServer.listen({ port: 3080 }, resolve));
  console.log(`apollo Server ready at http://localhost:3080/graphql`);
}
startApolloServer();
