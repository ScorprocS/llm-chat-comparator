import { ChatMessage } from "./message.class"

export interface LlmResponse {
    id: string
    object: string
    model: string
    usage: Usage
    created: number
    choices: Choice[]
  }
  
  export interface Usage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  
  export interface Choice {
    index: number
    message: ChatMessage
    finish_reason: string
  }
    