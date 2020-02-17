export const enum State {
  WaitingGameStart,
  AcceptingQAndA
}

export type NoteResult = {
  nextState: State;
  isFailed: boolean;
  message: string;
};
