import { request } from "http";
import { PubSub } from "apollo-server-express"


export const authUser = request => {
  if (!request.user) {
    throw new Error("로그인 후 사용 가능");
  }
  return;
};

export const pubsub = new PubSub();

export let tokens = {
  tokenHeader: "",
  tokenPayload: "",
  tokenSigniture: "",
};

export function sumToken(tokens: any){
  return tokens.tokenHeader + "."
    + tokens.tokenPayload + "."
    + tokens.tokenSigniture
}


//object.freeze()

// export interface tokens {
//   tokenHeader: String,
//   tokenPayload: String,
//   tokenSigniture: String,
// }