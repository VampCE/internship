const express = require('express');
const cors = require('cors');
const os = require('os');
const app = express();
const PORT = 61000;

// Function to get the local IP address
const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback to localhost if no external address is found
};

const LOCAL_IP = getLocalIpAddress();

app.use(cors());

app.use(express.json());


app.post('/send', (req, res) => {
    console.log('Received layout:', req.body.layout);
    console.log('Received cameras:', req.body.selectedCameras);

    // Simulate some processing time
    setTimeout(() => {
        res.json({ status: 'ready' });
    }, 2000); // Simulates a delay of 2 seconds
});

app.listen(PORT, LOCAL_IP, () => {
    console.log(`Server running at http://${LOCAL_IP}:${PORT}`);
});
