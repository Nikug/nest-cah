import { Injectable } from '@nestjs/common';
import humanId from 'human-id';
import { Game } from 'src/games/schemas/game.schema';
import { GameOptionsConfig as conf } from '../consts/games.consts';

@Injectable()
export class GamesFactory {
  createGame(): Game {
    return {
      name: this.generateName(),
      state: 'lobby',
      players: [],
      cards: {
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
        cardPacks: [],
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
}
