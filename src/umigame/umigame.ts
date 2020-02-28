import { Note, Vote, isNote, MisskeyMessageBody } from "../utils/types";
import { State } from "./types";
import waiting from "./waiting";
import playing from "./playing";
import MisskeyUtils from "../utils/misskey-utils";

export default class Umigame {
  state: State;
  misskeyUtils: MisskeyUtils;
  masterId: string;
  problem: string;

  constructor(misskeyUtils: MisskeyUtils) {
    this.state = State.Waiting;
    this.misskeyUtils = misskeyUtils;
    this.masterId = "";
    this.problem = "";

    console.log("Initialization Complete !");
  }

  async update(body: MisskeyMessageBody): Promise<void> {
    if (this.state === State.Waiting) {
      if (!isNote(body.body)) return;

      const result = await waiting(body.body, this.misskeyUtils);
      if (!result.isError) {
        this.masterId = result.masterId ?? "";
        this.state = result.nextState;
        this.problem = result.problem ?? "";
      } else {
        this.exitGameAbnormally;
      }
    } else if (this.state === State.Playing) {
      console.log("Now Playing!");

      const result = await playing(
        body,
        this.masterId,
        this.problem,
        this.misskeyUtils
      );

      if (!result.isError) {
        this.state = result.nextState;
        if (this.state === State.End) {
          this.exitGameNormally();
        }
      } else {
        this.exitGameAbnormally();
      }
    }
  }

  reset(): void {
    this.state = State.Waiting;
    this.masterId = "";
    this.problem = "";
  }

  exitGameNormally(): void {
    this.reset();
  }

  exitGameAbnormally(): void {
    console.log("Now Waiting....");
    this.reset();
  }
}
