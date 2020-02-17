import { Note } from "../utils/types";
import { State, PlayingResult } from "./types";

const playing = (
  note: Note,
  masterId: string,
  memberIds: string[]
): PlayingResult => {
  const text = note.text ?? "";
  if (/end .+/.test(text)) {
    if (masterId) {
      return {
        nextState: State.Playing,
        isError: false,
        noteMasterMessage: ""
      };
    } else {
      return {
        nextState: State.Playing,
        isError: false,
        noteMasterMessage: ""
      };
    }
  } else {
    return {
      nextState: State.Waiting,
      isError: false,
      noteMasterMessage: 'Not "start *****" syntax.'
    };
  }
};

export default playing;
