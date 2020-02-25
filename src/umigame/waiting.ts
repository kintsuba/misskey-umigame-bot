import { Note } from "../utils/types";
import { State, WaitingResult } from "./types";
import MisskeyUtils from "../utils/misskey-utils";

const waiting = async (
  note: Note,
  misskeyUtils: MisskeyUtils
): Promise<WaitingResult> => {
  const text = note.text ?? "";
  const match = text.match(/start (.+)/);
  if (match) {
    await misskeyUtils.noteHome(
      "【ウミガメのスープって？】\n" +
        "出題者が出した問題に対して、「はい」か「いいえ」のみで答えられる質問のみで真相を解き明かすゲームです。\n\n" +
        "【進め方】\n" +
        "このbotの投稿にリプライすることで進行していきます。できれば邪魔にならないよう、ホームやダイレクト投稿でお願いいたします。また、取り消しはできないので誤字等注意してください。\n\n" +
        "【終わり方】\n" +
        "解答が出てゲームを終了する場合、出題者がこのbotに対して`end *****(解答)`のようにリプライすることで終了します。" +
        "何らかの理由で途中でゲームを終了したい場合は、出題者がこのbotに対して `end` とだけリプライしてください。",
      "ウミガメのスープを始めます。参加したい方は、この投稿に「はい」か「いいえ」のみで答えられる質問文をリプライしてください。\n" +
        "【今回の問題】\n" +
        `<center>**${match[1]}**</center>`
    );

    return {
      nextState: State.Playing,
      isError: false,
      question: match[1],
      masterId: note.userId
    };
  } else {
    return {
      nextState: State.Waiting,
      isError: false
    };
  }
};

export default waiting;
