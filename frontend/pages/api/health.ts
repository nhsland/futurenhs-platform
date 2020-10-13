import { NextApiRequest, NextApiResponse } from "next";

import { ENV_VAR_NAMES } from "../../lib/server/requireEnv";

export default (_: NextApiRequest, res: NextApiResponse) => {
  const missingEnvVars = Object.keys(ENV_VAR_NAMES).filter(
    (name) => !process.env[name]
  );
  if (missingEnvVars.length > 0) {
    res.status(500).json({
      status: "Error",
      message: `Missing environment variables: ${missingEnvVars.join(", ")}`,
    });
  } else {
    res.status(200).json({ status: "Healthy" });
  }
};
