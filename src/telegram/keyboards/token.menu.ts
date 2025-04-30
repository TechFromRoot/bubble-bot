import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/typings/core/types/typegram';

export function getTokenMenu(keyboard: any) {
    return Markup.inlineKeyboard(keyboard);
}