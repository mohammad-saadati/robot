import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = createServer(async (req, res) => {
  // Serve the HTML file
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = join(__dirname, 'src', 'index.html');
    try {
      const data = await readFile(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
    }
  }
  // Serve the compiled JavaScript file
  else if (req.url === '/dist/index.js') {
    const filePath = join(__dirname, 'dist', 'index.js');
    try {
      const data = await readFile(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Error loading index.js');
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
