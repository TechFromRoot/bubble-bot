import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/typings/core/types/typegram';

export function getMainMenu() {
    return Markup.inlineKeyboard([
        [
            { text: '🔍 Analyze Token', callback_data: 'analyze' },
        ],
        [
            { text: '🌐 Supported Chains', callback_data: 'chains' },
            { text: '📊 Demo Analysis', callback_data: 'demo' }
        ]
    ]);
}

export function removeMenu() {
    return Markup.removeKeyboard();
}