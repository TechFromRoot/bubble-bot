import { registerAs } from '@nestjs/config';

export default registerAs('telegram', () => ({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    polling: process.env.TELEGRAM_POLLING === 'true',
}));