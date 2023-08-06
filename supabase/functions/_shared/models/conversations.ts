import { Chat } from "./chats.ts";

export type Conversation = {
  conversationId: string;
  userId: string;
  title: string;
  created: string;
  updated: string;
  chats: Chat[];
};
