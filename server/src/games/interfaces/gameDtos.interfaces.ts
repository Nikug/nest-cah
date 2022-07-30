export interface GameNameAndPlayerId {
  gameName: string;
  playerId: string;
}

export interface OptionsDto {
  maximumPlayers: number;
  winnerBecomesCardCzar: boolean;
  allowKickedPlayerJoin: boolean;
  allowCardCzarPopularVote: boolean;
  allowPopularVote: boolean;
  password?: string;
  winConditions: WinConditionsDto;
  timers: TimersDto;
}

export interface WinConditionsDto {
  scoreLimit: number;
  useScoreLimit: boolean;
  roundLimit: number;
  useRoundLimit: boolean;
}

export interface TimersDto {
  blackCardSelect: number;
  useBlackCardSelect: boolean;
  whiteCardSelect: number;
  useWhiteCardSelect: boolean;
  blackCardRead: number;
  useBlackCardRead: boolean;
  winnerSelect: number;
  useWinnerSelect: boolean;
  roundEnd: number;
  useRoundEnd: boolean;
}
