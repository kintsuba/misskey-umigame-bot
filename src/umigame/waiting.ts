import { Note } from "../utils/types";
import { State, WaitingResult } from "./types";

const waiting = (note: Note): WaitingResult => {
  const text = note.text ?? "";
  const match = text.match(/start (.+)/);
  if (match) {
    console.debug(match[1]);
    return {
      nextState: State.Playing,
      isError: false,
      noteMemberMessage:
        "【ウミガメのスープって？】\n" +
        "出題者が出した問題に対して、「はい」か「いいえ」のみで答えられる質問のみで真相を解き明かすゲームです。\n\n" +
        "【進め方】\n" +
        "このbotの投稿にリプライすることで進行していきます。できれば邪魔にならないよう、ダイレクト投稿でお願いいたします。以降は、各投稿に指示がありますのでそれに従ってください。また、取り消しはできないので誤字等注意してください。\n\n" +
        "【終わり方】\n" +
        "bot宛に出題者が `end`とだけ送った場合終了します。",
      noteMemberMessageCW:
        "ウミガメのスープを始めます。参加したい方は、5分以内にこの投稿へ質問文をリプライしてください。\n" +
        "【今回の問題】\n" +
        `<center>**${match[1]}**</center>`,
      question: match[1]
    };
  } else {
    return {
      nextState: State.Waiting,
      isError: false,
      noteMasterMessage: 'Not "start *****" syntax.'
    };
  }
};

export default waiting;
