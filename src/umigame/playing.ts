import { isNote, isVote, MisskeyMessageBody } from "../utils/types";
import { State, PlayingResult, Question, voteChoice } from "./types";
import MisskeyUtils from "../utils/misskey-utils";

const memberIds: string[] = [];
const questions: Question[] = [];

const playing = async (
  body: MisskeyMessageBody,
  masterId: string,
  problem: string,
  misskeyUtils: MisskeyUtils
): Promise<PlayingResult> => {
  console.log("Start Playing.");

  if (isNote(body.body)) {
    const note = body.body;
    const text = note.text ?? "";
    if (masterId === note.userId) {
      // 出題者からの返信
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
      // 出題者以外からの返信
      if (!memberIds.includes(note.userId)) {
        console.debug(note.userId);
        memberIds.push(note.userId);
        console.debug(memberIds);
      }
      const umigameNote = await misskeyUtils.noteSpecified(
        "[質問]\n" + note.text,
        [masterId],
        undefined,
        {
          choices: voteChoice
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
  } else if (isVote(body.body)) {
    const vote = body.body;

    console.debug(`${vote.userId}: ${vote.choice}`);

    const question = questions.find(q => q.umigameNoteId === body.id);
    if (question) question.answer = voteChoice[vote.choice];
    misskeyUtils.noteSpecified(
      `[質問]\n` +
        `${question?.text}\n` +
        `[回答]\n` +
        `${voteChoice[vote.choice]}`,
      memberIds
    );
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
