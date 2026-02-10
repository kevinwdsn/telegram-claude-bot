const { Telegraf } = require('telegraf');
const Anthropic = require('@anthropic-ai/sdk');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  
  try {
    await ctx.sendChatAction('typing');
    
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }],
    });
    
    await ctx.reply(message.content[0].text);
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply('Sorry, I encountered an error. Please try again.');
  }
});

bot.launch();
console.log('Bot is running!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
