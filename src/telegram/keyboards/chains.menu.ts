import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export const CHAIN_ACTIONS = {
    SOLANA: 'select_chain:sol',
    ETHEREUM: 'select_chain:eth',
    BSC: 'select_chain:bsc',
    BASE: 'select_chain:base',
    SONIC: 'select_chain:sonic',
    POLYGON: 'select_chain:poly',
    ARBITRUM: 'select_chain:arbi',
    FANTOM: 'select_chain:ftm',
    AVALANCHE: 'select_chain:avax',
    CRONOS: 'select_chain:cro',
};

export const chainKeyboard = () => {
    return Markup.inlineKeyboard([
        [
            Markup.button.callback('Solana', CHAIN_ACTIONS.SOLANA),
            Markup.button.callback('Ethereum', CHAIN_ACTIONS.ETHEREUM)
        ],
        [
            Markup.button.callback('Binance Smart Chain', CHAIN_ACTIONS.BSC),
            Markup.button.callback('Base (by Coinbase)', CHAIN_ACTIONS.ETHEREUM)
        ],
        [
            Markup.button.callback('Fantom Sonic', CHAIN_ACTIONS.SONIC),
            Markup.button.callback('Polygon', CHAIN_ACTIONS.POLYGON)
        ],
        [
            Markup.button.callback('Arbitrum', CHAIN_ACTIONS.ARBITRUM),
            Markup.button.callback('Fantom', CHAIN_ACTIONS.FANTOM)
        ],
        [
            Markup.button.callback('Avalanche', CHAIN_ACTIONS.AVALANCHE),
            Markup.button.callback('Cronos', CHAIN_ACTIONS.CRONOS)
        ]
    ]);
};

export type SupportedChain = 'eth' | 'bsc' | 'base' | 'poly' | 'arbi' | 'ftm' | 'sol' | 'sonic' | 'avax' | 'cro';

export const chainValueMap: Record<string, SupportedChain> = {
    [CHAIN_ACTIONS.SOLANA]: 'sol',
    [CHAIN_ACTIONS.ETHEREUM]: 'eth',
    [CHAIN_ACTIONS.BSC]: 'bsc',
    [CHAIN_ACTIONS.BASE]: 'base',
    [CHAIN_ACTIONS.SONIC]: 'sonic',
    [CHAIN_ACTIONS.POLYGON]: 'poly',
    [CHAIN_ACTIONS.ARBITRUM]: 'arbi',
    [CHAIN_ACTIONS.FANTOM]: 'ftm',
    [CHAIN_ACTIONS.AVALANCHE]: 'avax',
    [CHAIN_ACTIONS.CRONOS]: 'cro'
};