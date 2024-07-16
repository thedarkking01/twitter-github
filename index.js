const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

app.get('/post-to-twitter', async (req, res) => {
  try {
    const githubResponse = await fetch(`https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const repoData = await githubResponse.json();
    const tweetText = `Check out the latest updates on ${repoData.name}: ${repoData.html_url}`;

    const { data: createdTweet } = await twitterClient.v1.tweet(tweetText);

    res.json({ message: 'Tweet posted successfully!', tweet: createdTweet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to post tweet', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
