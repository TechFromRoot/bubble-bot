import { Command, Ctx, Hears, On, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { removeMenu } from '../keyboards/main.menu';
import { chainKeyboard, CHAIN_ACTIONS, chainValueMap } from '../keyboards/chains.menu';
import { CallbackRouterService } from '../providers/callback-router.service';

@Update()
export class AnalyzeCommand {
    private chainState: Map<number, { address: string }> = new Map();

    constructor(
        private readonly callbackRouter: CallbackRouterService,
        private readonly telegramService: TelegramService
    ) {
        // Register handler for all chain selections using regex
        this.callbackRouter.registerHandler(
            /^select_chain:/,
            (ctx) => this.handleChainSelection(ctx)
        );
    }

    @Command('analyze')
    @Hears('🔍 Analyze Token')
    async analyze(@Ctx() ctx: Context) {
        await ctx.reply(
            'Send me a token contract address:'
        );
    }

    @On('text')
    async handleAddress(@Ctx() ctx: Context) {
        if (!('text' in ctx.message)) return;
        const address = ctx.message.text.trim();

        if (/^(0x)?[0-9a-fA-F]{40}$/.test(address) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
            this.chainState.set(ctx.chat.id, { address });
            await ctx.reply(
                'Select the blockchain:',
                chainKeyboard()
            );
        } else {
            await ctx.reply('⚠️ Invalid token address! Examples:\nEthereum: `0x123...`\nSolana: `HN5X...`');
        }
    }

    private async handleChainSelection(@Ctx() ctx: Context) {
        if (!('data' in ctx.callbackQuery)) return;

        const callbackData = ctx.callbackQuery.data;
        const chain = chainValueMap[callbackData];

        if (!chain || !this.chainState.has(ctx.chat.id)) {
            await ctx.answerCbQuery('❌ Invalid selection');
            return;
        }

        const { address } = this.chainState.get(ctx.chat.id);
        this.chainState.delete(ctx.chat.id);

        await ctx.answerCbQuery(`Selected: ${chain.toUpperCase()}`);
        await ctx.deleteMessage(ctx.callbackQuery.message?.message_id).catch(() => { });

        const analyzingMsg = await ctx.reply('🔄 Analyzing...');
        try {
            await this.telegramService.analyzeToken(ctx.chat.id, address, chain);
        } finally {
            await ctx.deleteMessage(analyzingMsg.message_id).catch(() => { });
        }
    }
}