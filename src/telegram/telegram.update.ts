import { Update, On, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { CallbackRouterService } from './providers/callback-router.service';

@Update()
export class TelegramUpdate {
    constructor(private readonly callbackRouter: CallbackRouterService) { }

    @On('callback_query')
    async handleAllCallbacks(@Ctx() ctx: Context) {
        await this.callbackRouter.handleCallback(ctx);
    }
}