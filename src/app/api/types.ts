export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type Module1Result = {
  done: boolean;
  summary: string | null;
  assistantMessage: string;
};
