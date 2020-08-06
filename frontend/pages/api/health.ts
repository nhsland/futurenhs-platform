import { NextApiRequest, NextApiResponse } from "next";

export default (_: NextApiRequest, res: NextApiResponse) => {
  if (
    !process.env.EVENTGRID_TOPIC_ENDPOINT ||
    !process.env.EVENTGRID_TOPIC_KEY
  ) {
    res
      .status(500)
      .json({ status: "Error", message: "Missing environment variables" });
  } else {
    res.status(200).json({ status: "Healthy" });
  }
};
