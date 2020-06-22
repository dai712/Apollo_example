import { ResolverMap } from "../types/ResolverType"
import { User } from "../entity/User"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { isAuth } from "../../utils/isAuth"
import createJWT  from "../../utils/createJWT"
import bcrypt from "bcrypt"
import { MyContext } from "../../utils/MyContext";


export const resolver= {
  Query: {
    hello: (_: any, { name }: any) => `hello ${name || "World"}`,
    user: (_, { id }) => User.findByIds(id),
    users: _ => User.find()
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
        return true
      })
    })
    },

    deleteUser: async (_, args: any) => {
      console.log(args)
      await User.delete(args)
    },

    loginUser: async (_, args: User, context: MyContext) => {
      console.log(args)
      const user = await User.findOne({ where: { nickname: args.nickname } })
      console.log(user)
    if (!user) throw new Error("유저를 찾을수 업써여");
      
    const verify = await bcrypt.compare(args.password, user!.password ).then((result) => {
      if(result == false) throw new Error("잘못된 비번");
    })

    let token = createJWT(user)
      
    console.log("만들어준 토큰" + token)


    context.res.cookie('token', token, {httpOnly: true})
    
    return true
    }
  }
}