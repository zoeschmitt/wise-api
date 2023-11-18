export type Conversation = {
  conversationId: string;
  userId: string;
  title: string;
  created: string;
  updated: string;
  items: Message[];
};

export enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}
export class Message {
  messageId?: string;
  conversationId: string;
  created: string;
  role: Role;
  userId: string;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  openAiModel?: string;
  openAiId?: string;
  openAiObject?: string;

  constructor({
    messageId,
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
  }: Partial<Message>) {
    this.messageId = messageId;
    this.conversationId = conversationId || "";
    this.created = created || "";
    this.role = role || Role.User;
    this.userId = userId || "";
    this.content = content || "";
    this.promptTokens = promptTokens;
    this.completionTokens = completionTokens;
    this.openAiModel = openAiModel;
    this.openAiId = openAiId;
    this.openAiObject = openAiObject;
  }
}
