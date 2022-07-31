import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { io } from 'socket.io-client';
import { GamesFactory } from 'src/games/factories/games.factory';
import { GamesRepository } from 'src/database/repositories/games.repository';
import { GamesGateway } from 'src/games/gateways/games.gateway';
import { SocketMessages } from 'src/games/consts/sockets.consts';
import { GamesController } from 'src/games/games.controller';
import { GamesService } from 'src/games/services/games.service';
import { AppModule } from 'src/app.module';

const gamesRepository: Partial<GamesRepository> = {
  gameExists: jest.fn().mockImplementation(async () => true),
  gameHasHost: jest.fn().mockImplementation(async () => false),
  addPlayer: jest.fn().mockImplementation(async () => undefined),
  setPlayerSocket: jest.fn().mockImplementation(async () => 0),
};

describe('Gateway', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [GamesRepository, GamesGateway, GamesService, GamesFactory],
    })
      .overrideProvider(GamesRepository)
      .useValue(gamesRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  afterEach(() => jest.restoreAllMocks());

  const getClientSocket = (app: INestApplication) => {
    const server = app.getHttpServer();
    if (!server.address()) {
      server.listen(0);
    }

    const address = server.address();
    const socketAddress = `http://[${address.address}]:${address.port}`;
    const socket = io(socketAddress);

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

    socket.on(SocketMessages.ping, (data) => {
      expect(data).toBe(message);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      done();
    });
  });

  it('should allow joining a game', async () => {
    // Game is created
    const factory = app.get(GamesFactory);
    const game = factory.createGame();
    const player = factory.createPlayer('socket', true);

    const addPlayerSpy = jest
      .spyOn(gamesRepository, 'addPlayer')
      .mockImplementation(async () => ({ ...game, players: [player] }));

    // Call join game without player id
    // Should return gameId and player id
    await request(app.getHttpServer())
      .post(`/games/join/${game.name}`)
      .expect(201)
      .expect({
        gameName: game.name,
        playerId: player.id,
      });

    expect(addPlayerSpy).toHaveBeenCalledTimes(1);
  });

  it('should allow subscribing to a game', (done) => {
    const factory = app.get(GamesFactory);
    const game = factory.createGame();
    const player = factory.createPlayer('socket', true);
    game.players = [player];
    const repository = app.get(GamesRepository);

    const socket = getClientSocket(app);
    socket.on('connect', () => {
      socket.emit(SocketMessages.subscribe, {
        gameName: game.name,
        playerId: player.id,
      });
    });

    socket.on(SocketMessages.subscribe, (response) => {
      socket.disconnect();
      expect(response).toBe('ok');
      expect(repository.setPlayerSocket).toHaveBeenCalledTimes(1);
    });

    socket.on('disconnect', () => {
      done();
    });
  });
});
