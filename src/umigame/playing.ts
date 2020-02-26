import { Note } from "../utils/types";
import { State, PlayingResult } from "./types";
import MisskeyUtils from "../utils/misskey-utils";

const playing = (
  note: Note,
  masterId: string,
  question: string,
  misskeyUtils: MisskeyUtils
): PlayingResult => {
  const memberIds: string[] = [];

  const text = note.text ?? "";
  if (masterId === note.userId) {
    const match = text.match(/^end (.+)/);
    if (match) {
      misskeyUtils.noteHome(
        `Q&A\n`,
        `[問題]\n` +
          `<center>**${question}**</center>\n` +
          `[解答]\n` +
          `<center>**${match[1]}**</center>\n\n` +
          "ウミガメのスープを終了しました。また遊んでくださいね"
      );
      return {
        nextState: State.End,
        isError: false
      };
    } else if (/^end$/.test(text)) {
      misskeyUtils.noteHome(
        "ウミガメのスープを終了しました。また遊んでくださいね",
        note.id
      );
      return {
        nextState: State.End,
        isError: false
      };
    }
  } else {
    if (memberIds.includes(note.userId)) {
      misskeyUtils.noteSpecified(
        "[質問]\n" + note.text,
        [masterId],
        undefined,
        {
          choices: [
            "はい",
            "いいえ",
            "はい(重要)",
            "いいえ(重要)",
            "問題と関係しない質問",
            "既出の質問",
            "回答不能"
          ]
        }
      );
    } else {
      memberIds.push(note.userId);
      misskeyUtils.noteSpecified("[質問]\n" + note.text, [masterId]);
    }
    return {
      nextState: State.Playing,
      isError: false
    };
  }
  return {
    nextState: State.End,
    isError: true
  };
};

export default playing;
