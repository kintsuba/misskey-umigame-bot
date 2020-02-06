import MisskeyUtils from "./utils/misskey-utils";
import { Note } from "./utils/types";
import * as WebSocket from "websocket";
import Umigame from "./umigame/umigame";
import { State } from "./umigame/types";

interface MisskeyMessage {
  type: string;
  body: MisskeyMessageBody;
}

interface MisskeyMessageBody {
  id: string;
  type: string;
  body: Note;
}

let umigame: Umigame;

const onMessage = (
  message: WebSocket.IMessage,
  misskeyUtils: MisskeyUtils,
  mainChannelId: string,
  globalTLChannelId: string
): void => {
  if (!message.utf8Data) return;
  const data = JSON.parse(message.utf8Data) as MisskeyMessage;

  if (data.body.id === mainChannelId && data.body.type === "followed") {
    misskeyUtils.follow(data.body.body.id); // フォロー返し
  } else if (
    data.body.id === globalTLChannelId &&
    data.body.type === "mention"
  ) {
    const text = data.body.body.text;
    if (!text) return;

    if (
      /(スタート|すたーと|start|はじめる|始める|play|ぷれい|プレイ|やる)/.test(
        text
      )
    ) {
      const state = umigame.state ?? State.NotPlaying;
      if (state === State.NotPlaying) {
        umigame = new Umigame(data.body.body);
      } else {
        umigame.update(data.body.body);
      }
    } else {
      umigame.update(data.body.body);
    }
  }
};

export default onMessage;
