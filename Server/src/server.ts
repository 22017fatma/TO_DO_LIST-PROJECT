import * as dotenv from "dotenv";
import { createServer } from "node:http";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Test Server running on http://localhost:${PORT}`);
});
