import { ResolverMap } from "../types/ResolverType"
import { User } from "../entity/User"

export const resolver: ResolverMap = {
  Query: {
    hello: (_: any, { name }: any) => `hello ${name || "World"}`,
    user: (_, { id }) => User.findByIds(id),
    users: _ => User.find()
  },
  Mutation: {
    createUser: (_, args) => User.create(args)
  }
}