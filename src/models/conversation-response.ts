export type ConversationUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type ConversationMessage = {
  role: string;
  content: string;
};

export type ConversationChoice = {
  message: ConversationMessage;
  finish_reason: string;
  index: number;
};

export type ConversationResponse = {
  id: string;
  object: string;
  created: string;
  model: string;
  usage: ConversationUsage;
  choices: ConversationChoice[];
};
