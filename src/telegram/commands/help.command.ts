import { Command, Ctx, Hears, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { getMainMenu } from '../keyboards/main.menu';

@Update()
export class HelpCommand {
    constructor(private readonly telegramService: TelegramService) { }

    @Command('help')
    @Hears('ℹ️ Help')
    async help(@Ctx() ctx: Context) {
        await ctx.replyWithMarkdown(`
      *📘 Bubblemaps Bot Help*

      • *🔍 Analyze Token* - Get bubble map for any contract
      • *📊 My Stats* - Your analysis history (coming soon)
      • *🚀 Quick Start* - [View guide](https://docs.bubblemaps.io)
    `);
        await ctx.reply('Need more help?', getMainMenu());
    }
}