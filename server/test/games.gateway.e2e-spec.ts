import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { io } from 'socket.io-client';
import { GamesGateway } from '../src/games/gateways/games.gateway';

describe('Gateway', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [GamesGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.init();
  });

  afterAll(async () => await app.close());

  const getClientSocket = (app: INestApplication) => {
    const server = app.getHttpServer();
    if (!server.address()) {
      server.listen(0);
    }

    const address = server.address();
    const socketAddress = `http://[${address.address}]:${address.port}`;
    const socket = io(socketAddress, {
      path: '/socket',
    });

    return socket;
  };

  it('should be defined', () => {
    const gateway = app.get(GamesGateway);
    expect(gateway).toBeDefined();
  });

  it('should allow connecting, pinging and disconnecting', (done) => {
    const message = 'ping!';
    const socket = getClientSocket(app);

    socket.on('connect', () => {
      socket.emit('ping', message);
    });

    socket.on('ping', (data) => {
      expect(data).toBe(message);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      done();
    });
  });
});
