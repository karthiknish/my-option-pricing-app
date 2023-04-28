// pages/api/market-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const collection = client
      .db("your-db-name")
      .collection("your-collection-name");

    if (req.method === "POST") {
      // Upload market data
      const { data } = req.body;
      await collection.updateOne(
        { _id: "market_data" },
        { $set: { data: data } },
        { upsert: true }
      );
      res.status(200).json({ message: "Market data uploaded" });
    } else if (req.method === "GET") {
      // Retrieve market data
      const result = await collection.findOne({ _id: "market_data" });
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
