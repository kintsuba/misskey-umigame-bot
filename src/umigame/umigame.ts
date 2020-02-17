import { Note } from "../utils/types";
import { State } from "./types";
import waiting from "./waiting";
import playing from "./playing";
import MisskeyUtils from "../utils/misskey-utils";

export default class Umigame {
  state: State;
  misskeyUtils: MisskeyUtils;

  constructor(misskeyUtils: MisskeyUtils) {
    this.state = State.Waiting;
    this.misskeyUtils = misskeyUtils;
    console.log("Initialization Complete !");
  }

  update(note: Note): void {
    const result = this.state === State.Waiting ? waiting(note) : playing(note);
    if (!result.isError) {
      this.state = result.nextState;
    } else {
      this.exitGameAbnormally(result.message);
    }
    this.state;
  }

  exitGameAbnormally(message: string): void {
    this.state = State.Waiting;
    console.log(message);
  }
}
