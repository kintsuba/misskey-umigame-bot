export const enum State {
  Waiting,
  Playing,
  End
}

export type WaitingResult = {
  nextState: State;
  masterId?: string;
  question?: string;
  isError: boolean;
};

export type PlayingResult = {
  nextState: State;
  isError: boolean;
};
