import fetch from "cross-fetch";
import { createServer, Server } from "http";
import { parse } from "url";
import { IncomingMessage, ServerResponse } from "http";
import handler from "./market-data";

// A helper function to start the server and define the API URL
const startServerAndGetApiUrl = async (): Promise<string> => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url as string, true);
    handler(req, res);
  });

  const { port } = await new Promise<{ port: number }>((resolve) =>
    server.listen(0, () => resolve(server.address() as { port: number }))
  );

  return `http://localhost:${port}`;
};

describe("market-data API endpoint", () => {
  let apiUrl: string;
  let server: Server;

  beforeAll(async () => {
    apiUrl = await startServerAndGetApiUrl();
  });

  test("responds with 405 for unsupported HTTP methods", async () => {
    const response = await fetch(apiUrl, {
      method: "DELETE",
    });

    expect(response.status).toBe(405);
  });

  test("uploads and retrieves market data", async () => {
    const sampleData = { key: "value" };

    // Upload market data
    const postResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: JSON.stringify(sampleData) }),
    });

    expect(postResponse.status).toBe(200);

    // Retrieve market data
    const getResponse = await fetch(apiUrl);
    const retrievedData = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(retrievedData).toEqual(sampleData);
  });

  // Add more tests for your API endpoint here
});
