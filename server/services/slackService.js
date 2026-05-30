const { WebClient } = require('@slack/web-api');

const slack = new WebClient(process.env.SLACK_TOKEN);

const getChannelMessages = async (channelName = 'github-issues', limit = 20) => {
  const channelList = await slack.conversations.list({ limit: 100 });
  const channel = channelList.channels.find(c => c.name === channelName);
  
  if (!channel) throw new Error(`Channel #${channelName} not found`);

  const history = await slack.conversations.history({
    channel: channel.id,
    limit
  });

  return history.messages
    .filter(m => m.text && m.type === 'message' && !m.bot_id)
    .map(m => ({
      text: m.text,
      timestamp: new Date(parseFloat(m.ts) * 1000).toISOString(),
      ts: m.ts
    }));
};

module.exports = { getChannelMessages };