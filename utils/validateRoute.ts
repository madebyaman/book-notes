import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../firebase";

export const validateRoute = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { ACCESS_TOKEN: token} = req.cookies;

    if (token) {
      let user;
      try {
        const {id} = verify(token, process.env.JWT_SECRET || "secret") as {id: string};
        user = await auth.getUser(id);
      }
    }
  }
}
