import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { io, Socket } from 'socket.io-client';
import { GamesFactory } from 'src/games/factories/games.factory';
import { GamesRepository } from 'src/database/repositories/games.repository';
import { GamesGateway } from 'src/games/gateways/games.gateway';
import { SocketMessages } from 'src/games/consts/sockets.consts';
import { GamesController } from 'src/games/games.controller';
import { GamesService } from 'src/games/services/games.service';
import { Operation } from 'fast-json-patch';

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
      server.listen();
    }

    const address = server.address();
    const socketAddress = `http://[${address.address}]:${address.port}`;
    const socket = io(socketAddress, { multiplex: false, forceNew: true });

    return socket;
  };

  const waitForSockets = async (sockets: Socket[]) => {
    let connectedCount = 0;
    let escape = 0;
    sockets.forEach((socket) => socket.on('connect', () => connectedCount++));

    while (connectedCount < sockets.length) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      escape++;
      if (escape > 100) return false;
    }
    return true;
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
    const player = factory.createPlayer(true);

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
    const repository = app.get(GamesRepository);

    const socket = getClientSocket(app);
    socket.on('connect', () => {
      socket.emit(SocketMessages.subscribe, {
        gameName: 'game',
        playerId: 'id',
      });
    });

    socket.on(SocketMessages.subscribe, (response) => {
      expect(response).toBe('ok');
      expect(repository.setPlayerSocket).toHaveBeenCalledWith(
        'game',
        'id',
        socket.id,
      );
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      done();
    });
  });

  it('should update game options through sockets', (done) => {
    const repository = app.get(GamesRepository);
    const gateway = app.get(GamesGateway);
    const service = app.get(GamesService);

    const factory = app.get(GamesFactory);
    const playerSocket = getClientSocket(app);
    const hostSocket = getClientSocket(app);

    waitForSockets([playerSocket, hostSocket]).then(() => {
      const socketSpy = jest
        .spyOn(service, 'getPlayerSocket')
        .mockImplementation(async () => hostSocket.id);

      const game = factory.createGame();
      const player = factory.createPlayer(true);
      player.socketId = playerSocket.id;
      game.players = [player];
      gateway.server.sockets.socketsJoin(game.name);

      repository.isHost = jest.fn().mockImplementation(() => true);
      const updateSpy = jest
        .spyOn(service, 'updateGameOptions')
        .mockImplementation(
          async (gameName: string, patch: Operation[]) => patch,
        );

      const operation = { op: 'set', path: '/maximumPlayers', value: '12' };

      playerSocket.on('disconnect', () => {
        hostSocket.disconnect();
      });
      hostSocket.on('disconnect', () => done());

      playerSocket.on(SocketMessages.options, (data: Operation[]) => {
        expect(updateSpy).toBeCalledTimes(1);
        expect(data.length).toBe(1);
        expect(data[0]).toMatchObject(operation);
        playerSocket.disconnect();
      });

      request(app.getHttpServer())
        .post(`/games/options/${game.name}/hostId`)
        .send([operation])
        .expect(201)
        .expect([operation])
        .then();
    });
  });
});
