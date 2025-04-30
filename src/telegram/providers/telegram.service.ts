import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { Context } from 'telegraf';
import { getMainMenu } from '../keyboards/main.menu';
import puppeteer from 'puppeteer';
import { SupportedChain } from '../keyboards/chains.menu';
import { TokenAnalysisService } from './token-analysis.service';
import { getTokenMenu } from '../keyboards/token.menu';

@Injectable()
export class TelegramService {
    constructor(
        @InjectBot()
        private bot: Telegraf<Context>,
        private readonly tokenAnalysisService: TokenAnalysisService
    ) { }

    async showMainMenu(chatId: number) {
        await this.bot.telegram.sendMessage(
            chatId,
            'Choose an option:',
            getMainMenu()
        );
    }

    async analyzeToken(chatId: number, contractAddress: string, chain: SupportedChain) {
        try {
            // Step 2: Generate screenshot
            const screenshotBuffer = await this.generateBubbleMapScreenshot(contractAddress, chain);

            // Step 3: Fetch token data (replace with actual API calls)
            const tokenData = await this.tokenAnalysisService.getTokenDetails(contractAddress);

            // Step 4: Format caption
            const caption = tokenData.message;

            // Step 5: Send results
            await this.bot.telegram.sendPhoto(
                chatId,
                { source: screenshotBuffer.image },
                // { caption }
            );
            await this.bot.telegram.sendMessage(
                chatId,
                caption,
                getTokenMenu(tokenData.keyboard)
            );

        } catch (error) {
            console.error('Analysis failed:', error);
            await this.bot.telegram.sendMessage(
                chatId,
                `❌ Failed to analyze token:\n${error.message}\n\n` +
                'Please ensure:\n' +
                '1. Correct contract address\n' +
                '2. Supported chain (ETH, BSC, etc.)'
            );
        }
    }

    private async generateBubbleMapScreenshot(contractAddress: string, chain = 'eth') {
        const url = `https://app.bubblemaps.io/${chain}/token/${contractAddress}`;

        const browser = await puppeteer.launch({
            executablePath: process.env.NODE_ENV === 'production'
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
            headless: true,
            timeout: 60000,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();

            await page.setViewport({ width: 3900, height: 2700 });

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            await page.waitForSelector('#circles', {
                timeout: 40000,
                visible: true
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: false,
                clip: {
                    x: 150,
                    y: 112.5,
                    width: 3100,
                    height: 2550
                }
            });

            if (!Buffer.isBuffer(screenshot)) {
                throw new Error('Invalid image buffer');
            }

            return { image: screenshot };
        } catch (error) {
            throw error;
        } finally {
            await browser.close();
        }
    }

    private formatNumber(num: number): string {
        return new Intl.NumberFormat('en-US').format(num);
    }
}