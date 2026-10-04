const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Only these two public files can be served.
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8']
};

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}

http.createServer(async (req, res) => {
  if (req.method === 'GET' && files[req.url]) {
    const [name, type] = files[req.url];
    res.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
    return res.end(fs.readFileSync(path.join(__dirname, 'public', name)));
  }
  if (req.method !== 'POST' || req.url !== '/api/login') {
    return json(res, 404, { message: 'Not found' });
  }
  if (!(req.headers['content-type'] || '').startsWith('application/json')) {
    return json(res, 415, { message: 'Send JSON' });
  }
  try {
    let body = '';
    let bytes = 0;
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > 4096) return json(res, 413, { message: 'Request too large' });
      body += chunk;
    }
    const data = JSON.parse(body);
    if (!data || typeof data !== 'object') {
      return json(res, 400, { message: 'Invalid request' });
    }
    const { email, password } = data;
    // Repeat validation here: callers can bypass browser JavaScript.
    if (typeof email !== 'string' || !email.trim() || !email.includes('@') ||
        typeof password !== 'string' || !password.trim() || password.length < 8) {
      return json(res, 400, { message: 'Enter an email containing @ and a password of at least 8 characters.' });
    }
    // Validation demo only. No account lookup, session, SQL, or password storage.
    return json(res, 200, { message: `Validation passed for ${email}. This demo does not authenticate accounts.` });
  } catch {
    return json(res, 400, { message: 'Invalid JSON request' });
  }
}).listen(3000, '127.0.0.1', () => console.log('Open http://localhost:3000'));
