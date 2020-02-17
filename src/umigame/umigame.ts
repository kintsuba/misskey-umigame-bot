import { Note } from "../utils/types";
import { State } from "./types";
import waitingGameStart from "./waitingGameStart";
import acceptingQAndA from "./acceptingQAndA";
import MisskeyUtils from "../utils/misskey-utils";

export default class Umigame {
  state: State;
  misskeyUtils: MisskeyUtils;

  constructor(misskeyUtils: MisskeyUtils) {
    this.state = State.WaitingGameStart;
    this.misskeyUtils = misskeyUtils;
    console.log("Initialization Complete !");
  }

  update(note: Note): void {
    switch (this.state) {
      case State.WaitingGameStart: {
        const result = waitingGameStart(note);
        if (!result.isFailed) {
          this.state = result.nextState;
        } else {
          this.exitGameAbnormally(result.message);
        }
        break;
      }
      case State.AcceptingQAndA: {
        const result = acceptingQAndA(note);
        if (!result.isFailed) {
          this.state = result.nextState;
        } else {
          this.exitGameAbnormally(result.message);
        }
        break;
      }
      default: {
        console.log();
      }
    }
    const result = acceptingQAndA(note);
    if (!result.isFailed) {
      this.state = result.nextState;
    } else {
      this.exitGameAbnormally(result.message);
    }
    this.state;
  }

  exitGameAbnormally(message: string): void {
    this.state = State.WaitingGameStart;
    console.log(message);
  }
}
