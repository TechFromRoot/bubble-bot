import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './providers/telegram.service';
import { StartCommand } from './commands/start.command';
import { AnalyzeCommand } from './commands/analyze.command';
import { HelpCommand } from './commands/help.command';
import { CallbackRouterService } from './providers/callback-router.service';
import telegramConfig from 'src/config/telegram.config';
import { TelegramUpdate } from './telegram.update';
import { HttpModule } from '@nestjs/axios';
import { TokenAnalysisService } from './providers/token-analysis.service';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forFeature(telegramConfig),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                token: config.get('telegram.botToken'),
                polling: config.get('telegram.polling'),
            }),
        }),
    ],
    providers: [
        TelegramUpdate,
        CallbackRouterService,
        HelpCommand,
        StartCommand,
        AnalyzeCommand,
        TelegramService,
        TokenAnalysisService,
    ],
})
export class TelegramModule { }