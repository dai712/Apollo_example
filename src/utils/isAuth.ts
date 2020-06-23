import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "./MyContext";



export const isAuth = (token: string) => {
  let payload;
  if (!token) {
    throw new Error("Incorrect format for token");
  }

  try {
    payload = verify(token, process.env.JWT_TOKEN!);
    
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  return payload;
}
