import * as request from "supertest"
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { io } from 'socket.io-client';
import { GamesFactory } from 'src/games/factories/games.factory';
import { GamesController } from 'src/games/games.controller';
import { GamesRepository } from 'src/games/repositories/games.repository';
import { GamesService } from 'src/games/services/games.service';
import { GamesGateway } from '../src/games/gateways/games.gateway';

describe('Gateway', () => {
  let app: INestApplication;
  const gamesRepository: Partial<GamesRepository> = {
    gameExists: async () => true,
    gameHasHost: async () => false,
    addPlayer: async () => null
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [GamesGateway, GamesService, GamesRepository, GamesController],
    })
      .overrideProvider(GamesRepository)
      .useValue(gamesRepository)
      .compile();

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

  it('should allow joining a game', (done) => {
    // Game is created
    const factory = app.get(GamesFactory);
    const game = factory.createGame();
    const player = factory.createPlayer("socket", true)
    
    jest.spyOn(gamesRepository, 'addPlayer').mockImplementation(async () => ({ game, players: [player]}))
    
    request(app.getHttpServer())
    .get(`/join/${game.name}`)
    .expect(200)
    .expect({
      data: 
    })
    // Call join game without player id
    // Should return gameId and player id
    // Create socket connection
    // Subscribe with the socket
    // Should call the set player socket method
  });
});
