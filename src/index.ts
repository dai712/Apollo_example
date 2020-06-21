import dotenv from "dotenv"
dotenv.config()
import "reflect-metadata"
import {
  createConnection,
  ConnectionOptions
} from "typeorm"
import {
  ApolloServer,
  PubSub
} from "apollo-server-express"
import { buildSchema } from "type-graphql"
import cors from "cors"
import connectionOptions from "./typeConfig"

console.log(connectionOptions.type)
console.log(process.env.JWT_TOKEN)
