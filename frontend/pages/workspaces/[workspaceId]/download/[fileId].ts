import { NextApiRequest, NextApiResponse } from "next";

// @ts-ignore
export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req);
  console.log(res);
};
