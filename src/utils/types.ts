export interface User {
  name: string;
  username: string;
  host?: string;
  isBot?: boolean;
  isCat?: boolean;
  avatarColor?: number[];
  emojis?: string[];
  isGroup?: boolean;
  isOrganization?: boolean;
  id: string;
  movedToUser?: null;
  avatarUrl?: string;
  bannerUrl?: string;
}

export interface Note {
  id: string;
  createdAt: string;
  fileIds?: string[];
  text?: string;
  cw?: string;
  tags?: string[];
  emojis?: string[];
  userId: string;
  user?: User;
  replyId?: string;
  renoteId?: string;
  reply?: Note;
  renote?: Note;
  viaMobile?: boolean;
  localOnly?: boolean;
  copyOnce?: boolean;
  geo?: {};
  visibility?: string;
}

export interface Message {
  userId: string;
  limit?: number;
  sinceId?: string;
  untilId?: string;
  markAsRead?: boolean;
}

export type Poll = {
  choices?: string[];
  multiple?: boolean;
  expiresAt?: number;
  expiredAfter?: number;
};

export enum Visibility {
  Home = "home",
  Public = "public",
  Followers = "followers",
  Specified = "specified",
  Private = "private"
}
