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


const SERVER_URL = process.env.APOLLO_URL;
const SERVER_PORT = process.env.APOLLO_PORT;
const CLIENT_URL = process.env.REACT_URL;
const CLIENT_PORT = process.env.REACT_PORT;

(async () => {
  const app = express();
 

  await createConnection()

  const corsOptions = {
    origin: CLIENT_URL! + CLIENT_PORT!,
    //origin: '*',
    credentials: true,
  }

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
});
  

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  });

  apolloServer.applyMiddleware({ app, cors: corsOptions });
  app.listen(SERVER_PORT, () => {
    console.log("apollo server start listening");
  });

  const connection = getConnection();
  console.log("연결" + connection)
})();