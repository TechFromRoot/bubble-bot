# Bubblebot Documentation

Bubblebot is a multichain Telegram bot that provides deep insights into token safety and activity. It integrates data from BubbleMaps and RugCheck to offer transparency, risk analysis, and contract verification for any token address.

## Features

- 🧠 **Bubble Map Image** – Visualize token holder relationships.
- 📈 **Token Stats** – View Price, Market Cap, Total Supply, and Liquidity.
- ⚠️ **Risk Score (0-100)** – Automated scoring with warning indicators.
- 🐋 **Top 5 Holders** – Whale concentration & distribution metrics.
- 🔄 **Decentralization Stats** – Holder count, holder type ratio, etc.
- ✅ **Contract Verification** – Cross-checked via Jupiter.
- 🔐 **Authority Checks** – Identifies Freeze/Mint capabilities.
- 🔗 **Explorer & Actions** – Direct links for trading and viewing on-chain.

## Tech Stack

- **Framework**: NestJS
- **Data Sources**:
  - [BubbleMaps](https://www.bubblemaps.io)
  - [RugCheck](https://rugcheck.xyz)

## Installation

```bash
git clone https://github.com/TechFromRoot/bubble-bot.git
npm install
```

## Environment Variables

Create a `.env` file in the root and fill in the following:

```env
MONGO_URI=your_db_uri
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_POLLING=true
BOT_URL=https://t.me/Syntra_vybeBot
```

## Running Locally

```bash
npm run start:dev
```

## Usage

- Start the bot by messaging it on Telegram.
- Send any token address to get:
  - A generated bubble map image.
  - Key stats like price, liquidity, and market cap.
  - Top holders and decentralization info.
  - Risk score and danger factors.
  - Contract authority and verification status.
  - Explorer links for trading, analysis, and more.

## Methodology

- **Bubble Map**: Generated using BubbleMaps' API with token holder graph data.
- **Risk Score**: Combines liquidity lock duration, holder centralization, contract audit flags, and authority risks.
- **Danger Factors**: Flags potential issues like mint access, honeypots, or suspicious whales.
- **Contract Verification**: Compares source on explorer and cross-verifies with Jupiter DB.

## Dependencies

- `@nestjs/core`
- `bubblemaps-sdk`

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## License

[MIT](./LICENSE)