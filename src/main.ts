import MisskeyUtils from "./utils/misskey-utils";
import * as WebSocket from "websocket";
import * as dotenv from "dotenv";
import onMessage from "./onmessage";
import Umigame from "./umigame/umigame";

dotenv.config();

const token = process.env.MISSKEY_TOKEN;
if (!token) {
  console.error("Make .env file !!");
  process.exit(-1);
}

const client = new WebSocket.client();

client.on("connectFailed", error => {
  console.error("Connect Error: " + error.toString());
  setTimeout(
    () => client.connect("wss://misskey.m544.net/streaming?i=" + token),
    6000
  );
});

client.on("connect", connection => {
  console.info("WebSocket Client Connected");

  const misskeyUtils = new MisskeyUtils(token, connection);
  const umigame = new Umigame(misskeyUtils);

  const mainChannelId = "main";
  const globalTLChannelId = "global";

  connection.sendUTF(MisskeyUtils.getMainJson(mainChannelId));
  connection.sendUTF(MisskeyUtils.getGlobalTLJson(globalTLChannelId));

  connection.on("error", error => {
    console.error("Connection Error: " + error.toString());
    connection.close();
  });
  connection.on("close", () => {
    console.info("WebSocket Client Closed");
    setTimeout(
      () => client.connect("wss://misskey.m544.net/streaming?i=" + token),
      6000
    );
  });

  connection.on("message", message => {
    onMessage(message, misskeyUtils, umigame, mainChannelId);
  });
});

client.connect("wss://misskey.m544.net/streaming?i=" + token);
