import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata"
import { createConnection, getConnection } from "typeorm"
import {
  ApolloServer,
  PubSub
} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import cors from "cors"
import express from "express"
import { Resolver, ResolverMap } from "./api/types/ResolverType"
import { schema} from "./schema"


const URL = process.env.APOLLO_URL;
const PORT = process.env.APOLLO_PORT;

(async () => {
  const app = express();

  await createConnection()

  const corsOptions = {
    origin: URL! + PORT!,
    credentials: true,
  }

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
});
  
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(PORT, () => {
    console.log("apollo server start listening");
  });

  const connection = getConnection();
  console.log("연결" + connection)
})();