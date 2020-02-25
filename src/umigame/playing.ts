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
    if (/^end .+/.test(text)) {
      misskeyUtils.replySpecified(
        "ウミガメのスープを終了しました。また遊んでくださいね",
        note.id,
        [masterId]
      );
      return {
        nextState: State.Playing,
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
      misskeyUtils.noteSpecified("[質問]\n" + note.text, [masterId]);
    } else {
      memberIds.push(note.userId);
      misskeyUtils.noteSpecified("[質問]\n" + note.text, [masterId]);
    }
  }
};

export default playing;
