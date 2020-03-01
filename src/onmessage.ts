import MisskeyUtils from "./utils/misskey-utils";
import { MisskeyMessage, Follow } from "./utils/types";
import * as WebSocket from "websocket";
import Umigame from "./umigame/umigame";

const onMessage = (
  message: WebSocket.IMessage,
  misskeyUtils: MisskeyUtils,
  umigame: Umigame,
  mainChannelId: string
): void => {
  if (!message.utf8Data) return;
  const data = JSON.parse(message.utf8Data) as MisskeyMessage;

  if (data.body.id === mainChannelId) {
    if (data.body.type === "followed") {
      const follow = data.body.body as Follow;
      misskeyUtils.follow(follow.id); // フォロー返し
    } else if (data.body.type === "mention") {
      umigame.update(data.body);
    }
  } else {
    if (data.body.type === "pollVoted") {
      umigame.update(data.body);
    }
  }
};

export default onMessage;
