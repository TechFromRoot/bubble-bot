import { Command, Ctx, Hears, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from '../providers/telegram.service';
import { getMainMenu } from '../keyboards/main.menu';
import { Markup } from 'telegraf';

@Update()
export class ChainsCommand {
    private readonly supportedChains = {
        '🟢 Ethereum': 'sol',
        '🔵 Solana': 'eth',
        '🟡 Binance Smart Chain': 'bsc',
        '🔷 Base': 'base',
        '⚡ Sonic': 'sonic',
        '🟣 Polygon': 'poly',
        '🔶 Arbitrum': 'arbi',
        '🌀 Fantom': 'ftm',
        '❄️ Avalanche': 'avax',
        '⏳ Cronos': 'cro'
    };

    constructor(private readonly telegramService: TelegramService) { }

    @Command('chains')
    @Hears('🌐 Supported Chains')
    async listChains(@Ctx() ctx: Context) {
        const chainsList = Object.keys(this.supportedChains)
            .map(chain => `• ${chain} (/${this.supportedChains[chain]})`)
            .join('\n');

        await ctx.replyWithMarkdown(`
      *🌐 Supported Blockchains*

These networks are currently supported:
${chainsList}

*How to use:*
\`FQgtfugBdpFN7PZ6NdPrZpVLDBrPGxXesi4gVu3vErhY /sol\` - Analyze Solana token
\`0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce /eth\` - Analyze Ethereum token
\`/analyze\` - Universal analyzer`, Markup.inlineKeyboard([
            [{ text: '🔍 Analyze Token', callback_data: 'analyze' }],
            [{ text: '📊 Demo Analysis', callback_data: 'demo' }]
        ]));
    }
}