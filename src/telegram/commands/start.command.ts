import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { getMainMenu } from '../keyboards/main.menu';
import { AnalyzeCommand } from './analyze.command';
import { HelpCommand } from './help.command';
import { CallbackRouterService } from '../providers/callback-router.service';
import { DemoCommand } from './demo.command';
import { ChainsCommand } from './chain.command';

@Update()
export class StartCommand {
  constructor(
    private readonly callbackRouter: CallbackRouterService,
    private readonly telegramService: TelegramService,
    private readonly analyzeCommand: AnalyzeCommand,
    private readonly helpCommand: HelpCommand,
    private readonly demoCommand: DemoCommand,
    private readonly chainsCommand: ChainsCommand
  ) {
    this.callbackRouter.registerHandler('analyze', (ctx) =>
      this.analyzeCommand.analyze(ctx)
    );
    this.callbackRouter.registerHandler('help', (ctx) =>
      this.helpCommand.help(ctx)
    );
    this.callbackRouter.registerHandler('demo', (ctx) => // Add this
      this.demoCommand.showDemo(ctx)
    );
    this.callbackRouter.registerHandler('chains', (ctx) => // Add this
      this.chainsCommand.listChains(ctx)
    );
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdown(`
      *Welcome to Bubblmaps Bot🫧*

I provide *full-chain forensic analysis* for tokens

*How to use:*
  1. Send a contract address
  2. Select blockchain (ETH/SOL/BSC/etc.)
  3. Get full report with:
     • Bubble Map Image
     • Price/MCap/Supply/Liquidity
     • Risk Scores (0-100) + Danger Factors
     • Top 5 Holders + Whale Concentration
     • Decentralization Stats
     • Contract Verification
     • Authority Checks (Freeze/Mint)
     • Direct Explorer Links

    `, getMainMenu());
  }
}