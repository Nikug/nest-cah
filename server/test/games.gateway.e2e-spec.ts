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

  it('should allow connecting', (done) => {
    const message = 'ping!';
    const address = app.getHttpServer().listen().address();
    const socketAddress = `http://[${address.address}]:${address.port}`;

    const socket = io();

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('ping', (data) => {
      expect(data).toBe(message);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      done();
    });

    socket.emit('ping', message);
    socket.disconnect();
  });
});
