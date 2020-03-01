"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const types_1 = require("./types");
class MisskeyUtils {
    constructor(token, connection) {
        this.fetchJson = async (url, json, credentials = "omit"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) => {
            const postData = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: credentials,
                body: json
            };
            try {
                const response = await node_fetch_1.default(url, postData);
                if (response.ok) {
                    console.log(`${response.status} OK`);
                    return await response.json();
                }
                else {
                    console.log(`${response.status} Error`);
                    return await response.json();
                }
            }
            catch (err) {
                console.error(err);
            }
        };
        this.note = async ({ text, visibility, replyId = "", renoteId = "", cw, localOnly = false, poll = { multiple: false }, visibleUserIds }) => {
            const noteObj = {
                visibility: visibility,
                text: text,
                replyId: replyId,
                renoteId: renoteId,
                localOnly: localOnly,
                cw: cw,
                poll: poll,
                visibleUserIds: visibleUserIds,
                i: this.token
            };
            if (!cw)
                delete noteObj.cw;
            if (!replyId)
                delete noteObj.replyId;
            if (!renoteId)
                delete noteObj.renoteId;
            if (!poll.choices || poll.choices.length === 0)
                delete noteObj.poll;
            if (!visibleUserIds || visibleUserIds.length === 0)
                delete noteObj.visibleUserIds;
            const noteJson = JSON.stringify(noteObj);
            return (await this.fetchJson("https://misskey.m544.net/api/notes/create", noteJson, "include")).createdNote;
        };
        this.noteHome = (text, cw) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Home,
                cw: cw
            });
        };
        this.noteFollowers = (text, cw) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Followers,
                cw: cw
            });
        };
        this.notePublic = (text, cw) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Public,
                cw: cw
            });
        };
        this.noteSpecified = (text, visibleUserIds, cw, poll) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Specified,
                visibleUserIds: visibleUserIds,
                cw: cw,
                poll: poll
            });
        };
        this.replyHome = (text, replyId) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Home,
                replyId: replyId
            });
        };
        this.replyFollowers = (text, replyId) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Followers,
                replyId: replyId
            });
        };
        this.replyPublic = (text, replyId) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Public,
                replyId: replyId
            });
        };
        this.replySpecified = (text, replyId, visibleUserIds) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Specified,
                replyId: replyId,
                visibleUserIds: visibleUserIds
            });
        };
        this.replyHomeWithPoll = (text, replyId, poll) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Home,
                replyId: replyId,
                poll: poll
            });
        };
        this.replySpecifiedWithPoll = (text, replyId, visibleUserIds, poll) => {
            return this.note({
                text: text,
                visibility: MisskeyUtils.Visibility.Specified,
                replyId: replyId,
                visibleUserIds: visibleUserIds,
                poll: poll
            });
        };
        this.message = (text, userId) => {
            const messageJson = JSON.stringify({
                userId: userId,
                text: text,
                i: this.token
            });
            return this.fetchJson("https://misskey.m544.net/api/messaging/messages/create", messageJson, "include");
        };
        this.follow = (userId) => {
            const followJson = JSON.stringify({
                userId: userId,
                i: this.token
            });
            return this.fetchJson("https://misskey.m544.net/api/following/create", followJson, "include");
        };
        this.unfollow = (userId) => {
            const unfollowJson = JSON.stringify({
                userId: userId,
                i: this.token
            });
            return this.fetchJson("https://misskey.m544.net/api/following/create", unfollowJson, "include");
        };
        this.capture = (id) => {
            this.connection.sendUTF(JSON.stringify({
                type: "subNote",
                body: {
                    id: id
                }
            }));
        };
        this.unCapture = (id) => {
            this.connection.sendUTF(JSON.stringify({
                type: "unsubNote",
                body: {
                    id: id
                }
            }));
        };
        this.token = token;
        this.connection = connection;
    }
}
exports.default = MisskeyUtils;
MisskeyUtils.Visibility = types_1.Visibility;
MisskeyUtils.getGlobalTLJson = (id) => {
    return JSON.stringify({
        type: "connect",
        body: {
            channel: "globalTimeline",
            id: id
        }
    });
};
MisskeyUtils.getHybridTLJson = (id) => {
    return JSON.stringify({
        type: "connect",
        body: {
            channel: "hybridTimeline",
            id: id
        }
    });
};
MisskeyUtils.getLocalTLJson = (id) => {
    return JSON.stringify({
        type: "connect",
        body: {
            channel: "localTimeline",
            id: id
        }
    });
};
MisskeyUtils.getHomeTLJson = (id) => {
    return JSON.stringify({
        type: "connect",
        body: {
            channel: "homeTimeline",
            id: id
        }
    });
};
MisskeyUtils.getMainJson = (id) => {
    return JSON.stringify({
        type: "connect",
        body: {
            channel: "main",
            id: id
        }
    });
};
//# sourceMappingURL=misskey-utils.js.map