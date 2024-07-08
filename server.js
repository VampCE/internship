const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 61000 });

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        setTimeout(() => {
            const readyServer = new WebSocket('ws://localhost:61001');
            readyServer.on('open', () => {
                readyServer.send('ready');
            });
        }, 2000);
    });
});

const readyServer = new WebSocket.Server({ port: 61001 });

readyServer.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send('ack');
    });
});

console.log('WebSocket server is running on ws://localhost:61000 and ws://localhost:61001');
