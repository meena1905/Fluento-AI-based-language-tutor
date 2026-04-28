const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');


require('dotenv').config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const PORT = 3000;


const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { system, messages } = JSON.parse(body);
        callGroq(system, messages, res);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});


function callGroq(systemPrompt, messages, res) {
  const payload = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 700,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const groqReq = https.request(options, groqRes => {
    let data = '';
    groqRes.on('data', chunk => data += chunk);
    groqRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: parsed.error.message }));
          return;
        }
        const content = parsed.choices[0].message.content;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse Groq response' }));
      }
    });
  });

  groqReq.on('error', e => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  });

  groqReq.write(payload);
  groqReq.end();
}

server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🌍  Fluento Server is RUNNING!       ║');
  console.log('║                                        ║');
  console.log('║   Open this in your browser:           ║');
  console.log('║   → http://localhost:3000              ║');
  console.log('║                                        ║');
  console.log('║   Press Ctrl+C to stop                 ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
