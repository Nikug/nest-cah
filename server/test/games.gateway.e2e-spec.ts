import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Test } from '@nestjs/testing';
import { io } from 'socket.io-client';
import { GamesFactory } from 'src/games/factories/games.factory';
import { GamesController } from 'src/games/games.controller';
import { GamesRepository } from 'src/database/repositories/games.repository';
import { GamesService } from 'src/games/services/games.service';
import { GamesGateway } from 'src/games/gateways/games.gateway';
import { SocketMessages } from 'src/games/consts/sockets.consts';
import { GamesModule } from 'src/games/games.module';
import { getModelToken } from '@nestjs/mongoose';
import { Game } from 'src/database/schemas/game.schema';

const gameModel: Game = {
  name: 'game',
  state: 'lobby',
  players: [],
  cards: {
    cardPacks: [],
    whiteCards: [],
    blackCards: [],
    sentBlackCards: [],
    whiteCardDiscard: [],
    blackCardDiscard: [],
    whiteCardDeck: [],
    blackCardDeck: [],
  },
  options: {
    maximumPlayers: 4,
    winnerBecomesCardCzar: true,
    allowKickedPlayerJoin: true,
    allowCardCzarPopularVote: false,
    allowPopularVote: true,
    password: undefined,
    winConditions: {
      scoreLimit: 4,
      useScoreLimit: true,
      roundLimit: 8,
      useRoundLimit: false,
    },
    timers: {
      blackCardSelect: 30,
      useBlackCardSelect: true,
      whiteCardSelect: 30,
      useWhiteCardSelect: true,
      blackCardRead: 30,
      useBlackCardRead: true,
      winnerSelect: 30,
      useWinnerSelect: true,
      roundEnd: 30,
      useRoundEnd: true,
    },
  },
  rounds: [],
};

describe('Gateway', () => {
  let app: INestApplication;
  const gamesRepository: Partial<GamesRepository> = {
    gameExists: async () => true,
    gameHasHost: async () => false,
    addPlayer: async () => undefined,
    setPlayerSocket: async () => 0,
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Game.name),
          useValue: gameModel,
        },
      ],
      imports: [GamesModule],
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

    socket.on(SocketMessages.ping, (data) => {
      expect(data).toBe(message);
      socket.disconnect();
    });

    socket.on('disconnect', () => {
      done();
    });
  });

  it('should allow joining a game', () => {
    // Game is created
    const factory = app.get(GamesFactory);
    const game = factory.createGame();
    const player = factory.createPlayer('socket', true);

    const addPlayerSpy = jest
      .spyOn(gamesRepository, 'addPlayer')
      .mockImplementation(async () => ({ ...game, players: [player] }));

    // Call join game without player id
    // Should return gameId and player id
    return request(app.getHttpServer())
      .post(`/join/${game.name}`)
      .expect(200)
      .expect({
        data: { gameName: game.name, playerId: player.id },
      });

    // Create socket connection
    // const socket = getClientSocket(app);
    // // Subscribe with the socket
    // socket.emit(SocketMessages.subscribe, {
    //   gameName: game.name,
    //   playerId: player.id,
    // });

    // const spy = jest.spyOn(gamesRepository, 'setPlayerSocket');

    // expect(spy).toHaveBeenCalledTimes(1);
    // socket.on('disconnect', () => done());
    // socket.disconnect();
  });
});
