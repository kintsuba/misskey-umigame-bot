export const enum State {
  Waiting,
  Playing
}

export type NoteResult = {
  nextState: State;
  isError: boolean;
  message: string;
};
