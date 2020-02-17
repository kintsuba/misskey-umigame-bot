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
  noteMasterMessage?: string;
  noteMasterMessageCW?: string;
  noteMemberMessage?: string;
  noteMemberMessageCW?: string;
};

export type PlayingResult = {
  nextState: State;
  newMemberId?: string;
  isError: boolean;
  noteMasterMessage?: string;
  noteMasterMessageCW?: string;
  noteMemberMessage?: string;
  noteMemberMessageCW?: string;
};
