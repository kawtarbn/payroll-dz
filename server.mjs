import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/styles.css': ['styles.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'], '/salary.js': ['salary.js', 'text/javascript'] };
http.createServer(async (req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try { res.setHeader('Content-Type', `${file[1]}; charset=utf-8`); res.end(await readFile(new URL(file[0], import.meta.url))); }
  catch { res.writeHead(500); res.end('Unable to load app'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Payroll app listening on port ' + (process.env.PORT || 3000)));
