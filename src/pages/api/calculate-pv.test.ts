import fetch from "cross-fetch";
import { createServer, Server } from "http";
import { parse } from "url";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";
import handler from "./calculate-pv";

// A helper function to create a mock NextApiRequest object
const createMockRequest = (req: IncomingMessage): NextApiRequest => {
  const parsedUrl = parse(req.url as string, true);

  const mockReq: NextApiRequest = {
    ...req,
    query: parsedUrl.query,
    cookies: {},
    body: {},
    env: {},
    setTimeout: (msecs: number, callback?: () => void) => {
      req.setTimeout(msecs, callback);
      return mockReq;
    },
  };

  return mockReq;
};

// A helper function to start the server and define the API URL
const startServerAndGetApiUrl = async (): Promise<string> => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const mockReq = createMockRequest(req);
    handler(mockReq, res as NextApiResponse);
  });

  const { port } = await new Promise<{ port: number }>((resolve) =>
    server.listen(0, () => resolve(server.address() as { port: number }))
  );

  return `http://localhost:${port}`;
};

describe("calculate-pv API endpoint", () => {
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

  // Add more tests for your API endpoint here
});
