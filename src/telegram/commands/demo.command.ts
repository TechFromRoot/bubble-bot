import { Command, Ctx, Hears, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { getMainMenu } from '../keyboards/main.menu';
import { Markup } from 'telegraf';

@Update()
export class DemoCommand {

    constructor(private readonly telegramService: TelegramService) { }

    @Command('demo')
    @Hears('📊 Demo Analysis')
    async showDemo(@Ctx() ctx: Context) {
        const analyzingMsg = await ctx.reply('🔄 Analyzing...');
        try {
            await this.telegramService.analyzeToken(ctx.chat.id, "FQgtfugBdpFN7PZ6NdPrZpVLDBrPGxXesi4gVu3vErhY", "sol");
        } finally {
            await ctx.deleteMessage(analyzingMsg.message_id).catch(() => { });
        }
    }
}