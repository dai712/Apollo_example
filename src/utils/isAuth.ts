import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "./MyContext";



export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("인증 ㄴ1");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, "&YK#t!XQDuN&2wSWcd53kDa-!w8BAjuAL34bdyYe^^D52r6eeYtXLK%yvn5ZuAPKc6^K9ewMz");
    console.log(payload);
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("인증 ㄴ2");
  }
  return next();
};
