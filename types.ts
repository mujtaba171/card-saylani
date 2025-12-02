export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface QuickReply {
  label: string;
  action: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isConnected: boolean;
}
