import {Context} from "telegraf";
import {SceneContext} from "telegraf/scenes";

export interface CustomTelegrafContext extends Context, SceneContext {
}

export enum AvailableScenes {
  CREATE_OFFER_REQUIREMENTS = "CREATE_OFFER_REQUIREMENTS_ID"
}

export enum AvailableCommands {
  START = "start",
  SET_REQUIREMENTS = "set_requirements"
}