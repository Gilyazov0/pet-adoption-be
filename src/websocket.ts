import { Server } from "http";
import WebSocket from "ws";
import querystring from "node:querystring";

type Connection = { ws: WebSocket.WebSocket; userId: string; chatId: string };

let connections: Connection[] = [];
export default async function websocketServer(expressServer: Server) {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websocket",
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on(
    "connection",
    function connection(wsConnection, connectionRequest) {
      const params = querystring.parse(getQueryString(connectionRequest.url!));

      if (
        typeof params.chatId === "string" &&
        typeof params.userId === "string"
      )
        addConnection({
          ws: wsConnection,
          chatId: params.chatId,
          userId: params.userId,
        });

      wsConnection.on("message", (message) => {
        const { msg, chatId, userId, name } = JSON.parse(message.toString());

        connections.forEach((connection) => {
          if (chatId === connection.chatId && userId !== connection.userId) {
            connection.ws.send(
              JSON.stringify({
                msg,
                authorId: userId,
                name,
              })
            );
          }
        });
      });
    }
  );

  function addConnection(newConnection: Connection) {
    connections = connections.filter(
      (con) =>
        con.chatId !== newConnection.chatId ||
        con.userId !== newConnection.userId
    );
    connections.push(newConnection);
  }

  function getQueryString(url: string): string {
    if (!url) return "";
    const index = url.indexOf("?");
    return index === -1 || index >= url.length ? "" : url.slice(index + 1);
  }

  return websocketServer;
}
