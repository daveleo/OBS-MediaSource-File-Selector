const fs = require('fs');
const net = require('net');
const path = require('path');
const OBSWebSocket = require('obs-websocket-js').default;

let mediaFolder = '';
let mediaName = 'DynamicMedia';
let obsIp = '127.0.0.1';
let obsPort = 4455;
let obsPassword = '';
let tcpPort = 12345;
let currentVideo = 'None';
const obs = new OBSWebSocket();

// Read variables from the txt file
function readVariables() {
    try {
        const data = fs.readFileSync('variables.txt', 'utf8');
        const lines = data.split('\n');
        for (const line of lines) {
            const index = line.indexOf(':');
            if (index !== -1) {
                const key = line.slice(0, index).trim();
                const value = line.slice(index + 1).trim().replace(/["']/g, ''); // Remove quotes if any
                if (key === 'Media_Folder') mediaFolder = value;
                if (key === 'Media_Name') mediaName = value;
                if (key === 'OBS_IP') obsIp = value;
                if (key === 'OBS_Port') obsPort = parseInt(value, 10);
                if (key === 'OBS_Pass') obsPassword = value;
                if (key === 'TCP_Port') tcpPort = parseInt(value, 10);
            }
        }
        if (!mediaFolder) {
            console.warn('No media folder specified.');
        }
    } catch (err) {
        console.error('Failed to read variables:', err);
    }
}

async function connectToObs() {
    try {
        await obs.connect(`ws://${obsIp}:${obsPort}`, obsPassword);
        console.log('Connected to OBS WebSocket.');
    } catch (err) {
        console.error('Failed to connect to OBS WebSocket:', err);
        setTimeout(connectToObs, 5000);
    }
}

async function setMediaSource(fileName) {
    if (!mediaFolder) {
        console.error('No media folder specified. Cannot set media source.');
        return;
    }
    const filePath = path.join(mediaFolder, fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`Media file ${filePath} does not exist.`);
        return;
    }
    try {
        await obs.call('SetInputSettings', {
            inputName: mediaName,
            inputSettings: {
                local_file: filePath
            }
        });
        console.log('Successfully set media source');
    } catch (err) {
        console.error('Failed to set media source:', err);
    }
}

function handleClientConnection(socket) {
    socket.on('data', function(data) {
        const videoFilename = data.toString().trim();
        console.log(`Received data: ${videoFilename}`);
        setMediaSource(videoFilename);
    });

    socket.on('error', function(err) {
        console.error('Socket error:', err);
    });

    socket.on('close', function() {
        console.log('Client connection closed.');
    });
}

function startTcpServer() {
    const server = net.createServer(handleClientConnection);

    server.listen(tcpPort, function() {
        console.log(`TCP server listening on port ${tcpPort}`);
    });

    server.on('error', function(err) {
        console.error('Server error:', err);
    });
}

function setupObsEventHandlers() {
    obs.on('ConnectionOpened', () => {
        console.log('WebSocket connection opened.');
    });

    obs.on('ConnectionClosed', () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(connectToObs, 5000);
    });

    obs.on('ConnectionError', (err) => {
        console.error('WebSocket connection error:', err);
        setTimeout(connectToObs, 5000);
    });
}

async function main() {
    readVariables();
    setupObsEventHandlers();
    await connectToObs();
    startTcpServer();
}

main().catch(err => {
    console.error('Error in main function:', err);
});
