import { Note } from "../utils/types";
import { State, NoteResult } from "./types";

const waiting = (note: Note): NoteResult => {
  const text = note.text ?? "";

  if (/start .+/.test(text)) {
    return {
      nextState: State.Playing,
      isError: false,
      message: "Start game successfully."
    };
  } else {
    return {
      nextState: State.Waiting,
      isError: false,
      message: 'Not "start *****" syntax.'
    };
  }
};

export default waiting;
