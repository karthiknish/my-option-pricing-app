// pages/api/calculate-pv.ts
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
import { Pricer_Black76 } from "../../utils/black76";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { priceDate, futurePrice, volatility, maturityDate, rf, strike } =
      req.body;

    const pricer = new Pricer_Black76(
      DateTime.fromISO(maturityDate),
      rf,
      strike
    );
    const [call, put] = pricer.PV(
      DateTime.fromISO(priceDate),
      futurePrice,
      volatility
    );

    res.status(200).json({ call, put });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;
