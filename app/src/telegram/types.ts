import {Conversation, ConversationFlavor} from "@grammyjs/conversations";
import {Context, SessionFlavor} from "grammy";
import {I18nFlavor} from "@grammyjs/i18n";
import {ParseModeFlavor} from "@grammyjs/parse-mode";

export interface BotSessionData {
  language_code?: string;
}

export type BotContext = ParseModeFlavor<
  Context
  & ConversationFlavor
  & SessionFlavor<BotSessionData>
  & I18nFlavor
>
export type BotConversation = Conversation<BotContext>;

export enum AvailableConversations {
  SET_OFFER_REQUIREMENTS = "SET_OFFER_REQUIREMENTS"
}

export enum AvailableCommands {
  START = "start",
  SET_REQUIREMENTS = "set_requirements",
  SHOW_REQUIREMENTS = "show_requirements",
  HELP = "help",
  AUTHOR = "author",
}