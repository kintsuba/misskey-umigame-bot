import { Note } from "../utils/types";
import { State, NoteResult } from "./types";

const waitingGameStart = (note: Note): NoteResult => {
  const text = note.text ?? "";

  if (/start .+/.test(text)) {
    return {
      nextState: State.AcceptingQAndA,
      isFailed: false,
      message: "Start game successfully."
    };
  } else {
    return {
      nextState: State.WaitingGameStart,
      isFailed: false,
      message: 'Not "start *****" syntax.'
    };
  }
};

export default waitingGameStart;
