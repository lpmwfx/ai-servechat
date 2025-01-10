import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

export class ChatDaemon {
  private wss: WebSocketServer;
  private inactivityTimer?: NodeJS.Timeout;
  private inactivityTimeout: number;
  private port: number;

  constructor(port: number = 8080, timeout: number = 300000) {
    this.port = port;
    this.inactivityTimeout = timeout;
    const server = createServer();
    this.wss = new WebSocketServer({ server });
    
    server.listen(this.port, () => {
      console.log(`Chat daemon running on ws://localhost:${this.port}`);
    });

    this.setupWebSocketHandlers();
    this.resetInactivityTimer();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');
      this.resetInactivityTimer();

      ws.on('message', (message: string) => {
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

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    
    this.inactivityTimer = setTimeout(() => {
      console.log('Inactivity timeout reached. Shutting down...');
      this.shutdown();
    }, this.inactivityTimeout);
  }

  private async shutdown() {
    // Close all client connections
    const closePromises = Array.from(this.wss.clients).map((client) => {
      return new Promise<void>((resolve) => {
        if (client.readyState === WebSocket.OPEN) {
          client.close();
          client.on('close', resolve);
        } else {
          resolve();
        }
      });
    });

    await Promise.all(closePromises);
    
    // Close the server
    return new Promise<void>((resolve) => {
      this.wss.close(() => {
        if (process.env.NODE_ENV !== 'test') {
          process.exit(0);
        }
        resolve();
      });
    });
  }
}

new ChatDaemon();
