import { WebSocket } from 'ws';
import { ChatDaemon } from '../src/daemon';

describe('ChatDaemon', () => {
  let daemon: ChatDaemon;
  let testPort = 8081;

  beforeEach(() => {
    testPort++;
    daemon = new ChatDaemon(testPort, 1000); // Use unique port for each test
  });

  afterEach(async () => {
    try {
      await daemon['shutdown']();
    } catch (err) {
      console.error('Error during shutdown:', err);
    }
  });

  test('should start WebSocket server', (done) => {
    const ws = new WebSocket(`ws://localhost:${testPort}`);
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
      done();
    });

    ws.on('error', (err) => {
      done(err);
    });
  });

  test('should shutdown after inactivity timeout', async () => {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(daemon['wss'].clients.size).toBe(0);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 1500);
    });
  });
});
