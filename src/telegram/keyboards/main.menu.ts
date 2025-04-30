import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/typings/core/types/typegram';

export function getMainMenu() {
    return Markup.inlineKeyboard([
        [
            { text: '🔍 Analyze Token', callback_data: 'analyze' },
            { text: 'ℹ️ Help', callback_data: 'help' }
        ]
    ]);
}

export function removeMenu() {
    return Markup.removeKeyboard();
}