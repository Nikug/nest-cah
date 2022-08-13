import { PlayerState } from '../interfaces/games.interfaces';

export const GameOptionsConfig = {
  maximumPlayers: {
    min: 2,
    default: 20,
    max: 50,
  },
  winnerBecomesCardCzar: {
    default: false,
  },
  allowKickedPlayerJoin: {
    default: true,
  },
  allowCardCzarPopularVote: {
    default: true,
  },
  allowPopularVote: {
    default: true,
  },
  password: {
    default: undefined,
  },
  numberOfWhiteCards: {
    min: 3,
    default: 10,
    max: 25,
  },
  numberOfBlackCards: {
    min: 1,
    default: 3,
    max: 25,
  },
  scoreLimit: {
    min: 1,
    default: 5,
    max: 500,
  },
  useScoreLimit: {
    default: true,
  },
  roundLimit: {
    min: 1,
    default: 10,
    max: 500,
  },
  useRoundLimit: {
    default: false,
  },
  // Times are in seconds
  timers: {
    blackCardSelect: {
      min: 5,
      default: 30,
      max: 300,
    },
    useBlackCardSelect: {
      default: true,
    },
    whiteCardSelect: {
      min: 5,
      default: 60,
      max: 300,
    },
    useWhiteCardSelect: {
      default: true,
    },
    blackCardRead: {
      min: 5,
      default: 30,
      max: 300,
    },
    useBlackCardRead: {
      default: true,
    },
    winnerSelect: {
      min: 5,
      default: 90,
      max: 500,
    },
    useWinnerSelect: {
      default: true,
    },
    roundEnd: {
      min: 5,
      default: 15,
      max: 500,
    },
    useRoundEnd: {
      default: true,
    },
  },
};

export const ActivePlayerStates: PlayerState[] = [
  'ready',
  'playing',
  'finished',
  'joining',
];

export const InactivePlayerStates: PlayerState[] = [
  'pickingName',
  'disconnected',
  'leaving',
  'left',
];
