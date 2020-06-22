import {
  fileLoader,
  mergeResolvers,
  mergeTypes
} from "merge-graphql-schemas";
import path from "path";
import { makeExecutableSchema } from "graphql-tools";

const allTypes = fileLoader(path.join(__dirname, "./api/**/*.graphql"));
// api 폴더 안에 모든 폴더에 모든 graphql 파일을 불러온다.

const allResolvers = fileLoader(path.join(__dirname, "./api/**/*.ts"));
// api 폴더 안에 모든 폴더에 모든 js(resolver) 파일을 불러온다.


export const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers)
});

// schema 변수에 typeDefs, resolvers를 정의하여 담아주고 그것을 export 해준다.

