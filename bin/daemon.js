"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDaemon = void 0;
const ws_1 = require("ws");
const http_1 = require("http");
class ChatDaemon {
    wss;
    inactivityTimer;
    inactivityTimeout;
    port;
    constructor(port = 8080, timeout = 300000) {
        this.port = port;
        this.inactivityTimeout = timeout;
        const server = (0, http_1.createServer)();
        this.wss = new ws_1.WebSocketServer({ server });
        server.listen(this.port, () => {
            console.log(`Chat daemon running on ws://localhost:${this.port}`);
        });
        this.setupWebSocketHandlers();
        this.resetInactivityTimer();
    }
    setupWebSocketHandlers() {
        this.wss.on('connection', (ws) => {
            console.log('New client connected');
            this.resetInactivityTimer();
            ws.on('message', (message) => {
                console.log('Received:', message.toString());
                this.resetInactivityTimer();
            });
            ws.on('close', () => {
                console.log('Client disconnected');
                if (this.wss.clients.size === 0) {
                    this.resetInactivityTimer();
                }
            });
        });
    }
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        this.inactivityTimer = setTimeout(() => {
            console.log('Inactivity timeout reached. Shutting down...');
            this.shutdown();
        }, this.inactivityTimeout);
    }
    async shutdown() {
        // Close all client connections
        const closePromises = Array.from(this.wss.clients).map((client) => {
            return new Promise((resolve) => {
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    client.close();
                    client.on('close', resolve);
                }
                else {
                    resolve();
                }
            });
        });
        await Promise.all(closePromises);
        // Close the server
        return new Promise((resolve) => {
            this.wss.close(() => {
                if (process.env.NODE_ENV !== 'test') {
                    process.exit(0);
                }
                resolve();
            });
        });
    }
}
exports.ChatDaemon = ChatDaemon;
new ChatDaemon();
