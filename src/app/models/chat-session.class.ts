import { WritableSignal } from "@angular/core";
import { LLMProvider } from "./provider.class";

export interface ChatSession{
    id:string;
    provider:LLMProvider;
    model:string;
}