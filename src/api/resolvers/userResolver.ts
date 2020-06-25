import { ResolverMap } from "../types/ResolverType"
import { User } from "../entity/User"
import { Message } from "../entity/Message"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { isAuth } from "../../utils/isAuth"
import { createAccTok, createRefTok }   from "../../utils/createJWT"
import bcrypt from "bcrypt"
import { MyContext } from "../../utils/MyContext";
import { withFilter } from "apollo-server-express"
import { SubscriptionClient, SubscriptionServer } from "subscriptions-transport-ws";
import { pubsub, tokens, sumToken } from "../../utils/Middlewares"




export const resolver = {
  Query: {
    user: (_, { nickname }) => User.findOne({ where: { nickname: nickname } }),
    users: _ => User.find(),

  },
  Mutation: {             
    createUser: async (_, args: User) => {              //회원가입
      const user = await User.findOne({ where: { nickname: args!.nickname } })
      
      if (user != null) throw new Error("이미 존재하는 닉네임.");

      await bcrypt.hash(args.password, 10, async function (err, res) {
        args.password = res;
        await User.create(args).save().then((result) => {
          if(!result) throw new Error("유저 생성 실패")
        })
      })
      return true
    },

    deleteUser: async (_, args: any, context: MyContext) => { //회원탈퇴

      if (!context.req.headers.authorization) throw new Error('접속중이 아닙니다.')

      //console.log("회원탈퇴 유저 : " + User.findOne({where : {id:context.payload!.user.id}}))

      tokens.tokenHeader = context.req.headers["authorization"]
      tokens.tokenSigniture = (context.req.headers["cookie"])!.split('=')[1]
      console.log("머냐" + JSON.stringify((context.req.cookies.accToken)))
      //Cookie-parser 사용할것. 완료
      
      
      let payload = isAuth(sumToken(tokens));
        console.log(payload)
      await User.delete({ id: payload.data }).then((result) => {
        console.log("result: " + result)
        if (!result) throw new Error("에러발생");
      })
      return true
    },

    loginUser: async (_, args: User, context: MyContext) => {     //로그인.

      const user = await User.findOne({ where: { nickname: args.nickname } });
      
      if (!user) throw new Error("유저를 찾을수 업써여");
      
      const verify = await bcrypt.compare(args.password, user!.password).then((result) => {
        if (result == false) throw new Error("잘못된 비번");
      })


      let token = createAccTok(user.id)    //유저의 고유번호만 넘길것.

      console.log("엑세스 : " + token);
      tokens.tokenHeader = token[0];            //JWT 헤더는 서버에


 
      context.res.cookie('accToken', token[2], { httpOnly: true })
      //accTok signiture & refTok 전체 cookie에 담아서 전송.

      return token[1]                                           //페이로드는 바로.
    },
    sendMessageToUsers: async (_, args, context: MyContext) => {            //메세지 전송
      if(!context.req.headers.cookie) throw new Error("로그인중이 아닙니다")
      tokens.tokenPayload = context.req.headers["authorization"]!
      tokens.tokenSigniture = context.req.headers.cookie!.split("=")[1]
     
      let token = isAuth(sumToken(tokens))
      if (!token) throw new Error("인증 실패")

      args.sendId = token.data
      console.log(args)

      await User.findOne({ where: { nickname: args.targetnickname } }).then((result => {
        if (!result) {
          throw new Error("존재하지 않는 닉네임입니다.")
        }
        Message.create()
        args.receivedId = result!.id
      }))



      pubsub.publish("sendMessageToUser", {
        sendMessageToUser: args,
      });
      return true
    }
    // slidingSession: async (_, args, context: MyContext) =>{
    //     //args === refreshToken, verify(refreshToken) == accessToken의 시그니쳐.
    //   const receivedRefToAcc = isAuth(args)
    //   if (!receivedRefToAcc) {
    //     throw new Error("Incorrect ReftToken");
    //   }
    //   UserAuth.findOne({ where: { acctok: receivedRefToAcc } }).then((result) => {
    //     const needReloadUser = User.findOne({ where: { id: result!.id } })
    //     const newAccTok = createAccTok(User.findOne({ where: { id: result!.id } }))
    //     const newRefTok = createRefTok(newAccTok)

    //     result!.acctok = newAccTok[0]
    //     // result!.reftok = newRefTok

    //     result!.save()

    //     context.res.cookie('refToken', newRefTok, { httpOnly: true })
    //     //refToken은 그냥 return해도 무관.
    //     context.res.cookie('accToken', newAccTok[2], {httpOnly: true})
    //   })
    // }
  },
  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["messageReceived"]),
        async (payload, variables, context: MyContext) => {
          console.log("페이로드" + JSON.stringify(payload))
          console.log(context)
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
    publishUser: {
      subscribe: withFilter(
          () => pubsub.asyncIterator(["publishUser"]),
        (payload, variables, context: MyContext) => {
          console.log("페이로드" + JSON.stringify(payload))
          console.log(context)
          return true
        }
      )
    },
    sendMessageToUser: {
      subscribe: 
      withFilter(
              () => pubsub.asyncIterator(["sendMessageToUser"]),
         async (payload, variables, context, info) => {
                console.log(context)
                console.log("페이로드" + JSON.stringify(payload))
                
                
                return true
        }
      ),
    },

    }
  }
