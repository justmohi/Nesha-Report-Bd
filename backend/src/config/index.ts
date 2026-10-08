import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
  maxEvidenceFileSizeMb: parseInt(process.env.MAX_EVIDENCE_FILE_SIZE_MB || '20', 10),
  isTelegramConfigured: Boolean(
    process.env.TELEGRAM_BOT_TOKEN &&
    process.env.TELEGRAM_CHANNEL_ID &&
    process.env.TELEGRAM_BOT_TOKEN !== 'your_bot_token' &&
    process.env.TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here'
  ),
};
