import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const CHAIN_ACTIONS = {
    // ETHEREUM: 'select_chain:eth',
    // BSC: 'select_chain:bsc',
    // POLYGON: 'select_chain:polygon',
    // ARBITRUM: 'select_chain:arbitrum',
    // OPTIMISM: 'select_chain:optimism',
    // AVALANCHE: 'select_chain:avalanche',
    SOLANA: 'select_chain:sol'
};

export const chainKeyboard = () => {
    return Markup.inlineKeyboard([
        // [
        //     Markup.button.callback('Ethereum', CHAIN_ACTIONS.ETHEREUM),
        //     Markup.button.callback('Binance Smart Chain', CHAIN_ACTIONS.BSC)
        // ],
        // [
        //     Markup.button.callback('Polygon', CHAIN_ACTIONS.POLYGON),
        //     Markup.button.callback('Arbitrum', CHAIN_ACTIONS.ARBITRUM)
        // ],
        // [
        //     Markup.button.callback('Optimism', CHAIN_ACTIONS.OPTIMISM),
        //     Markup.button.callback('Avalanche', CHAIN_ACTIONS.AVALANCHE)
        // ],
        [
            Markup.button.callback('Solana', CHAIN_ACTIONS.SOLANA)
        ]
    ]);
};

export type SupportedChain = 'eth' | 'bsc' | 'polygon' | 'arbitrum' | 'optimism' | 'avalanche' | 'sol';

export const chainValueMap: Record<string, SupportedChain> = {
    // [CHAIN_ACTIONS.ETHEREUM]: 'eth',
    // [CHAIN_ACTIONS.BSC]: 'bsc',
    // [CHAIN_ACTIONS.POLYGON]: 'polygon',
    // [CHAIN_ACTIONS.ARBITRUM]: 'arbitrum',
    // [CHAIN_ACTIONS.OPTIMISM]: 'optimism',
    // [CHAIN_ACTIONS.AVALANCHE]: 'avalanche',
    [CHAIN_ACTIONS.SOLANA]: 'sol'
};