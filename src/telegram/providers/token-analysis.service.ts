import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface TokenData {
    mint: string;
    tokenMeta: { name: string; symbol: string; uri?: string };
    token: { supply: number; decimals: number };
    creator: string;
    price?: number;
    totalHolders?: number;
    totalMarketLiquidity?: number;
    rugged?: boolean;
    score?: number;
    score_normalised?: number;
    risks?: { name: string; description: string; level: string }[];
    topHolders?: {
        pct: number;
        owner: string;
        amount: number;
        insider: boolean;
    }[];
    insiderNetworks?: {
        tokenAmount: number;
        size: number;
        id?: string;
        wallets?: string[];
    }[];
    graphInsidersDetected?: number;
    verification?: {
        mint: string;
        payer: string;
        name: string;
        symbol: string;
        description: string;
        jup_verified: boolean;
        jup_strict: boolean;
        links: string[];
    };
    freezeAuthority?: string | null;
    mintAuthority?: string | null;
    fileMeta?: { image?: string };
}

interface VoteData {
    up: number;
    down: number;
    userVoted: boolean;
}

@Injectable()
export class TokenAnalysisService {
    constructor(private readonly httpService: HttpService) { }

    private shortenAddress(address: string): string {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    private formatNumber(num: number): string {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    private formatPrice(price: number): string {
        if (price === 0) return '0';
        if (price < 0.00000001) return `${price.toFixed(8)}(~< 0.00000001)`;
        return price.toFixed(8);
    }

    private async fetchTokenData(mint: string, chain: string): Promise<TokenData | null> {
        try {
            const [reportResult, bubbleResult, decentralizationData] = await Promise.allSettled([
                firstValueFrom(this.httpService.get(`https://api.rugcheck.xyz/v1/tokens/${mint}/report`)),
                firstValueFrom(this.httpService.get(`https://api-legacy.bubblemaps.io/map-data?token=${mint}&chain=${chain}`)),
                firstValueFrom(this.httpService.get(`https://api-legacy.bubblemaps.io/map-metadata?token=${mint}&chain=${chain}`)),
            ]);

            const reportData =
                reportResult.status === 'fulfilled' && !reportResult.value.data.error
                    ? reportResult.value.data
                    : null;

            const bubbleData =
                bubbleResult.status === 'rejected'
                    ? null
                    : bubbleResult.value.data;

            const decentralizationScore =
                (decentralizationData as any).value.data.status === 'KO'
                    ? null
                    : (decentralizationData as any).value.data;


            const response = reportData ? reportData : {
                tokenMeta: { name: '', symbol: '' }
            };
            if (bubbleData !== null) {
                response.chain = bubbleData.chain;
                response.tokenMeta.name = bubbleData.full_name;
                response.tokenMeta.symbol = bubbleData.symbol;
                response.mint = bubbleData.token_address;
                response.holdersMetaData = bubbleData.metadata;
                response.topHolders = bubbleData.nodes;
            }
            if (decentralizationScore !== null) {
                response.decentralizationData = decentralizationScore;
            }

            return response;
        } catch (error) {
            console.error('Error fetching token data:', error);
            return null;
        }
    }

    private async fetchVoteData(mint: string): Promise<VoteData | null> {
        const [votesResult] = await Promise.allSettled([
            this.httpService.axiosRef.get(
                `https://api.rugcheck.xyz/v1/tokens/${mint}/votes`,
            ),
        ]);

        const votesData =
            votesResult.status === 'fulfilled' ? votesResult.value.data : null;

        return votesData;
    };

    public async getTokenDetails(mint: string, chain: string) {
        const token = await this.fetchTokenData(mint, chain);
        const tokenVote = await this.fetchVoteData(mint);

        if (!token) return null;

        const lines: string[] = [];

        // Title
        lines.push(`*${token.tokenMeta.name} (${token.tokenMeta.symbol})*`.toLocaleUpperCase());

        // Description
        lines.push(`*Address:* \`${token.mint}\``);
        lines.push(`*Chain:* \`${(token as any).chain}\``);

        // Token Overview
        const overviewFields: string[] = [];
        if (token.creator) {
            overviewFields.push(`*Creator:* \`${token.creator}\``);
        }
        if (token.token && token.token.supply && token.token.decimals !== undefined) {
            overviewFields.push(
                `*Supply:* ${this.formatNumber(token.token.supply / 10 ** token.token.decimals)}`
            );
        }
        
        if (token.price && token.token && token.token.supply && token.token.decimals !== undefined) {
            const marketCap = token.price * (token.token.supply / 10 ** token.token.decimals);
            overviewFields.push(`*Market Cap:* $${this.formatNumber(marketCap)}`);
        }
        if (token.price) {
            overviewFields.push(`*Price:* $${this.formatPrice(token.price)}`);
        }
        if (token.totalHolders) {
            overviewFields.push(`*Holders:* ${token.totalHolders}`);
        }
        if (token.totalMarketLiquidity) {
            overviewFields.push(
                `*Liquidity:* $${this.formatNumber(token.totalMarketLiquidity)}`,
            );
        }
        if (typeof token.rugged === 'boolean') {
            overviewFields.push(`*Rugged:* ${token.rugged ? 'Yes' : 'No'}`);
        }
        if (overviewFields.length > 0) {
            lines.push(`\n*TOKEN OVERVIEW*`);
            lines.push(overviewFields.join('\n'));
        }

        const decentralizationFields: string[] = [];
        if ((token as any).decentralizationData) {
            decentralizationFields.push(
                `*Decentralization Score:* ${(token as any).decentralizationData.decentralisation_score}`,
            );
            decentralizationFields.push(
                `*Percentage in Centralized Exchanges (CEXs):* ${(token as any).decentralizationData.identified_supply.percent_in_cexs}`,
            );
            decentralizationFields.push(
                `*Percentage in Smart Contract:* ${(token as any).decentralizationData.identified_supply.percent_in_contracts}`,
            );
        }
        if (decentralizationFields.length > 0) {
            lines.push(`\n*Decentralization Overview*`);
            lines.push(decentralizationFields.join('\n'));
        }

        // Risk Analysis
        const normalizedScore =
            token.score_normalised !== undefined
                ? token.score_normalised
                : token.score
                    ? Math.min(Math.round((token.score / 118101) * 100), 100)
                    : undefined;
        let riskLevel = '';
        let riskEmoji = '';
        if (normalizedScore !== undefined) {
            if (normalizedScore >= 70) {
                riskLevel = 'Bad';
                riskEmoji = '🔴';
            } else if (normalizedScore >= 30) {
                riskLevel = 'Medium';
                riskEmoji = '🟡';
            } else {
                riskLevel = 'Good';
                riskEmoji = '🟢';
            }
        }
        if (normalizedScore !== undefined || token.risks?.length) {
            const riskFields: string[] = [];
            if (normalizedScore !== undefined) {
                riskFields.push(
                    `*Score:* ${normalizedScore}/100 (${riskEmoji} ${riskLevel})`,
                );
            }
            if (token.risks?.length) {
                riskFields.push('*Risks Detected:*');
                const risksText = token.risks
                    .map((r) => `--> ${r.name}: ${r.description} (${r.level})`)
                    .join('\n');
                riskFields.push(
                    risksText.length > 900
                        ? risksText.substring(0, 897) + '...'
                        : risksText,
                );
            }
            lines.push(`\n*RISK ANALYSIS*`);
            lines.push(riskFields.join('\n'));
        }

        // Holder Concentration
        if (token.topHolders?.length) {
            const decimals = token.token?.decimals || 6;
            const topHoldersText = token.topHolders
                .slice(0, 5)
                .map((h) => {
                    const amount = this.formatNumber(h.amount / 10 ** (decimals));
                    const insiderTag = h.insider ? ' (Insider)' : '';
                    return `- \`${this.shortenAddress((h as any).address)}\`: ${amount} (${((h as any).percentage || h.pct).toFixed(2)}%)${insiderTag}`;
                })
                .join('\n');
            lines.push(`\n*HOLDER CONCENTRATION*`);
            lines.push(`*Max Amount:* ${(token as any).holdersMetaData.max_amount}`);
            lines.push(`*Min Amount:* ${(token as any).holdersMetaData.min_amount}`);
            lines.push(`*Top 5 Holders:*`);
            lines.push(topHoldersText);
        }

        // Insider Analysis
        if (token.insiderNetworks?.length) {
            const { insiderPct, totalWallet } = token.insiderNetworks.reduce(
                (acc, insider) => {
                    if (insider['type'] === 'transfer') {
                        // Assuming 'type' might be present; adjust if not
                        acc.totalWallet += insider.size;
                        acc.insiderPct += (insider.tokenAmount / token.token.supply) * 100;
                    }
                    return acc;
                },
                { insiderPct: 0, totalWallet: 0 },
            );
            const insiderText = `${insiderPct.toFixed(2)}% of supply sent to ${totalWallet} wallets`;
            lines.push(`\n*INSIDER ANALYSIS*`);
            lines.push(insiderText);
        }
        if (token.graphInsidersDetected !== undefined) {
            lines.push(`*Graph Insiders Detected:* ${token.graphInsidersDetected}`);
        }

        // Verification
        if (token.verification) {
            const verificationFields: string[] = [];
            if (token.verification.description) {
                verificationFields.push(
                    `*Description:* ${token.verification.description}`,
                );
            }
            verificationFields.push(
                `*Jupiter Verified:* ${token.verification.jup_verified ? 'Yes' : 'No'}`,
            );
            verificationFields.push(
                `*Jupiter Strict:* ${token.verification.jup_strict ? 'Yes' : 'No'}`,
            );
            if (token.verification.links?.length) {
                verificationFields.push(
                    `*Links:* ${token.verification.links.join(', ')}`,
                );
            }
            lines.push(`\n*VERIFICATION*`);
            lines.push(verificationFields.join('\n'));
        }

        // Authorities
        const authorityFields: string[] = [];
        if (token.freezeAuthority !== undefined) {
            authorityFields.push(
                `*Freeze Authority:* ${token.freezeAuthority ? 'Enabled' : 'Disabled'}`,
            );
        }
        if (token.mintAuthority !== undefined) {
            authorityFields.push(
                `*Mint Authority:* ${token.mintAuthority ? 'Enabled' : 'Disabled'}`,
            );
        }
        if (authorityFields.length > 0) {
            lines.push(`\n*AUTHORITIES*`);
            lines.push(authorityFields.join('\n'));
        }

        // Community Sentiment
        if (tokenVote) {
            lines.push(`\n*COMMUNITY SENTIMENT*`);
            lines.push(`Upvote - ${tokenVote.up} 🚀`);
            lines.push(`Downvote - ${tokenVote.down} 💩`);
        }

        // Truncate to Telegram’s 4096-character limit
        const fullMessage = lines.join('\n');

        return {
            message:
                fullMessage.length > 4096
                    ? fullMessage.substring(0, 4093) + '...'
                    : fullMessage,
            keyboard: [
                [
                    {
                        text: 'Trade 🤖',
                        url: `https://t.me/fluxbeam_bot?start=ca-${token.mint}`,
                    },
                    {
                        text: 'Track Creator 🕵️',
                        url: `${process.env.BOT_URL}?start=ca-${token.mint}`,
                    },
                ],
                [
                    {
                        text: 'Chart 📈',
                        url: `https://fluxbeam.xyz/${token.mint}?chain=solana&utm_source=rugcheck`,
                    },
                    {
                        text: 'Explorer 🔎',
                        url: `https://solana.fm/address/${token.mint}?cluster=mainnet-alpha`,
                    },
                ]
            ],
        };
    }
}