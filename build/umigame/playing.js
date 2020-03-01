"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../utils/types");
const types_2 = require("./types");
const memberIds = [];
const questions = [];
const getQandA = () => {
    let result = "";
    questions.forEach(q => {
        var _a;
        result = `${result}Q. ${q.text}\nA. ${_a = q.answer, (_a !== null && _a !== void 0 ? _a : "")}\n\n`;
    });
    return result;
};
const playing = async (body, masterId, problem, misskeyUtils) => {
    var _a, _b, _c, _d;
    console.log("Start Playing.");
    if (types_1.isNote(body.body)) {
        const note = body.body;
        const text = (_a = note.text, (_a !== null && _a !== void 0 ? _a : ""));
        if (masterId === note.userId) {
            // 出題者からの返信
            const match = text.match(/^end (.+)/s);
            if (match) {
                if (process.env.NODE_ENV === "production") {
                    misskeyUtils.notePublic("[質問一覧]\n" + getQandA(), `[問題]\n` +
                        `<center>**${problem}**</center>\n` +
                        `[解答]\n` +
                        `<center>**${match[1]}**</center>\n\n` +
                        "ウミガメのスープを終了しました。また遊んでくださいね");
                }
                else {
                    misskeyUtils.noteHome("[質問一覧]\n" + getQandA(), `[問題]\n` +
                        `<center>**${problem}**</center>\n` +
                        `[解答]\n` +
                        `<center>**${match[1]}**</center>\n\n` +
                        "ウミガメのスープを終了しました。また遊んでくださいね");
                }
                return {
                    nextState: 2 /* End */,
                    isError: false
                };
            }
            else if (/^end$/.test(text)) {
                if (process.env.NODE_ENV === "production") {
                    misskeyUtils.notePublic("ウミガメのスープを終了しました。また遊んでくださいね", note.id);
                }
                else {
                    misskeyUtils.noteHome("ウミガメのスープを終了しました。また遊んでくださいね", note.id);
                }
                return {
                    nextState: 2 /* End */,
                    isError: false
                };
            }
        }
        else {
            // 出題者以外からの返信
            if (!memberIds.includes(note.userId)) {
                console.debug(note.userId);
                memberIds.push(note.userId);
                console.debug(memberIds);
            }
            const text = (_b = note.text) === null || _b === void 0 ? void 0 : _b.replace(/@umigame/g, "");
            const umigameNote = await misskeyUtils.noteSpecified("[質問]\n" + `<center>**${text}**</center>`, [masterId], undefined, {
                choices: types_2.voteChoice
            });
            misskeyUtils.capture(umigameNote.id);
            questions.push({
                text: (_c = note.text, (_c !== null && _c !== void 0 ? _c : "")),
                questionNoteId: note.id,
                umigameNoteId: umigameNote.id,
                userId: note.userId
            });
            return {
                nextState: 1 /* Playing */,
                isError: false
            };
        }
    }
    else if (types_1.isVote(body.body)) {
        const vote = body.body;
        console.debug(`${vote.userId}: ${vote.choice}`);
        const question = questions.find(q => q.umigameNoteId === body.id);
        if (question)
            question.answer = types_2.voteChoice[vote.choice];
        misskeyUtils.noteSpecified("[これまでの質問一覧]\n" + getQandA(), memberIds, `[質問]\n` +
            `<center>**${(_d = question) === null || _d === void 0 ? void 0 : _d.text}**</center>\n` +
            `[回答]\n` +
            `<center>**${types_2.voteChoice[vote.choice]}**</center>`);
        return {
            nextState: 1 /* Playing */,
            isError: false
        };
    }
    return {
        nextState: 2 /* End */,
        isError: true
    };
};
exports.default = playing;
//# sourceMappingURL=playing.js.map