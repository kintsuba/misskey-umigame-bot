import { Note } from "../utils/types";
import { State } from "./types";
import waiting from "./waiting";
import playing from "./playing";
import MisskeyUtils from "../utils/misskey-utils";

export default class Umigame {
  state: State;
  misskeyUtils: MisskeyUtils;
  masterId: string;
  memberIds: string[];

  constructor(misskeyUtils: MisskeyUtils) {
    this.state = State.Waiting;
    this.misskeyUtils = misskeyUtils;
    this.masterId = "";
    this.memberIds = [];
    console.log("Initialization Complete !");
  }

  update(note: Note): void {
    if (this.state === State.Waiting) {
      const result = waiting(note);
      this.masterId = result.masterId ?? "";
      if (!result.isError) {
        this.state = result.nextState;
      } else {
        this.exitGameAbnormally(result.message);
      }
    } else if (this.state === State.Playing) {
      const result = playing(note, this.memberIds);
      if (result.newMemberId) this.memberIds.push(result.newMemberId);
      if (!result.isError) {
        this.state = result.nextState;
      } else {
        this.exitGameAbnormally(result.message);
      }

      if (this.state === State.End) {
        this.exitGameNormally(result.message);
      }
    }
  }

  exitGameNormally(message: string): void {
    this.state = State.Waiting;
    console.log(message);
  }

  exitGameAbnormally(message: string): void {
    this.state = State.Waiting;
    console.log(message);
  }
}
