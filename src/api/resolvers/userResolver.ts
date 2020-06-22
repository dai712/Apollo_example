import { ResolverMap } from "../types/ResolverType"
import { User } from "../entity/User"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { isAuth } from "../../utils/isAuth"
import createJWT  from "../../utils/createJWT"
import bcrypt from "bcrypt"
import { MyContext } from "../../utils/MyContext";
import { PubSub, withFilter } from "apollo-server-express"

const pubsub = new PubSub()
let firstToken;
let secToken;
let lastToken;

export const resolver = {
  Query: {
    hello: (_: any, { name }: any, context: MyContext) => {
      pubsub.publish("messageReceived", {
        messageReceived: name
      });
      return `${name}`
    },
    user: (_, { nickname }) => User.findOne({ where: { nickname: nickname } }),
    users: _ => User.find(),

  },
  Mutation: {
    createUser: async (_, args: User) => {
      const user = await User.findOne({ where: { nickname: args!.nickname } })
    
      if (user != null) throw new Error("이미 존재하는 닉네임.");

      await bcrypt.hash(args.password, 10, async function (err, res) {
        args.password = res;
        const user = User.create(args);
        user.money = 100000;
        await user.save().then((result) => {
          console.log(result)
        })
      })
      return true
    },

    deleteUser: async (_, args: any, context: MyContext) => {

      if (!context.req.headers.authorization) throw new Error('접속중이 아닙니다.')

      secToken = context.req.headers["authorization"]
      lastToken = (context.req.headers["cookie"])!.split('=')[1]
      
      
      
      let token = firstToken + "." + secToken + "." + lastToken
      let payload = isAuth(token);
      console.log(isAuth(token))

      await User.delete({ nickname: payload!.user.nickname })
      return true
    },

    loginUser: async (_, args: User, context: MyContext) => {
      const user = await User.findOne({ where: { nickname: args.nickname } })

      if (!user) throw new Error("유저를 찾을수 업써여");
      
      const verify = await bcrypt.compare(args.password, user!.password).then((result) => {
        if (result == false) throw new Error("잘못된 비번");
      })

      let token = createJWT(user)
      firstToken = token[0];

      context.res.cookie('token', token[2], { httpOnly: true })
    
      return token[1]
    }
  },
  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["messageReceived"]),
        async (payload, variables, context) => {
          
          return true
          // const target: Target = payload.messageReceived.target;
          // const receiverId: string = payload.messageReceived.receiverId;
          // const target: Target = payload.messageReceived.target;
          // const receiverId: string = payload.messageReceived.receiverId;

          // if (context.authCheck) {
          //   if (
          //     target === Target.PERSONAL &&
          //     receiverId === context.authUser.id
          //   ) {
          //     return true;
          //   } else if (target === Target.ORGANIZATION) {
          //     const userRole = await getRepository(UserRole).findOne({
          //       where: {
          //         userId: context.authUser.id,
          //         hospitalId: receiverId,
          //       },
          //     });

          //     if (!userRole) return false;
          //     return true;
          //   } else {
          //     return false;
          //   }
          // } else {
          //   return false;
          // }
        }
      )
      },
    }
  }
