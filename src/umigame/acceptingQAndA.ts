import { Note } from "../utils/types";
import { State, NoteResult } from "./types";

const acceptingQAndA = (note: Note): NoteResult => {
  const text = note.text ?? "";

  if (/end .+/.test(text)) {
    return {
      nextState: State.AcceptingQAndA,
      isFailed: false,
      message: ""
    };
  } else {
    return {
      nextState: State.WaitingGameStart,
      isFailed: false,
      message: 'Not "start *****" syntax.'
    };
  }
};

export default acceptingQAndA;
