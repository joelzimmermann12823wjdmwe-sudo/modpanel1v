// start.js
const { exec } = require('child_process');
const PORT = process.env.PORT || 3000;

console.log(`Attempting to start PHP server on port ${PORT}...`);

// Führt den PHP-Startbefehl aus
const phpServer = exec(`php -S 0.0.0.0:${PORT} -t dashboard`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

phpServer.stdout.pipe(process.stdout);
phpServer.stderr.pipe(process.stderr);