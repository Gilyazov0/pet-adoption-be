import { server, prismaClient, wsServer } from "../server";

export default async function handleExit(
  code: number,
  timeout: number = 5000
): Promise<void> {
  try {
    console.log(`Attempting a graceful shutdown with code ${code}`);

    setTimeout(() => {
      console.log(`Forcing a shutdown with code ${code}`);
      process.exit(code);
    }, timeout).unref();

    if (server.listening) {
      console.log("Closing HTTP server");
      server.close();
    }

    prismaClient.$disconnect();
    console.log("Closing database connection");

    wsServer.disconnect();
    console.log("Closing websocket connections");

    console.log(`Exiting gracefully with code ${code}`);
    process.exit(code);
  } catch (error) {
    console.log("Error shutting down gracefully");
    console.log(error);
    console.log(`Forcing exit with code ${code}`);
    process.exit(code);
  }
}
