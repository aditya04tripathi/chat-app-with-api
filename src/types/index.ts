export interface User {
  id?: string;
  name?: string;
  email?: string;
  hashedPassword?: string;
  createAt?: Date;
  updatedAt?: Date;
  chatroom?: Chatroom;
  chatroomId?: string;
  message?: Message[];
  onboarded?: boolean;
}

export interface Chatroom {
  id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  users?: User[];
  messages?: Message[];
}

export interface Message {
  id?: string;
  content?: string;
  chatroom?: Chatroom;
  chatroomId?: string;
  sender?: User;
  senderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  senderName?: string;
}

export interface Poem {
  id?: string;
  title?: string;
  content?: string;
  authorId?: string;
  author?: { name?: string };
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserState = {
  user?: User;
  accessToken?: string;
};
