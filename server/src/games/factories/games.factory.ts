import { Injectable } from '@nestjs/common';
import humanId from 'human-id';
import { nanoid } from 'nanoid';
import { Game } from 'src/database/schemas/game.schema';
import { GameOptionsConfig as conf } from '../consts/games.consts';
import { Player } from '../../database/schemas/player.schema';
import { Round } from 'src/database/schemas/round.schema';

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
        numberOfWhiteCards: conf.numberOfWhiteCards.default,
        numberOfBlackCards: conf.numberOfBlackCards.default,
        winConditions: {
          scoreLimit: conf.winConditions.scoreLimit.default,
          useScoreLimit: conf.winConditions.useScoreLimit.default,
          roundLimit: conf.winConditions.roundLimit.default,
          useRoundLimit: conf.winConditions.useRoundLimit.default,
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

  createPlayer(isHost: boolean): Player {
    return {
      socketId: '',
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

  createRound(round: number, cardCzarId: string): Round {
    return {
      round,
      cardIndex: 0,
      blackCard: undefined,
      cardCzarId,
      playedCards: [],
    };
  }
}
