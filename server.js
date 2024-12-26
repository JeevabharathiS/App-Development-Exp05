const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Serve the main HTML file
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
    // Serve the CSS file
    else if (req.url === '/style.css' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    // Serve the JSON data
    else if (req.url === '/data' && req.method === 'GET') {
        fs.readFile('data.json', (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    // Handle POST request to add data
    else if (req.url === '/add' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newItem = JSON.parse(body);
            fs.readFile('data.json', (err, data) => {
                if (err) throw err;
                const json = JSON.parse(data);
                newItem.id = json.length ? json[json.length - 1].id + 1 : 1;
                json.push(newItem);
                fs.writeFile('data.json', JSON.stringify(json, null, 2), err => {
                    if (err) throw err;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newItem));
                });
            });
        });
    }
    // Handle DELETE request to remove an item
    else if (req.url.startsWith('/delete') && req.method === 'DELETE') {
        const id = parseInt(req.url.split('/').pop(), 10);
        fs.readFile('data.json', (err, data) => {
            if (err) throw err;
            let json = JSON.parse(data);
            json = json.filter(item => item.id !== id);
            fs.writeFile('data.json', JSON.stringify(json, null, 2), err => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            });
        });
    }
    // 404 for other routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
