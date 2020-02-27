import { Note } from "../utils/types";
import { State, PlayingResult, Question } from "./types";
import MisskeyUtils from "../utils/misskey-utils";

const playing = async (
  note: Note,
  type: string,
  masterId: string,
  problem: string,
  misskeyUtils: MisskeyUtils
): Promise<PlayingResult> => {
  const memberIds: string[] = [];
  const questions: Question[] = [];

  const text = note.text ?? "";
  if (type === "mention") {
    if (masterId === note.userId) {
      const match = text.match(/^end (.+)/);
      if (match) {
        misskeyUtils.noteHome(
          `Q&A\n`,
          `[問題]\n` +
            `<center>**${problem}**</center>\n` +
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
      if (!memberIds.includes(note.userId)) {
        memberIds.push(note.userId);
      }
      const umigameNote = await misskeyUtils.noteSpecified(
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

      misskeyUtils.capture(umigameNote.id);

      questions.push({
        text: note.text ?? "",
        questionNoteId: note.id,
        umigameNoteId: umigameNote.id,
        userId: note.userId
      });

      return {
        nextState: State.Playing,
        isError: false
      };
    }
  } else if (type === "noteUpdated") {
    console.debug("回答きたよ");
    return {
      nextState: State.Playing,
      isError: true
    };
  }
  return {
    nextState: State.End,
    isError: true
  };
};

export default playing;
