const express = require('express');
const axios = require('axios');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8081;

// Express app for GitHub repositories API
app.get('/', async (req, res) => {
  const username = req.query.username || 'myogeshchavan97';
  try {
    const result = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = result.data
      .map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
      }))
      .sort((a, b) => b.stars - a.stars);

    res.send(repos);
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

// Express app for custom API endpoints
app.use('/custom', (req, res) => {
  // Set headers to allow cross-origin requests (CORS)
  const origin = req.headers.origin;

  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Check different API paths
  if (req.method === 'GET' && req.url === '/session') {
    // Set the cookie with SameSite=None and HttpOnly
    res.setHeader('Set-Cookie', '_d=testingFor_d; SameSite=None; Secure; HttpOnly');

    // Send a simple response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Cookie set successfully and greeting: Hello!');
  } else if (req.method === 'GET' && req.url === '/helloFromOmnibar') {
    // Send a simple response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('greeting: Hello!');
  } else if (req.method === 'GET' && req.url === '/helloFromIframe') {
    // Send a simple response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('greeting: helloFromIframe!');
  } else {
    // Handle other HTTP methods or paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the combined Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
