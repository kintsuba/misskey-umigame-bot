export const enum State {
  Waiting,
  Playing,
  End
}

export type WaitingResult = {
  nextState: State;
  masterId?: string;
  problem?: string;
  isError: boolean;
};

export type PlayingResult = {
  nextState: State;
  isError: boolean;
};

export type Question = {
  text: string;
  questionNoteId: string;
  umigameNoteId: string;
  userId: string;
  answer?: string;
};
