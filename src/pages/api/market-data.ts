// pages/api/market-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
interface MarketData {
  // define the properties of the market data object
  // for example:
  symbol: string;
  price: number;
  volume: number;
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const collection = client
      .db("your-db-name")
      .collection("your-collection-name");

    if (req.method === "POST") {
      // Upload market data
      const { symbol, price, volume } = req.body as MarketData;
      await collection.updateOne(
        { _id: symbol },
        { $set: { price, volume } },
        { upsert: true }
      );
      res.status(200).json({ message: `Market data for ${symbol} uploaded` });
    } else if (req.method === "GET") {
      // Retrieve market data
      const { symbol } = req.query;
      const result = await collection.findOne({ _id: symbol });
      res.status(200).json(result ? result.data : {});
    } else {
      res.setHeader("Allow", ["POST", "GET", "PUT"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error connecting to the database" });
  } finally {
    await client.close();
  }
}

export default handler;
