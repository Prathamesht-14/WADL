// Step 1: Import modules
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Step 2: Port
const PORT = 1800;

// MIME Types
const mimeType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.pdf': 'application/pdf'
};

// Step 3: Create Server
http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url);

    // Step 4: If root → list files
    if (parsedUrl.pathname === "/") {
        let filesLink = "<ul>";
        res.setHeader('Content-type', 'text/html');

        let filesList = fs.readdirSync("./");

        filesList.forEach(file => {
            if (fs.statSync("./" + file).isFile()) {
                filesLink += `<li><a href='/${file}'>${file}</a></li>`;
            }
        });

        filesLink += "</ul>";

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Static File Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
            padding: 20px;
        }

        h1 {
            margin-bottom: 20px;
        }

        .container {
            background: white;
            color: black;
            padding: 20px;
            border-radius: 12px;
            width: 50%;
            margin: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            margin: 10px 0;
        }

        a {
            text-decoration: none;
            color: #667eea;
            font-weight: bold;
        }

        a:hover {
            color: #ff6b6b;
        }

        .btn {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 15px;
            background: #667eea;
            color: white;
            border-radius: 8px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            opacity: 0.7;
        }
    </style>
</head>

<body>
    <h1>📁 Static File Server</h1>

    <div class="container">
        <h3>Available Files</h3>
        ${filesLink}

        <!-- Added Button -->
        <a class="btn" href="/about.html">Go to About Page</a>
        <a class="btn" href="/contact.html">Go to Contact Page</a>
    </div>

    <div class="footer">
        Node.js Static Server | PICT Assignment
    </div>
</body>
</html>
`;

        res.end(htmlTemplate);
    }

    else {
        // Step 5: Prevent directory traversal
        const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        let pathname = path.join(__dirname, sanitizePath);

        // Step 6: Check file exists
        if (!fs.existsSync(pathname)) {
            res.statusCode = 404;
            res.end("File not found");
        }

        else {
            fs.readFile(pathname, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Error reading file");
                } else {
                    const ext = path.extname(pathname);
                    res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                    res.end(data);
                }
            });
        }
    }

}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});