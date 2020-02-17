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
  question: string;

  constructor(misskeyUtils: MisskeyUtils) {
    this.state = State.Waiting;
    this.misskeyUtils = misskeyUtils;
    this.masterId = "";
    this.memberIds = [];
    this.question = "";

    console.log("Initialization Complete !");
  }

  update(note: Note): void {
    if (this.state === State.Waiting) {
      const result = waiting(note);
      if (!result.isError) {
        this.masterId = result.masterId ?? "";
        this.noteMisskey(
          result.noteMasterMessage,
          result.noteMasterMessageCW,
          result.noteMemberMessage,
          result.noteMemberMessageCW
        );
        this.state = result.nextState;
      } else {
        this.exitGameAbnormally;
      }
    } else if (this.state === State.Playing) {
      const result = playing(note, this.masterId, this.memberIds);
      if (!result.isError) {
        this.state = result.nextState;
        if (this.state === State.End) {
          this.exitGameNormally(
            result.noteMasterMessage,
            result.noteMemberMessage
          );
        } else {
          if (result.newMemberId) this.memberIds.push(result.newMemberId);
        }
      } else {
        this.exitGameAbnormally();
      }
    }
  }

  async noteMisskey(
    noteMasterMessage?: string,
    noteMasterMessageCW?: string,
    noteMemberMessage?: string,
    noteMemberMessageCW?: string
  ): Promise<void> {
    if (noteMasterMessage) {
      await this.misskeyUtils.noteHome(noteMasterMessage, noteMasterMessageCW);
    }
  }

  reset(): void {
    this.state = State.Waiting;
    this.masterId = "";
    this.memberIds = [];
    this.question = "";
  }

  exitGameNormally(
    noteMasterMessage?: string,
    noteMemberMessage?: string
  ): void {
    console.log(noteMasterMessage);
    console.log(noteMemberMessage);
    this.reset();
  }

  exitGameAbnormally(): void {
    console.log("Now Waiting....");
    this.reset();
  }
}
