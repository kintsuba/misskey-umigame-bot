import MisskeyUtils from "./utils/misskey-utils";
import { Note, MisskeyMessage, Follow, Vote } from "./utils/types";
import * as WebSocket from "websocket";
import Umigame from "./umigame/umigame";

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
    const follow = data.body.body as Follow;
    misskeyUtils.follow(follow.id); // フォロー返し
  } else if (data.body.id === mainChannelId) {
    if (data.body.type === "mention") {
      const note = data.body.body as Note;
      if (!note.text) return;

      umigame.update(note);
    } else if (data.body.type === "pollVoted") {
      const vote = data.body.body as Vote;
      if (!vote) return;

      umigame.update(vote);
    }
  }
};

export default onMessage;
