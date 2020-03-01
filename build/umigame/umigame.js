"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../utils/types");
const waiting_1 = __importDefault(require("./waiting"));
const playing_1 = __importDefault(require("./playing"));
class Umigame {
    constructor(misskeyUtils) {
        this.state = 0 /* Waiting */;
        this.misskeyUtils = misskeyUtils;
        this.masterId = "";
        this.problem = "";
        console.log("Initialization Complete !");
    }
    async update(body) {
        var _a, _b;
        if (this.state === 0 /* Waiting */) {
            if (!types_1.isNote(body.body))
                return;
            const result = await waiting_1.default(body.body, this.misskeyUtils);
            if (!result.isError) {
                this.masterId = (_a = result.masterId, (_a !== null && _a !== void 0 ? _a : ""));
                this.state = result.nextState;
                this.problem = (_b = result.problem, (_b !== null && _b !== void 0 ? _b : ""));
            }
            else {
                this.exitGameAbnormally;
            }
        }
        else if (this.state === 1 /* Playing */) {
            const result = await playing_1.default(body, this.masterId, this.problem, this.misskeyUtils);
            if (!result.isError) {
                this.state = result.nextState;
                if (this.state === 2 /* End */) {
                    this.exitGameNormally();
                }
            }
            else {
                this.exitGameAbnormally();
            }
        }
    }
    reset() {
        this.state = 0 /* Waiting */;
        this.masterId = "";
        this.problem = "";
    }
    exitGameNormally() {
        this.reset();
    }
    exitGameAbnormally() {
        console.log("Now Waiting....");
        this.reset();
    }
}
exports.default = Umigame;
//# sourceMappingURL=umigame.js.map