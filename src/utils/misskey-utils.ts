import * as WebSocket from "websocket";
import fetch from "node-fetch";
import { Note, Visibility, Poll } from "./types";

export default class MisskeyUtils {
  static readonly Visibility = Visibility;
  private token: string;
  private connection: WebSocket.connection;

  constructor(token: string, connection: WebSocket.connection) {
    this.token = token;
    this.connection = connection;
  }

  fetchJson = async (
    url: string,
    json: string,
    credentials = "omit"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> => {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: credentials,
      body: json
    };

    const response = await fetch(url, postData);
    if (response.ok) {
      console.log(`${response.status} OK`);
      return await response.json();
    } else {
      console.log(`${response.status} Error`);
      return await response.json();
    }
  };

  note = ({
    text,
    visibility,
    replyId = "",
    renoteId = "",
    cw,
    localOnly = false,
    poll = { multiple: false },
    visibleUserIds
  }: {
    text: string;
    visibility: Visibility;
    replyId?: string;
    renoteId?: string;
    cw?: string;
    localOnly?: boolean;
    poll?: Poll;
    visibleUserIds?: string[];
  }): Promise<Note> => {
    const noteObj = {
      visibility: visibility,
      text: text,
      replyId: replyId,
      renoteId: renoteId,
      localOnly: localOnly,
      cw: cw,
      poll: poll,
      visibleUserIds: visibleUserIds,
      i: this.token
    };
    if (!cw) delete noteObj.cw;
    if (!replyId) delete noteObj.replyId;
    if (!renoteId) delete noteObj.renoteId;
    if (!poll.choices || poll.choices.length === 0) delete noteObj.poll;
    if (!visibleUserIds || visibleUserIds.length === 0)
      delete noteObj.visibleUserIds;

    const noteJson = JSON.stringify(noteObj);

    return this.fetchJson(
      "https://misskey.m544.net/api/notes/create",
      noteJson,
      "include"
    );
  };
  noteHome = (text: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Home
    });
  };
  noteFollowers = (text: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Followers
    });
  };
  notePublic = (text: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Public
    });
  };
  replyHome = (text: string, replyId: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Home,
      replyId: replyId
    });
  };
  replyFollowers = (text: string, replyId: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Followers,
      replyId: replyId
    });
  };
  replyPublic = (text: string, replyId: string): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Public,
      replyId: replyId
    });
  };
  replySpecified = (
    text: string,
    replyId: string,
    visibleUserIds: string[]
  ): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Specified,
      replyId: replyId,
      visibleUserIds: visibleUserIds
    });
  };
  replyHomeWithPoll = (
    text: string,
    replyId: string,
    poll: Poll
  ): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Home,
      replyId: replyId,
      poll: poll
    });
  };
  replySpecifiedWithPoll = (
    text: string,
    replyId: string,
    visibleUserIds: string[],
    poll: Poll
  ): Promise<Note> => {
    return this.note({
      text: text,
      visibility: MisskeyUtils.Visibility.Specified,
      replyId: replyId,
      visibleUserIds: visibleUserIds,
      poll: poll
    });
  };
  message = (text: string, userId: string): Promise<Record<string, any>> => {
    const messageJson = JSON.stringify({
      userId: userId,
      text: text,
      i: this.token
    });
    return this.fetchJson(
      "https://misskey.m544.net/api/messaging/messages/create",
      messageJson,
      "include"
    );
  };

  follow = (userId: string): Promise<Record<string, any>> => {
    const followJson = JSON.stringify({
      userId: userId,
      i: this.token
    });
    return this.fetchJson(
      "https://misskey.m544.net/api/following/create",
      followJson,
      "include"
    );
  };
  unfollow = (userId: string): Promise<Record<string, any>> => {
    const unfollowJson = JSON.stringify({
      userId: userId,
      i: this.token
    });
    return this.fetchJson(
      "https://misskey.m544.net/api/following/create",
      unfollowJson,
      "include"
    );
  };

  capture = (id: string): void => {
    this.connection.sendUTF(
      JSON.stringify({
        type: "subNote",
        body: {
          id: id
        }
      })
    );
  };
  unCapture = (id: string): void => {
    this.connection.sendUTF(
      JSON.stringify({
        type: "unsubNote",
        body: {
          id: id
        }
      })
    );
  };

  static readonly getGlobalTLJson = (id: string): string => {
    return JSON.stringify({
      type: "connect",
      body: {
        channel: "globalTimeline",
        id: id
      }
    });
  };
  static readonly getHybridTLJson = (id: string): string => {
    return JSON.stringify({
      type: "connect",
      body: {
        channel: "hybridTimeline",
        id: id
      }
    });
  };
  static readonly getLocalTLJson = (id: string): string => {
    return JSON.stringify({
      type: "connect",
      body: {
        channel: "localTimeline",
        id: id
      }
    });
  };
  static readonly getHomeTLJson = (id: string): string => {
    return JSON.stringify({
      type: "connect",
      body: {
        channel: "homeTimeline",
        id: id
      }
    });
  };
  static readonly getMainJson = (id: string): string => {
    return JSON.stringify({
      type: "connect",
      body: {
        channel: "main",
        id: id
      }
    });
  };
}
