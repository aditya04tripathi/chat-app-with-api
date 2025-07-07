export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  chatroomId?: string;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  chatroom?: Chatroom;
  messages?: Message[];
  poems?: Poem[];
}

export interface Chatroom {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  users?: User[];
  messages?: Message[];
}

export interface Message {
  id: string;
  content: string;
  chatroomId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  chatroom?: Chatroom;
  sender?: User;
  // Optional computed field for UI
  senderName?: string;
}

export interface Poem {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}

export type UserState = {
  user?: User;
  accessToken?: string;
};
