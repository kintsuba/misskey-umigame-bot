import MisskeyUtils from "./utils/misskey-utils";
import { Note } from "./utils/types";
import * as WebSocket from "websocket";
import Umigame from "./umigame/umigame";

interface MisskeyMessage {
  type: string;
  body: MisskeyMessageBody;
}

interface MisskeyMessageBody {
  id: string;
  type: string;
  body: Note;
}

const onMessage = (
  message: WebSocket.IMessage,
  misskeyUtils: MisskeyUtils,
  umigame: Umigame,
  mainChannelId: string,
  globalTLChannelId: string
): void => {
  if (!message.utf8Data) return;
  const data = JSON.parse(message.utf8Data) as MisskeyMessage;

  if (data.body.id === mainChannelId && data.body.type === "followed") {
    misskeyUtils.follow(data.body.body.id); // フォロー返し
  } else if (
    data.body.id === mainChannelId &&
    (data.body.type === "mention" || data.body.type === "noteUpdated")
  ) {
    const text = data.body.body.text;
    if (!text) return;

    umigame.update(data.body.body, data.body.type);
  }
};

export default onMessage;
