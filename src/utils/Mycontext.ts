import { Request, Response } from "express";
import { User } from "../api/entity/User"

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { user: User };
}
