import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "./MyContext";



export const isAuth = (token: string) => {
  let payload;
  console.log("isauth들어온 토큰"+ token)
  if (!token) {
    throw new Error("인증 ㄴ1");
  }

  try {
    payload = verify(token, "&YK#t!XQDuN&2wSWcd53kDa-!w8BAjuAL34bdyYe^^D52r6eeYtXLK%yvn5ZuAPKc6^K9ewMz");
    console.log(payload);
    
  } catch (err) {
    console.log(err);
    throw new Error("인증 ㄴ2");
  }
  return payload;
}
