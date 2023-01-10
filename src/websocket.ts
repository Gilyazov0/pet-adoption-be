import { IncomingMessage, Server } from "http";
import WebSocket from "ws";
import querystring from "node:querystring";
import ChatModel from "./model/chatModel";
import { Chat } from "@prisma/client";

type Connection = { ws: WebSocket.WebSocket; userId: string; chatId: string };

export default class WebsocketServer {
  private connections: Connection[] = [];
  private server: WebSocket.Server;
  private expressServer: Server;

  constructor(expressServer: Server) {
    this.expressServer = expressServer;
    this.server = new WebSocket.Server({
      noServer: true,
      path: "/websocket",
    });

    this.onUpgrade();
    this.server.on("connection", this.HandleConnection.bind(this));
  }

  private onUpgrade() {
    this.expressServer.on("upgrade", (request, socket, head) => {
      this.server.handleUpgrade(request, socket, head, (websocket) => {
        this.server.emit("connection", websocket, request);
      });
    });
  }

  private HandleConnection(
    wsConnection: WebSocket.WebSocket,
    connectionRequest: IncomingMessage
  ) {
    const params = querystring.parse(
      this.getQueryString(connectionRequest.url!)
    );

    if (typeof params.chatId === "string" && typeof params.userId === "string")
      this.addConnection({
        ws: wsConnection,
        chatId: params.chatId,
        userId: params.userId,
      });

    wsConnection.on("message", (message) => {
      const { msg, chatId, userId, name } = JSON.parse(message.toString());

      this.StoreMessage(chatId, userId, msg);

      this.connections.forEach((connection) => {
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

  private StoreMessage(chatId: number, authorId: number, message: string) {
    const data = { authorId: +authorId, chatId: +chatId, message };
    ChatModel.addMessage(data);
  }

  private addConnection(newConnection: Connection) {
    this.connections = this.connections.filter(
      (con) =>
        con.chatId !== newConnection.chatId ||
        con.userId !== newConnection.userId
    );
    this.connections.push(newConnection);
  }

  private getQueryString(url: string): string {
    if (!url) return "";
    const index = url.indexOf("?");
    return index === -1 || index >= url.length ? "" : url.slice(index + 1);
  }
}
