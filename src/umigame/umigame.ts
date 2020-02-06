import { Note } from "../utils/types";
import { State } from "./types";

export default class Umigame {
  state: State;

  constructor(note: Note) {
    this.state = State.Playing;
    console.log("Initialization Complete !");
  }

  update(note: Note) {
    console.info("Update !");
  }
}
