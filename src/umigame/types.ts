export const enum State {
  Waiting,
  Playing,
  End
}

export type WaitingResult = {
  nextState: State;
  masterId?: string;
  isError: boolean;
  message: string;
};

export type PlayingResult = {
  nextState: State;
  newMemberId?: string;
  isError: boolean;
  message: string;
};
