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

export const voteChoice = [
  "はい",
  "いいえ",
  "はい(重要)",
  "いいえ(重要)",
  "問題と関係しない質問",
  "既出の質問",
  "回答不能"
];
