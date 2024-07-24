const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

const receiveServer = new WebSocketServer({ port: 61000 });
receiveServer.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log('Received data:', message);
        setTimeout(() => {
            readyServer.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('ready');
                }
            });
        }, 2000);
    });

    socket.on('close', () => console.log(`Client disconnected from port ${61000}`));
});

const readyServer = new WebSocketServer({ port: 61001 });
readyServer.on('connection', (socket) => {
    socket.on('message', (message) => {
        console.log('Received:', message);
    });
    socket.on('close', () => console.log(`Client disconnected from port 61001`));
});

console.log(`WebSocket servers are running on ws://localhost:61000 and ws://localhost:61001`);
