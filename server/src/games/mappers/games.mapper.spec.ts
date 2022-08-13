import { Game } from 'src/database/schemas/game.schema';
import { Options } from 'src/database/schemas/options.schema';
import { Player } from 'src/database/schemas/player.schema';
import { Round } from 'src/database/schemas/round.schema';
import * as mappers from './games.mapper';

describe('Games mapper', () => {
  it('should map streak', () => {
    const streak = {
      playerId: 'playerId',
      wins: 1,
    };
    const playerIds = {
      playerId: 'playerIdPublic',
    };

    const result = mappers.mapStreak(streak, playerIds);

    expect(result).toEqual({
      playerId: 'playerIdPublic',
      wins: 1,
    });
  });

  it('should create player id map', () => {
    const players: Player[] = [
      {
        id: 'playerId1',
        socketId: 'socketId1',
        publicId: 'publicId1',
        name: 'player1',
        state: 'ready',
        score: 0,
        avatar: {
          hat: 4,
          eye: 1,
          mouth: 2,
          skin: 3,
        },
        whiteCards: [],
        isCardCzar: false,
        isHost: true,
        isPopularVoteKing: false,
      },
      {
        id: 'playerId2',
        socketId: 'socketId2',
        publicId: 'publicId2',
        name: 'player2',
        state: 'ready',
        score: 0,
        avatar: {
          hat: 4,
          eye: 1,
          mouth: 2,
          skin: 3,
        },
        whiteCards: [],
        isCardCzar: true,
        isHost: false,
        isPopularVoteKing: false,
      },
    ];

    const result = mappers.mapPlayerIds(players);
    expect(result).toEqual({
      playerId1: 'publicId1',
      playerId2: 'publicId2',
    });
  });

  it('should map rounds', () => {
    const round: Round = {
      round: 1,
      cardIndex: 0,
      blackCard: {
        id: 'blackCardId',
        text: 'blackCardText',
        cardPackId: 'cardPackId',
        whiteCardsToPlay: 1,
      },
      cardCzarId: 'playerId4',
      playedCards: [
        {
          playerId: 'playerId1',
          popularVotes: ['playerId1', 'playerId2', 'playerId3'],
          winner: false,
          whiteCards: [
            {
              id: 'whiteCardId1',
              text: 'whiteCardText1',
              cardPackId: 'cardPackId',
            },
          ],
        },
        {
          playerId: 'playerId2',
          popularVotes: [],
          winner: false,
          whiteCards: [
            {
              id: 'whiteCardId2',
              text: 'whiteCardText2',
              cardPackId: 'cardPackId',
            },
          ],
        },
        {
          playerId: 'playerId3',
          popularVotes: ['playerId1'],
          winner: true,
          whiteCards: [
            {
              id: 'whiteCardId3',
              text: 'whiteCardText3',
              cardPackId: 'cardPackId',
            },
          ],
        },
      ],
    };
    const playerIds = {
      playerId1: 'playerPublicId1',
      playerId2: 'playerPublicId2',
      playerId3: 'playerPublicId3',
      playerId4: 'playerPublicId4',
    };

    const result = mappers.mapRound(round, playerIds);

    expect(result).toEqual({
      round: 1,
      cardIndex: 0,
      blackCard: {
        id: 'blackCardId',
        text: 'blackCardText',
        cardPackId: 'cardPackId',
        whiteCardsToPlay: 1,
      },
      cardCzarId: 'playerPublicId4',
      winnerId: 'playerPublicId3',
      playedCards: [
        {
          popularVotes: 3,
          winner: false,
          whiteCards: [
            {
              id: 'whiteCardId1',
              text: 'whiteCardText1',
              cardPackId: 'cardPackId',
            },
          ],
        },
        {
          popularVotes: 0,
          winner: false,
          whiteCards: [
            {
              id: 'whiteCardId2',
              text: 'whiteCardText2',
              cardPackId: 'cardPackId',
            },
          ],
        },
        {
          popularVotes: 1,
          winner: true,
          whiteCards: [
            {
              id: 'whiteCardId3',
              text: 'whiteCardText3',
              cardPackId: 'cardPackId',
            },
          ],
        },
      ],
    });
  });

  it('should map player', () => {
    const player: Player = {
      id: 'playerId',
      socketId: 'socketId',
      publicId: 'publicId',
      name: 'playerName',
      state: 'ready',
      score: 2,
      avatar: {
        hat: 2,
        eye: 4,
        mouth: 1,
        skin: 2,
      },
      whiteCards: [
        {
          id: 'whiteCardId',
          text: 'whiteCardText',
          cardPackId: 'cardPackId',
        },
      ],
      isCardCzar: false,
      isHost: false,
      isPopularVoteKing: true,
    };

    const result = mappers.mapPlayer(player);

    expect(result).toEqual({
      id: 'publicId',
      name: 'playerName',
      state: 'ready',
      score: 2,
      avatar: {
        hat: 2,
        eye: 4,
        mouth: 1,
        skin: 2,
      },
      isCardCzar: false,
      isHost: false,
      isPopularVoteKing: true,
    });
  });

  it('should map confidential player', () => {
    const player: Player = {
      id: 'playerId',
      socketId: 'socketId',
      publicId: 'publicId',
      name: 'playerName',
      state: 'ready',
      score: 2,
      avatar: {
        hat: 2,
        eye: 4,
        mouth: 1,
        skin: 2,
      },
      whiteCards: [
        {
          id: 'whiteCardId',
          text: 'whiteCardText',
          cardPackId: 'cardPackId',
        },
      ],
      isCardCzar: false,
      isHost: false,
      isPopularVoteKing: true,
    };

    const result = mappers.mapConfidentialPlayer(player);

    expect(result).toEqual({
      id: 'publicId',
      privateId: 'playerId',
      socketId: 'socketId',
      name: 'playerName',
      state: 'ready',
      score: 2,
      avatar: {
        hat: 2,
        eye: 4,
        mouth: 1,
        skin: 2,
      },
      isCardCzar: false,
      isHost: false,
      isPopularVoteKing: true,
      whiteCards: [
        {
          id: 'whiteCardId',
          text: 'whiteCardText',
          cardPackId: 'cardPackId',
        },
      ],
    });
  });

  it('should map game', () => {
    const playerSpy = jest.spyOn(mappers, 'mapPlayer');
    const streakSpy = jest.spyOn(mappers, 'mapStreak');
    const roundSpy = jest.spyOn(mappers, 'mapRound');

    const options: Options = {
      maximumPlayers: 6,
      winnerBecomesCardCzar: false,
      allowKickedPlayerJoin: false,
      allowCardCzarPopularVote: true,
      allowPopularVote: true,
      password: 'password',
      numberOfWhiteCards: 10,
      numberOfBlackCards: 10,
      winConditions: {
        scoreLimit: 5,
        useRoundLimit: false,
        roundLimit: 5,
        useScoreLimit: true,
      },
      timers: {
        blackCardSelect: 20,
        useBlackCardSelect: true,
        whiteCardSelect: 20,
        useWhiteCardSelect: true,
        blackCardRead: 10,
        useBlackCardRead: false,
        winnerSelect: 30,
        useWinnerSelect: true,
        roundEnd: 20,
        useRoundEnd: true,
      },
    };

    const game: Game = {
      name: 'gameName',
      state: 'selectingBlackCard',
      players: [],
      rounds: [],
      options: options,
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
      streak: undefined,
    };

    const result = mappers.mapGame(game);

    expect(result).toEqual({
      name: 'gameName',
      state: 'selectingBlackCard',
      rounds: [],
      options: options,
      streak: undefined,
    });

    expect(playerSpy).toHaveBeenCalledTimes(0);
    expect(roundSpy).toHaveBeenCalledTimes(0);
    expect(streakSpy).toHaveBeenCalledTimes(1);
  });
});
