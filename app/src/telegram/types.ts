import {Conversation, ConversationFlavor} from "@grammyjs/conversations";
import {Context} from "grammy";

export type BotContext = Context & ConversationFlavor;
export type BotConversation = Conversation<BotContext>;

export enum AvailableConversations {
  SET_OFFER_REQUIREMENTS = "SET_OFFER_REQUIREMENTS"
}

export enum AvailableCommands {
  START = "start",
  SET_REQUIREMENTS = "set_requirements"
}