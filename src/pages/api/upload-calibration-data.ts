// pages/api/upload-calibration-data.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

let calibrationDataStorage: { [id: string]: any } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const calibrationData = req.body;
      const id = uuidv4();
      calibrationDataStorage[id] = calibrationData;
      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
