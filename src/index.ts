import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata"
import { createConnection, getConnection } from "typeorm"
import {
  ApolloServer,
  PubSub,
  
} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import cors from "cors"
import express from "express"
import { Resolver, ResolverMap } from "./api/types/ResolverType"
import { schema } from "./schema"
import * as WebSocket from 'ws'
import { SubscriptionServer } from "subscriptions-transport-ws"
import { createServer } from "http"
import { execute, subscribe } from "graphql"

 
const WS_PORT = process.env.WS_PORT
const SERVER_URL = process.env.APOLLO_URL;
const SERVER_PORT = process.env.APOLLO_PORT;
const CLIENT_URL = process.env.REACT_URL;
const CLIENT_PORT = process.env.REACT_PORT;



(async () => {
  const app = express();
  await createConnection();
  const corsOptions = {
    origin: CLIENT_URL! + CLIENT_PORT!,
    credentials: true,
  }
  
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({req, res})
  })
  
  
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: SERVER_PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${SERVER_PORT}${apolloServer.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${SERVER_PORT}${apolloServer.subscriptionsPath}`);
  })
})();

