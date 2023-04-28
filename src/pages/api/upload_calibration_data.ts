import { NextApiRequest, NextApiResponse } from "next";

// Replace this function with your own Azure durable function logic
async function uploadCalibrationData(data: any) {
  // Implement your Azure durable function logic here
  return { message: "Calibration data uploaded" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const result = await uploadCalibrationData(req.body);
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
