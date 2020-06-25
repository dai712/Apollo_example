import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata"
import { createConnection, getConnection } from "typeorm"
import {
  ApolloServer, PubSub,
  
} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import cors from "cors"
import express from "express"
import { Resolver, ResolverMap } from "./api/types/ResolverType"
import { schema } from "./schema"
import * as WebSocket from 'ws'
import { SubscriptionServer, SubscriptionClient } from "subscriptions-transport-ws"
import { createServer } from "http"
import { execute, subscribe } from "graphql"
import { isAuth } from "./utils/isAuth"
import { authUser, pubsub } from "./utils/Middlewares"


// const pubsub = new PubSub();

const cookieparser = require("cookie-parser")
const WS_PORT = process.env.WS_PORT

const SERVER_URL = process.env.APOLLO_URL;
const SERVER_PORT = process.env.APOLLO_PORT;

const CLIENT_URL = process.env.REACT_URL;
const CLIENT_PORT = process.env.REACT_PORT;


// const APOLLO_WS_EP = process.env.APOLLO_WS_ENDPOINT;
// const APOLLO_WS_EP_RT = process.env.APOLLO_WS_ENDPOINT_ROUTE;



(async () => {
  const app = express();
  await createConnection();
  const corsOptions = {
    origin: CLIENT_URL! + CLIENT_PORT!,
    credentials: true,
  }
  
  const apolloServer = new ApolloServer({
    schema,
    subscriptions: {
      onConnect: async (connectionParams: any, webSocket, context) => {
        
        webSocket.setMaxListeners(100)
        console.log("Websocket CONNECTED")
        console.log("컨넥션 파라미터" + JSON.stringify(connectionParams.reWebsocket))
        
        // if (!connectionParams.reWebsocket) {
        //   webSocket.close()
        //   webSocket.terminate()
        // }

        await pubsub.publish("publishUser", {
          publishUser: context.request
        }).then((result) => {
          console.log("실행완료")
        })

        return context
      },
    
      onDisconnect: async ( webSocket, context) => {
        console.log('Websocket DISCONNECTED');
        //console.log("인커밍 컨텍스트 + " + JSON.stringify(context.request))
        
        webSocket.close()
        webSocket.terminate()
      },
      //keepAlive
    },
    context: ({ req, res }) => ({ req, res, authUser }),
    //playground: false
  })
  
  app.use(cookieparser())
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  
  

  //httpServer.timeout = 5000

  httpServer.listen({ url: SERVER_URL, port: SERVER_PORT }, () => {
  console.log(`🚀 Server ready at ${SERVER_URL}:${SERVER_PORT}${apolloServer.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws:${SERVER_URL}:${SERVER_PORT}${apolloServer.subscriptionsPath}`);
  });

  
  //app.use('/', routerForAPI)

  app.listen(3000, () => console.log("Node server is running for API"))
})();

