import { Injectable } from '@nestjs/common';
import humanId from 'human-id';
import { nanoid } from 'nanoid';
import { Game } from 'src/games/schemas/game.schema';
import { GameOptionsConfig as conf } from '../consts/games.consts';
import { Player } from '../schemas/player.schema';

@Injectable()
export class GamesFactory {
  createGame(): Game {
    return {
      name: this.generateName(),
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
        maximumPlayers: conf.maximumPlayers.default,
        winnerBecomesCardCzar: conf.winnerBecomesCardCzar.default,
        allowKickedPlayerJoin: conf.allowKickedPlayerJoin.default,
        allowCardCzarPopularVote: conf.allowCardCzarPopularVote.default,
        allowPopularVote: conf.allowPopularVote.default,
        password: conf.password.default,
        winConditions: {
          scoreLimit: conf.scoreLimit.default,
          useScoreLimit: conf.useScoreLimit.default,
          roundLimit: conf.roundLimit.default,
          useRoundLimit: conf.useRoundLimit.default,
        },
        timers: {
          blackCardSelect: conf.timers.blackCardSelect.default,
          useBlackCardSelect: conf.timers.useBlackCardSelect.default,
          whiteCardSelect: conf.timers.whiteCardSelect.default,
          useWhiteCardSelect: conf.timers.useWhiteCardSelect.default,
          blackCardRead: conf.timers.blackCardRead.default,
          useBlackCardRead: conf.timers.useBlackCardRead.default,
          winnerSelect: conf.timers.winnerSelect.default,
          useWinnerSelect: conf.timers.useWinnerSelect.default,
          roundEnd: conf.timers.roundEnd.default,
          useRoundEnd: conf.timers.useRoundEnd.default,
        },
      },
      rounds: [],
    };
  }

  generateName(): string {
    return humanId({ separator: '-', capitalize: false });
  }

  createPlayer(socketId: string, isHost: boolean): Player {
    return {
      socketId,
      id: nanoid(),
      publicId: nanoid(),
      name: '',
      state: 'pickingName',
      score: 0,
      avatar: {
        hat: 0,
        eye: 0,
        mouth: 0,
        skin: 0,
      },
      whiteCards: [],
      isCardCzar: false,
      isHost,
      isPopularVoteKing: false,
    };
  }
}
