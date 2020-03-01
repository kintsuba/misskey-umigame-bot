"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const misskey_utils_1 = __importDefault(require("./utils/misskey-utils"));
const WebSocket = __importStar(require("websocket"));
const dotenv = __importStar(require("dotenv"));
const onmessage_1 = __importDefault(require("./onmessage"));
const umigame_1 = __importDefault(require("./umigame/umigame"));
dotenv.config();
const token = process.env.MISSKEY_TOKEN;
if (!token) {
    console.error("Make .env file !!");
    process.exit(-1);
}
const client = new WebSocket.client();
client.on("connectFailed", error => {
    console.error("Connect Error: " + error.toString());
    setTimeout(() => client.connect("wss://misskey.m544.net/streaming?i=" + token), 6000);
});
client.on("connect", connection => {
    console.info("WebSocket Client Connected");
    const misskeyUtils = new misskey_utils_1.default(token, connection);
    const umigame = new umigame_1.default(misskeyUtils);
    const mainChannelId = "main";
    connection.sendUTF(misskey_utils_1.default.getMainJson(mainChannelId));
    connection.on("error", error => {
        console.error("Connection Error: " + error.toString());
        connection.close();
    });
    connection.on("close", () => {
        console.info("WebSocket Client Closed");
        setTimeout(() => client.connect("wss://misskey.m544.net/streaming?i=" + token), 6000);
    });
    connection.on("message", message => {
        onmessage_1.default(message, misskeyUtils, umigame, mainChannelId);
    });
});
client.connect("wss://misskey.m544.net/streaming?i=" + token);
//# sourceMappingURL=main.js.map