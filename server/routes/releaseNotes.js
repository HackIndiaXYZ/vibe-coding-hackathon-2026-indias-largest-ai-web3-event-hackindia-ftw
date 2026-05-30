const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateReleaseNotes } = require('../services/groqService');
const RunHistory = require('../models/RunHistory');

router.post('/', async (req, res) => {
  const { owner, repo } = req.body;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        },
        params: { state: 'closed', per_page: 15, sort: 'updated', direction: 'desc' }
      }
    );

    const rawPRs = response.data.map(pr => ({
      number: pr.number,
      title: pr.title,
      body: pr.body ? pr.body.slice(0, 150) : '',
      merged_at: pr.merged_at,
      labels: pr.labels.map(l => l.name)
    }));

    const sql = `SELECT number, title, body, merged_at, labels FROM github.pulls WHERE owner = '${owner}' AND repo = '${repo}' AND state = 'closed' ORDER BY number DESC LIMIT 15`;

    const notes = await generateReleaseNotes(rawPRs);

    await RunHistory.create({
      type: 'release-notes',
      repo: `${owner}/${repo}`,
      sqlQuery: sql,
      resultCount: rawPRs.length,
    });

    res.json({ notes, sqlQuery: sql, prCount: rawPRs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;