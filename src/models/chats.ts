import { ChatCompletionResponseMessageRoleEnum } from "openai";

export class Chats {
  chatId?: string;
  conversationId: string;
  created: string;
  role: ChatCompletionResponseMessageRoleEnum;
  userId: string;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  openAiModel?: string;
  openAiId?: string;
  openAiObject?: string;

  constructor({
    chatId,
    conversationId,
    created,
    role,
    userId,
    content,
    promptTokens,
    completionTokens,
    openAiModel,
    openAiId,
    openAiObject,
  }: Partial<Chats>) {
    this.chatId = chatId;
    this.conversationId = conversationId || "";
    this.created = created || "";
    this.role = role || ChatCompletionResponseMessageRoleEnum.User;
    this.userId = userId || "";
    this.content = content || "";
    this.promptTokens = promptTokens;
    this.completionTokens = completionTokens;
    this.openAiModel = openAiModel;
    this.openAiId = openAiId;
    this.openAiObject = openAiObject;
  }
}
