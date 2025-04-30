import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

type Handler = (ctx: Context) => Promise<void>;
type HandlerPattern = string | RegExp;

@Injectable()
export class CallbackRouterService {
    private handlers = new Map<HandlerPattern, Handler>();

    // Register either exact string or regex pattern
    registerHandler(pattern: HandlerPattern, handler: Handler) {
        this.handlers.set(pattern, handler);
    }

    async handleCallback(ctx: Context) {
        if (!('data' in ctx.callbackQuery)) return;

        const callbackData = ctx.callbackQuery.data;
        console.log(`Received callback: ${callbackData}`); // Debug logging

        // Check both exact matches and regex patterns
        for (const [pattern, handler] of this.handlers) {
            if (typeof pattern === 'string' && pattern === callbackData) {
                await handler(ctx);
                return;
            }

            if (pattern instanceof RegExp && pattern.test(callbackData)) {
                await handler(ctx);
                return;
            }
        }

        console.warn(`No handler for callback: ${callbackData}`);
        await ctx.answerCbQuery('⚠️ Action not available');
    }
}