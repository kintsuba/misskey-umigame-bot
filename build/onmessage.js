"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onMessage = (message, misskeyUtils, umigame, mainChannelId) => {
    if (!message.utf8Data)
        return;
    const data = JSON.parse(message.utf8Data);
    if (data.body.id === mainChannelId) {
        if (data.body.type === "followed") {
            const follow = data.body.body;
            misskeyUtils.follow(follow.id); // フォロー返し
        }
        else if (data.body.type === "mention") {
            umigame.update(data.body);
        }
    }
    else {
        if (data.body.type === "pollVoted") {
            umigame.update(data.body);
        }
    }
};
exports.default = onMessage;
//# sourceMappingURL=onmessage.js.map