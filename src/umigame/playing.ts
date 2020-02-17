import { Note } from "../utils/types";
import { State, NoteResult } from "./types";

const playing = (note: Note): NoteResult => {
  const text = note.text ?? "";

  if (/end .+/.test(text)) {
    return {
      nextState: State.Playing,
      isError: false,
      message: ""
    };
  } else {
    return {
      nextState: State.Waiting,
      isError: false,
      message: 'Not "start *****" syntax.'
    };
  }
};

export default playing;
