import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { getMainMenu } from '../keyboards/main.menu';
import { AnalyzeCommand } from './analyze.command';
import { HelpCommand } from './help.command';
import { CallbackRouterService } from '../providers/callback-router.service';

@Update()
export class StartCommand {
  constructor(
    private readonly callbackRouter: CallbackRouterService,
    private readonly telegramService: TelegramService,
    private readonly analyzeCommand: AnalyzeCommand,
    private readonly helpCommand: HelpCommand
  ) {
    this.callbackRouter.registerHandler('analyze', (ctx) =>
      this.analyzeCommand.analyze(ctx)
    );
    this.callbackRouter.registerHandler('help', (ctx) =>
      this.helpCommand.help(ctx)
    );
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdown(`
      *Welcome to Bubblmaps Bot* 🎉

I can analyze token contracts and show:
      • Bubble Maps
      • Market Cap
      • Decentralization Scores
    `);
    await ctx.reply('Choose an option:', getMainMenu());
  }
}