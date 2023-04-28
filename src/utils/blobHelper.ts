// utils/blobHelper.ts
import { MongoClient, Collection, Db } from "mongodb";

class BlobHelper {
  private client: MongoClient;
  private db: Db;

  constructor() {
    // Replace the following line with your MongoDB connection string
    const connectionString =
      process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";

    this.client = new MongoClient(connectionString);
    this.client.connect().then(() => {
      this.db = this.client.db("blobStorage");
    });
  }

  private async getCollection(name: string): Promise<Collection> {
    return this.db.collection(name);
  }

  async upload(
    data: string,
    containerName: string,
    fileName: string
  ): Promise<boolean> {
    try {
      const collection = await this.getCollection(containerName);
      await collection.updateOne(
        { _id: fileName },
        { $set: { data: data } },
        { upsert: true }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async download(
    containerName: string,
    fileName: string
  ): Promise<string | null> {
    try {
      const collection = await this.getCollection(containerName);
      const result = await collection.findOne({ _id: fileName });
      return result ? result.data : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteBlob(containerName: string, fileName: string): Promise<boolean> {
    try {
      const collection = await this.getCollection(containerName);
      await collection.deleteOne({ _id: fileName });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export { BlobHelper };
